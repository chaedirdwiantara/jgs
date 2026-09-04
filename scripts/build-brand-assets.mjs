/**
 * Derives every shipped brand asset from the single master artwork in
 * `assets/brand/jgs-logo-source.png`.
 *
 * Usage: node scripts/build-brand-assets.mjs
 *
 * Outputs are committed, so this only needs re-running when the master changes.
 * Scaling is done by macOS `sips` (Lanczos); trimming and canvas composition by
 * `scripts/lib/png.mjs`.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { alphaBounds, compose, crop, decodePng, encodeIco, encodePng, square } from "./lib/png.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "assets/brand/jgs-logo-source.png");
const TMP = join(root, ".brand-tmp");

/**
 * Width of the horizontal lockup served to the browser.
 *
 * The mark renders at most 92px wide (48px tall in the footer), so 360px covers
 * a 3× display with headroom. Going wider is pure payload: the artwork is full
 * of smooth gradients, and PNG grows steeply — 480px costs 106 KB against 61 KB
 * here, for detail no display can resolve.
 */
const LOCKUP_WIDTH = 360;
/** Breathing room around the mark inside square icons, as a fraction of size. */
const ICON_PADDING = 0.06;
/**
 * Open Graph card — 1200×630 is the one size every link-preview scraper
 * (WhatsApp, Facebook, LinkedIn, X, Slack) agrees on. The lockup is ~1.9:1,
 * the same shape as the card, so it is fitted to this fraction of the width
 * and centred. The card carries no text: `og:title` and `og:description`
 * already travel with it, and text baked into pixels cannot be updated from
 * `config/site.ts`.
 */
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_LOGO_FRACTION = 0.58;

mkdirSync(TMP, { recursive: true });
mkdirSync(join(root, "public/brand"), { recursive: true });

const resize = (input, output, width) =>
  execFileSync("sips", ["--resampleWidth", String(width), "--out", output, input], {
    stdio: "ignore",
  });

const write = (path, image) => {
  const buffer = encodePng(image);
  writeFileSync(path, buffer);
  console.log(`  ${path.replace(`${root}/`, "")}  ${image.width}×${image.height}  ${(buffer.length / 1024).toFixed(1)} KB`);
};

/* -- 1. Trim the transparent margin off the master -------------------------- */
const master = decodePng(readFileSync(SOURCE));
const bounds = alphaBounds(master);
const trimmed = crop(master, bounds);

console.log(`Source ${master.width}×${master.height} → trimmed ${trimmed.width}×${trimmed.height}`);

const trimmedPath = join(TMP, "trimmed.png");
writeFileSync(trimmedPath, encodePng(trimmed));

/* -- 2. Horizontal lockup used by the site header and footer ---------------- */
console.log("\nLockup:");
resize(trimmedPath, join(root, "public/brand/jgs-logo.png"), LOCKUP_WIDTH);
const lockup = decodePng(readFileSync(join(root, "public/brand/jgs-logo.png")));
console.log(
  `  public/brand/jgs-logo.png  ${lockup.width}×${lockup.height}  ` +
    `${(readFileSync(join(root, "public/brand/jgs-logo.png")).length / 1024).toFixed(1)} KB`,
);

/* -- 3. Square icons -------------------------------------------------------- */
// The lockup is ~1.9:1, so it is fitted to the icon's width and centred
// vertically; the leftover bands stay transparent (or filled, for Apple).
const squareIcon = (size, background) => {
  const inner = Math.round(size * (1 - ICON_PADDING * 2));
  const scaled = join(TMP, `icon-${size}.png`);
  resize(trimmedPath, scaled, inner);
  return square(decodePng(readFileSync(scaled)), size, background);
};

console.log("\nIcons:");
write(join(root, "src/app/icon.png"), squareIcon(256, null));
// iOS composites transparency onto black, so the home-screen icon gets the
// brand's secondary colour as a backdrop.
write(join(root, "src/app/apple-icon.png"), squareIcon(180, [255, 255, 255]));

/* -- 4. favicon.ico (32 + 48, PNG-encoded) ---------------------------------- */
const icoSizes = [48, 32];
const icoBuffer = encodeIco(
  icoSizes.map((size) => ({ size, buffer: encodePng(squareIcon(size, null)) })),
);
writeFileSync(join(root, "src/app/favicon.ico"), icoBuffer);
console.log(
  `  src/app/favicon.ico  ${icoSizes.join(" + ")}  ${(icoBuffer.length / 1024).toFixed(1)} KB`,
);

/* -- 5. Open Graph card ----------------------------------------------------- */
console.log("\nOpen Graph:");
const ogLogoPath = join(TMP, "og-logo.png");
resize(trimmedPath, ogLogoPath, Math.round(OG_WIDTH * OG_LOGO_FRACTION));
write(
  join(root, "src/app/opengraph-image.png"),
  compose(decodePng(readFileSync(ogLogoPath)), OG_WIDTH, OG_HEIGHT, [255, 255, 255]),
);

rmSync(TMP, { recursive: true, force: true });
console.log("\nDone.");
