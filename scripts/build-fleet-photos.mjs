/**
 * Derives the web-sized fleet photography in `public/images/fleet/` from the
 * masters in `assets/fleet/`.
 *
 * Usage: node scripts/build-fleet-photos.mjs
 *
 * Outputs are committed, so this only needs re-running when a master changes or
 * a unit is added. Each vehicle has two scenes × two shapes:
 *
 *   <id>-outdoor-wide.jpg  → home hero carousel, ≥640px
 *   <id>-outdoor-tall.jpg  → home hero carousel, phones
 *   <id>-studio-wide.jpg   → armada / booking / admin, ≥640px
 *   <id>-studio-tall.jpg   → armada / booking, phones
 *
 * The `tall` masters are not a different crop: they are the same photograph on
 * a portrait canvas with a blurred fill top and bottom. That is why they belong
 * in tall frames — cropping them to a wide frame would just discard the blur
 * and land back at the wide master, and using the wide master in a tall frame
 * would cut into the car.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(root, "assets/fleet");
const OUT_DIR = join(root, "public/images/fleet");

const QUALITY = 70;

/**
 * Output widths, sized to how large each shape is ever painted at 2× DPR:
 * the wide frame peaks at the hero card (~464 CSS px), the tall frame at a
 * phone's full content width (~390 CSS px).
 */
const SHAPES = {
  wide: { width: 900, master: "1326x1054" },
  tall: { width: 800, master: "868x1058" },
};

/** Master filename fragment → the vehicle id used in `src/data/vehicles.ts`. */
const vehicles = [
  { id: "byd-atto-1", match: "byd-atto-1" },
  { id: "byd-m6", match: "byd-m6" },
  { id: "wuling-cloud", match: "wuling-cloud" },
];

mkdirSync(OUT_DIR, { recursive: true });

const masters = readdirSync(SRC_DIR).filter((file) => file.endsWith(".jpg"));
let total = 0;

let count = 0;

for (const vehicle of vehicles) {
  for (const scene of ["outdoor", "studio"]) {
    for (const [shape, { width, master: masterSize }] of Object.entries(SHAPES)) {
      const master = masters.find(
        (file) =>
          file.startsWith(vehicle.match) &&
          file.includes(scene) &&
          file.includes(masterSize),
      );

      if (!master) {
        throw new Error(
          `No ${scene} ${masterSize} master for "${vehicle.id}" in assets/fleet/`,
        );
      }

      const out = join(OUT_DIR, `${vehicle.id}-${scene}-${shape}.jpg`);
      execFileSync(
        "sips",
        [
          "--resampleWidth", String(width),
          "-s", "format", "jpeg",
          "-s", "formatOptions", String(QUALITY),
          "--out", out, join(SRC_DIR, master),
        ],
        { stdio: "ignore" },
      );

      const size = statSync(out).size;
      total += size;
      count += 1;
      console.log(
        `  ${vehicle.id}-${scene}-${shape}.jpg  ←  ${master}  ${(size / 1024).toFixed(0)} KB`,
      );
    }
  }
}

console.log(`\n${count} photos, ${(total / 1024).toFixed(0)} KB total`);
