/**
 * Dev-only behavioural assertions for the booking flow.
 * Usage: node scripts/flow-assert.mjs   (app running on :3100)
 */
import { chromium } from "playwright";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const future = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
const past = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push(`PASS  ${name}`);
  } catch (error) {
    results.push(`FAIL  ${name}\n      ${error.message.split("\n")[0]}`);
    process.exitCode = 1;
  }
}

const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "id-ID" });
const page = await ctx.newPage();

/* -- 1. Round trip doubles the transfer price and reaches WhatsApp --------- */
await check("antar-jemput pulang-pergi doubles the fare", async () => {
  await page.goto(`${BASE}/sewa-mobil?layanan=antar-jemput`, { waitUntil: "networkidle" });
  await page.fill("#fullName", "Siti Rahayu");
  await page.fill("#whatsapp", "+6281199887766");
  await page.selectOption("#locationId", "ngurah-rai");
  await page.fill("#pickupDate", future);
  await page.fill("#pickupTime", "09:30");
  await page.fill("#destination", "Hotel Mulia, Nusa Dua");
  await page.locator('label[for="tripType-pulang-pergi"]').click();
  assert.equal(await page.locator("#tripType-pulang-pergi").isChecked(), true, "radio not checked");

  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.getByRole("button", { name: /^Pilih Denza D9$/i }).click();
  await page.waitForSelector("text=Total estimasi");

  const total = await page.locator("text=Total estimasi").first().locator("..").innerText();
  assert.match(total, /1\.900\.000/, `expected 1.900.000, got: ${total}`);

  const href = await page.getByRole("link", { name: /Pesan via WhatsApp/i }).getAttribute("href");
  const text = decodeURIComponent(href.split("text=")[1]);
  assert.ok(href.startsWith("https://wa.me/62"), "wa.me link malformed");
  assert.match(text, /Pulang-Pergi/);
  assert.match(text, /Denza D9/);
  assert.match(text, /Hotel Mulia, Nusa Dua/);
});

/* -- 2. Validation rejects bad phone numbers and past dates ---------------- */
await check("rejects invalid phone and past date", async () => {
  await page.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  await page.fill("#fullName", "Andi");
  await page.fill("#whatsapp", "12345");
  await page.selectOption("#locationId", "halim");
  await page.fill("#startDate", past);
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.waitForTimeout(400);

  await page.waitForSelector("text=/nomor whatsapp indonesia yang valid/i");
  await page.waitForSelector("text=/tidak boleh di masa lalu/i");
  assert.ok(await page.locator("#fullName").isVisible(), "should still be on step 1");
});

/* -- 3. Company name becomes required for corporate customers -------------- */
await check("company name required for perusahaan", async () => {
  await page.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  await page.locator('label[for="customerType-perusahaan"]').click();
  await page.fill("#fullName", "Andi Wijaya");
  await page.fill("#whatsapp", "081234567890");
  await page.selectOption("#locationId", "halim");
  await page.fill("#startDate", future);
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.waitForSelector("text=/nama perusahaan wajib diisi/i");
});

/* -- 4. Changing location clears an unavailable vehicle -------------------- */
await check("location without a unit shows the empty state", async () => {
  await page.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  await page.fill("#fullName", "Rina");
  await page.fill("#whatsapp", "081234567890");
  await page.selectOption("#locationId", "juanda"); // no 7-seater here
  await page.fill("#startDate", future);
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.getByRole("button", { name: /^7 kursi$/ }).click();
  await page.waitForSelector("text=/tidak ada unit yang cocok/i");
});

/* -- 5. Mobile: sticky CTA present, floating FAB suppressed ---------------- */
await check("mobile sticky CTA without FAB collision", async () => {
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: "id-ID",
  });
  const m = await mobile.newPage();
  await m.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  assert.equal(
    await m.getByLabel("Hubungi kami via WhatsApp").count(),
    0,
    "FAB should be hidden on the booking page",
  );

  await m.goto(`${BASE}/`, { waitUntil: "networkidle" });
  assert.equal(
    await m.getByLabel("Hubungi kami via WhatsApp").count(),
    1,
    "FAB should be visible elsewhere",
  );
  await mobile.close();
});

/* -- 6. Regression: the mobile action bar stays pinned to the viewport ----- */
await check("mobile action bar is pinned to the viewport bottom", async () => {
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: "id-ID",
  });
  const m = await mobile.newPage();
  await m.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  await m.fill("#fullName", "Budi Santoso");
  await m.fill("#whatsapp", "081234567890");
  await m.selectOption("#locationId", "soetta");
  await m.fill("#startDate", future);
  await m.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await m.getByRole("button", { name: /^Pilih BYD Seal$/i }).click();
  await m.waitForSelector("text=Total estimasi");
  await m.waitForTimeout(600);
  await m.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await m.waitForTimeout(400);

  const rect = await m.evaluate(() => {
    const bar = document.querySelector(".fixed.inset-x-0.bottom-0");
    const r = bar.getBoundingClientRect();
    return { bottom: r.bottom, width: r.width, viewportH: innerHeight, viewportW: innerWidth };
  });
  assert.equal(Math.round(rect.bottom), rect.viewportH, `bar bottom ${rect.bottom} != ${rect.viewportH}`);
  assert.equal(Math.round(rect.width), rect.viewportW, `bar width ${rect.width} != ${rect.viewportW}`);
  await mobile.close();
});

/* -- 7. Switching service type must not strand the form ------------------- */
await check("switching service type clears the abandoned branch", async () => {
  await page.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  // Overlong value in the rental-only field, then switch away from it.
  await page.fill("#deliveryAddress", "x".repeat(250));
  await page.locator('label[for="serviceType-antar-jemput"]').click();

  await page.fill("#fullName", "Dewi Lestari");
  await page.fill("#whatsapp", "081234567890");
  await page.selectOption("#locationId", "ngurah-rai");
  await page.fill("#pickupDate", future);
  await page.fill("#pickupTime", "09:00");
  await page.fill("#destination", "Hotel Mulia, Nusa Dua");
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();

  // Must reach step 2 rather than silently failing on a hidden field's error.
  await page.waitForSelector("text=/armada tersedia di/i", { timeout: 5000 });
});

/* -- 8. Pickup time carries the location's own time-zone label ------------ */
await check("Bali pickup time is labelled WITA, Jakarta WIB", async () => {
  await page.getByRole("button", { name: /^Pilih BYD Seal$/i }).click();
  await page.waitForSelector("text=Total estimasi");
  const body = await page.locator("dl").first().innerText();
  assert.match(body, /09\.00 WITA/, `expected WITA, got: ${body}`);

  const href = await page.getByRole("link", { name: /Pesan via WhatsApp/i }).getAttribute("href");
  assert.match(decodeURIComponent(href.split("text=")[1]), /09\.00 WITA/);

  await page.goto(`${BASE}/sewa-mobil?layanan=antar-jemput`, { waitUntil: "networkidle" });
  await page.fill("#fullName", "Dewi Lestari");
  await page.fill("#whatsapp", "081234567890");
  await page.selectOption("#locationId", "halim");
  await page.fill("#pickupDate", future);
  await page.fill("#pickupTime", "09:00");
  await page.fill("#destination", "Kota Kasablanka, Jakarta Selatan");
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.waitForSelector("text=/armada tersedia di/i");
  assert.match(await page.locator("body").innerText(), /09\.00 WIB/);
});

/* -- 9. Growing past the lg breakpoint releases the drawer's scroll lock --- */
await check("drawer releases body scroll lock on resize to desktop", async () => {
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: false,
    locale: "id-ID",
  });
  const m = await mobile.newPage();
  await m.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await m.getByRole("button", { name: /Buka menu/i }).click();
  await m.waitForTimeout(300);
  assert.equal(await m.evaluate(() => document.body.style.overflow), "hidden");

  await m.setViewportSize({ width: 1280, height: 900 });
  await m.waitForTimeout(400);
  assert.notEqual(
    await m.evaluate(() => document.body.style.overflow),
    "hidden",
    "body scroll still locked after resize past lg",
  );
  await mobile.close();
});

/* -- 10. Drawer exposes dialog semantics and traps focus ------------------ */
await check("drawer is a modal dialog with contained focus", async () => {
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: false,
    locale: "id-ID",
  });
  const m = await mobile.newPage();
  await m.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await m.getByRole("button", { name: /Buka menu/i }).click();
  await m.waitForTimeout(300);

  const drawer = m.locator('nav[role="dialog"]');
  assert.equal(await drawer.getAttribute("aria-modal"), "true");

  // Tab all the way round; focus must never leave the drawer.
  for (let i = 0; i < 12; i += 1) {
    await m.keyboard.press("Tab");
    const inside = await m.evaluate(() =>
      document.querySelector('nav[role="dialog"]').contains(document.activeElement),
    );
    assert.ok(inside, `focus escaped the drawer on Tab #${i + 1}`);
  }

  await m.keyboard.press("Escape");
  await m.waitForTimeout(250);
  assert.equal(
    await m.evaluate(() => document.activeElement?.getAttribute("aria-controls")),
    "mobile-nav",
    "focus should return to the toggle after Escape",
  );
  await mobile.close();
});

await browser.close();
console.log(results.join("\n"));
