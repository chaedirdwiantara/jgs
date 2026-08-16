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

/* -- 1. The weekly discount applies and the order reaches WhatsApp --------- */
await check("7-day rental applies the weekly discount", async () => {
  await page.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  await page.fill("#fullName", "Siti Rahayu");
  await page.fill("#whatsapp", "+6281199887766");
  await page.fill("#startDate", future);
  await page.selectOption("#durationDays", "7");

  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.getByRole("button", { name: /^Pilih BYD ATTO 1$/i }).click();
  await page.waitForSelector("text=Total estimasi");

  // 450.000 × 7 = 3.150.000, less the 10% weekly tier = 2.835.000.
  const total = await page.locator("text=Total estimasi").first().locator("..").innerText();
  assert.match(total, /2\.835\.000/, `expected 2.835.000, got: ${total}`);

  const href = await page.getByRole("link", { name: /Pesan via WhatsApp/i }).getAttribute("href");
  const text = decodeURIComponent(href.split("text=")[1]);
  assert.ok(href.startsWith("https://wa.me/62"), "wa.me link malformed");
  assert.match(text, /Rental Harian/);
  assert.match(text, /BYD ATTO 1/);
  assert.match(text, /Diskon sewa mingguan/);
});

/* -- 2. Validation rejects bad phone numbers and past dates ---------------- */
await check("rejects invalid phone and past date", async () => {
  await page.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  await page.fill("#fullName", "Andi");
  await page.fill("#whatsapp", "12345");
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
  await page.fill("#startDate", future);
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.waitForSelector("text=/nama perusahaan wajib diisi/i");
});

/* -- 4. Switching back to perorangan must not strand the form -------------- */
await check("company name stops blocking after switching to perorangan", async () => {
  // The field unmounts but react-hook-form keeps its value, so its rule has to
  // stay guarded by the customer type that owns it.
  await page.locator('label[for="customerType-perorangan"]').click();
  await page.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await page.waitForSelector("text=/armada tersedia/i", { timeout: 5000 });
});

/* -- 5. The retired airport flow leaves no inputs behind ------------------- */
await check("no service-type, location, or address inputs remain", async () => {
  await page.goto(`${BASE}/sewa-mobil`, { waitUntil: "networkidle" });
  for (const selector of [
    "#locationId",
    "#deliveryAddress",
    "#destination",
    "#pickupDate",
    "#pickupTime",
    "#serviceType-antar-jemput",
  ]) {
    assert.equal(await page.locator(selector).count(), 0, `${selector} should be gone`);
  }
});

/* -- 6. Mobile: sticky CTA present, floating FAB suppressed ---------------- */
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

/* -- 7. Regression: the mobile action bar stays pinned to the viewport ----- */
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
  await m.fill("#startDate", future);
  await m.getByRole("button", { name: /Lanjut Pilih Armada/i }).click();
  await m.getByRole("button", { name: /^Pilih BYD ATTO 1$/i }).click();
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

/* -- 8. Growing past the lg breakpoint releases the drawer's scroll lock --- */
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

/* -- 9. Drawer exposes dialog semantics and traps focus -------------------- */
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
