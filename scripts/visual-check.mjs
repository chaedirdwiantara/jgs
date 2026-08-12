/**
 * Dev-only smoke test: walks the booking wizard end-to-end and captures
 * screenshots at mobile and desktop widths.
 *
 * Usage: node scripts/visual-check.mjs  (with the app running on :3100)
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const OUT = "/tmp/shots";
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "desktop", width: 1440, height: 900, isMobile: false },
];

const errors = [];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    locale: "id-ID",
  });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${vp.name}] console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[${vp.name}] pageerror: ${err.message}`));

  for (const [slug, path] of Object.entries({
    home: "/",
    armada: "/armada",
    tentang: "/tentang",
    kontak: "/kontak",
  })) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `${OUT}/${vp.name}-${slug}.png`, fullPage: true });
  }

  // --- Booking wizard walkthrough -----------------------------------------
  await page.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/${vp.name}-step1-empty.png`, fullPage: true });

  // Submit empty to check validation rendering.
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${vp.name}-step1-errors.png`, fullPage: true });

  // Fill the rental branch.
  await page.fill("#fullName", "Budi Santoso");
  await page.fill("#whatsapp", "081234567890");
  await page.selectOption("#locationId", "soetta");
  const start = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  await page.fill("#startDate", start);
  await page.selectOption("#durationDays", "7");
  await page.fill("#notes", "Butuh child seat.");
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${vp.name}-step2.png`, fullPage: true });

  // Pick a vehicle.
  await page.getByRole("button", { name: /Pilih Hyundai IONIQ 5/i }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${vp.name}-step3.png`, fullPage: true });

  const waHref = await page
    .getByRole("link", { name: /Pesan/i })
    .first()
    .getAttribute("href");
  console.log(`[${vp.name}] wa link ok:`, waHref?.startsWith("https://wa.me/"));
  console.log(`[${vp.name}] decoded:`, decodeURIComponent(waHref?.split("text=")[1] ?? "").slice(0, 400));

  // Antar-jemput branch (desktop only, to keep the run short).
  if (!vp.isMobile) {
    await page.goto(`${BASE}/sewa-mobil?layanan=antar-jemput`, { waitUntil: "networkidle" });
    await page.fill("#fullName", "Siti Rahayu");
    await page.fill("#whatsapp", "+6281199887766");
    await page.selectOption("#locationId", "ngurah-rai");
    await page.fill("#pickupDate", start);
    await page.fill("#pickupTime", "09:30");
    await page.fill("#destination", "Hotel Mulia, Nusa Dua");
    await page.getByRole("button", { name: /Pulang-Pergi/i }).first().click().catch(() => {});
    await page.getByLabel(/Pulang-Pergi/i).first().check().catch(() => {});
    await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${vp.name}-transfer-step2.png`, fullPage: true });
    await page.getByRole("button", { name: /Pilih Denza D9/i }).click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${OUT}/${vp.name}-transfer-step3.png`, fullPage: true });
  }

  // Mobile drawer.
  if (vp.isMobile) {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Buka menu/i }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/${vp.name}-drawer.png` });
  }

  await context.close();
}

await browser.close();

if (errors.length) {
  console.log("\n--- BROWSER ERRORS ---");
  for (const e of errors) console.log(e);
  process.exitCode = 1;
} else {
  console.log("\nNo console/page errors.");
}
