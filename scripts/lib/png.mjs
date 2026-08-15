/**
 * Minimal dependency-free PNG codec (8-bit RGBA, non-interlaced).
 *
 * Only exists so `build-brand-assets.mjs` can trim and compose the logo without
 * pulling an image library into the dependency tree. Scaling is delegated to
 * macOS `sips`, which resamples better than anything worth hand-rolling here.
 */
import zlib from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/* -- CRC32 ----------------------------------------------------------------- */
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = -1;
  for (let i = 0; i < buffer.length; i++) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/* -- Decode ---------------------------------------------------------------- */

/**
 * @returns {{width: number, height: number, data: Buffer}} RGBA, 4 bytes/px.
 */
export function decodePng(file) {
  let pos = 8;
  let header = null;
  const idat = [];

  while (pos < file.length) {
    const length = file.readUInt32BE(pos);
    const type = file.toString("ascii", pos + 4, pos + 8);
    const data = file.subarray(pos + 8, pos + 8 + length);

    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") break;

    pos += 12 + length;
  }

  const { width, height, depth, colorType, interlace } = header;
  if (depth !== 8 || interlace !== 0 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG: depth=${depth} colorType=${colorType} interlace=${interlace}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const px = Buffer.alloc(height * stride);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const out = px.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? px.subarray((y - 1) * stride, y * stride) : null;

    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? out[i - channels] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= channels ? prev[i - channels] : 0;
      let v = line[i];

      switch (filter) {
        case 1: v += a; break;
        case 2: v += b; break;
        case 3: v += (a + b) >> 1; break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
      }
      out[i] = v & 0xff;
    }
  }

  // Normalise to RGBA so callers never branch on colour type.
  if (channels === 4) return { width, height, data: px };

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < px.length; i += 3, j += 4) {
    rgba[j] = px[i];
    rgba[j + 1] = px[i + 1];
    rgba[j + 2] = px[i + 2];
    rgba[j + 3] = 255;
  }
  return { width, height, data: rgba };
}

/* -- Encode ---------------------------------------------------------------- */

export function encodePng({ width, height, data }) {
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));

  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* -- Operations ------------------------------------------------------------ */

/** Bounding box of pixels whose alpha exceeds `threshold`. */
export function alphaBounds({ width, height, data }, threshold = 12) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] <= threshold) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) throw new Error("Image is fully transparent");
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

export function crop(image, { x, y, width, height }) {
  const out = Buffer.alloc(width * height * 4);
  for (let row = 0; row < height; row++) {
    const from = ((y + row) * image.width + x) * 4;
    image.data.copy(out, row * width * 4, from, from + width * 4);
  }
  return { width, height, data: out };
}

/**
 * Centre `image` on a `size`×`size` canvas.
 *
 * @param background `null` for transparent, or `[r, g, b]`. iOS composites
 *        transparent home-screen icons onto black, so `apple-icon` needs a fill.
 */
export function square(image, size, background = null) {
  const data = Buffer.alloc(size * size * 4);

  if (background) {
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = background[0];
      data[i * 4 + 1] = background[1];
      data[i * 4 + 2] = background[2];
      data[i * 4 + 3] = 255;
    }
  }

  const offsetX = Math.round((size - image.width) / 2);
  const offsetY = Math.round((size - image.height) / 2);

  for (let y = 0; y < image.height; y++) {
    const targetY = offsetY + y;
    if (targetY < 0 || targetY >= size) continue;

    for (let x = 0; x < image.width; x++) {
      const targetX = offsetX + x;
      if (targetX < 0 || targetX >= size) continue;

      const s = (y * image.width + x) * 4;
      const d = (targetY * size + targetX) * 4;
      const alpha = image.data[s + 3] / 255;

      if (alpha === 0) continue;

      // Source-over compositing against whatever is already on the canvas.
      const baseAlpha = data[d + 3] / 255;
      const outAlpha = alpha + baseAlpha * (1 - alpha);

      for (let c = 0; c < 3; c++) {
        data[d + c] = Math.round(
          (image.data[s + c] * alpha + data[d + c] * baseAlpha * (1 - alpha)) / outAlpha,
        );
      }
      data[d + 3] = Math.round(outAlpha * 255);
    }
  }

  return { width: size, height: size, data };
}

/** Packs PNG buffers into an .ico container (PNG-in-ICO, supported since IE11). */
export function encodeIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  let offset = 6 + pngs.length * 16;

  for (const { size, buffer } of pngs) {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size; // 0 means 256
    entry[1] = size >= 256 ? 0 : size;
    entry[2] = 0; // palette
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32BE(0, 8);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buffer)]);
}
