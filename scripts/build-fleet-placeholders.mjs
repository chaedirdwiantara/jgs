/**
 * Generates the stand-in fleet photography in `public/images/fleet/`.
 *
 * Usage: node scripts/build-fleet-placeholders.mjs
 *
 * ⚠️ These are PLACEHOLDERS. They exist so the hero carousel and the rest of the
 * layout can be built and reviewed against real image dimensions (16:10) before
 * the shoot happens. To go live, drop the real photos in at the same paths and
 * update `photo` in `src/data/vehicles.ts` — no component changes are needed.
 *
 * They are rendered as studio illustrations rather than stock photos of cars the
 * company does not own, which would misrepresent the fleet.
 *
 * The car outline is the one already used by `VehicleIllustration`, reused here
 * rather than redrawn: its body and glass paths are known to line up, which
 * hand-authored replacements were not.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(root, "public/images/fleet");

const WIDTH = 1600;
const HEIGHT = 1000;

/**
 * Where the tyres meet the floor.
 *
 * Sits high in the frame on purpose: the hero carousel lays a caption over the
 * bottom third of every slide, and at a lower ground line the car ends up
 * behind the vehicle name. Real photography should be framed the same way.
 */
const GROUND_Y = 620;

/* -- Shared car geometry, in its original 320×160 space -------------------- */
const CAR = {
  body:
    "M42 108c-9 0-14-5-14-13 0-11 6-17 18-20l24-6 22-21c6-6 14-9 23-9h50c10 0 19 4 26 11l19 19 25 6c13 3 20 10 20 21 0 8-5 12-14 12H42Z",
  glass:
    "M104 68 121 51c3-3 7-5 11-5h22v22h-50Zm60-22h20c5 0 10 2 14 6l16 16h-50V46Z",
  wheels: [
    { x: 96, y: 110 },
    { x: 230, y: 110 },
  ],
  wheelRadius: 22,
  /** Ground line in source units — where the tyres meet the floor. */
  groundY: 132,
};

/** Body paints, matching the `accent` values in `src/data/vehicles.ts`. */
const paints = {
  red: { light: "#ff5b5b", base: "#d90000", dark: "#6d0d0d" },
  silver: { light: "#f2f5f9", base: "#c6ccd8", dark: "#6f7a8c" },
  graphite: { light: "#78839a", base: "#414b5d", dark: "#161c28" },
  white: { light: "#ffffff", base: "#e6eaf1", dark: "#8b95a6" },
};

/**
 * Vehicles to render, kept in step with the seed catalogue.
 *
 * `scale` is the only per-unit geometry change: a people-mover should read
 * larger than a city car, and nudging one number cannot break the outline the
 * way four bespoke silhouettes did.
 */
const fleet = [
  { id: "air-ev", accent: "white", scale: 3.7 },
  { id: "dolphin", accent: "silver", scale: 3.9 },
  { id: "ioniq-5", accent: "graphite", scale: 4.2 },
  { id: "seal", accent: "silver", scale: 4.1 },
  { id: "d9", accent: "red", scale: 4.5 },
];

/** Places the car centred on the stage, sitting on a common ground line. */
function transformFor(scale) {
  const centreX = 164; // midpoint of the car in source units
  const x = WIDTH / 2 - centreX * scale;
  const y = GROUND_Y - CAR.groundY * scale;
  return `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale})`;
}

const wheel = ({ x, y }) => `
      <circle cx="${x}" cy="${y}" r="${CAR.wheelRadius}" fill="#0b0e14"/>
      <circle cx="${x}" cy="${y}" r="${CAR.wheelRadius - 2}" fill="url(#tyre)"/>
      <circle cx="${x}" cy="${y}" r="${CAR.wheelRadius - 9}" fill="url(#rim)"/>
      <circle cx="${x}" cy="${y}" r="4" fill="#eef1f6"/>`;

function render({ accent, scale }) {
  const paint = paints[accent];
  const transform = transformFor(scale);

  const car = `
    <path d="${CAR.body}" fill="url(#body)"/>
    <path d="${CAR.glass}" fill="url(#glass)"/>
    <rect x="252" y="86" width="24" height="7" rx="3.5" fill="#fff6e0" opacity="0.95"/>
    <rect x="44" y="86" width="20" height="7" rx="3.5" fill="#ff6b6b" opacity="0.75"/>
    ${CAR.wheels.map(wheel).join("")}
    <path d="${CAR.body}" fill="url(#sheen)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="presentation">
  <defs>
    <radialGradient id="backdrop" cx="50%" cy="34%" r="80%">
      <stop offset="0%" stop-color="#2c333f"/>
      <stop offset="55%" stop-color="#151b25"/>
      <stop offset="100%" stop-color="#070a0f"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#141922"/>
      <stop offset="100%" stop-color="#070a0f"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d90000" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#d90000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="body" x1="0.1" y1="0" x2="0.45" y2="1">
      <stop offset="0%" stop-color="${paint.light}"/>
      <stop offset="42%" stop-color="${paint.base}"/>
      <stop offset="100%" stop-color="${paint.dark}"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="#5d6b81"/>
      <stop offset="55%" stop-color="#212a39"/>
      <stop offset="100%" stop-color="#0d121a"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0.85" y2="0.6">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="38%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="52%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="tyre" cx="40%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#2b3240"/><stop offset="100%" stop-color="#0b0e14"/>
    </radialGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f1f4f8"/><stop offset="100%" stop-color="#8d97a8"/>
    </linearGradient>
    <radialGradient id="contact" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="soften" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#backdrop)"/>
  <rect y="${GROUND_Y}" width="${WIDTH}" height="${HEIGHT - GROUND_Y}" fill="url(#floor)"/>
  <ellipse cx="800" cy="380" rx="720" ry="330" fill="url(#glow)"/>

  <!-- Floor reflection: the same geometry mirrored about the ground line. -->
  <g opacity="0.14" filter="url(#soften)" transform="matrix(1 0 0 -1 0 ${GROUND_Y * 2})">
    <g transform="${transform}">${car}</g>
  </g>

  <ellipse cx="800" cy="${GROUND_Y + 6}" rx="${(300 * scale) / 2}" ry="24" fill="url(#contact)"/>

  <g transform="${transform}">${car}</g>
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const vehicle of fleet) {
  const svg = render(vehicle);
  writeFileSync(join(OUT_DIR, `${vehicle.id}.svg`), svg);
  console.log(`  public/images/fleet/${vehicle.id}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}

console.log(`\n${fleet.length} placeholders written to public/images/fleet/`);
