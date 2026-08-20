import { chromium } from "playwright";
import crypto from "crypto";

const outDir = "C:/Users/USER/AppData/Local/Temp/claude/e--software-project/03ce9b4f-068f-441b-9ac2-9c4ca6895c8c/scratchpad";

function base32Decode(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const char of base32.replace(/=+$/, "").toUpperCase()) {
    const val = alphabet.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.substring(i, i + 8), 2));
  return Buffer.from(bytes);
}
function totp(base32Secret) {
  const key = base32Decode(base32Secret);
  const counter = Math.floor(Date.now() / 1000 / 30);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) | ((hmac[offset + 1] & 0xff) << 16) | ((hmac[offset + 2] & 0xff) << 8) | (hmac[offset + 3] & 0xff);
  return (code % 1000000).toString().padStart(6, "0");
}

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

await page.goto("http://localhost:5173/login", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.getByPlaceholder(/email/i).fill("admin@ube.local");
await page.getByPlaceholder(/password/i).fill("SecurePassword123!");
await page.getByRole("button", { name: /^login$/i }).click();
await page.waitForTimeout(1800);

if (page.url().includes("2fa-verify")) {
  const code = totp("Y2LAMVGQBHPMTF5XWLXWRW4RTA4WKYLQ");
  await page.locator('input[inputmode="numeric"]').first().fill(code);
  await page.getByRole("button", { name: /verify/i }).click();
  await page.waitForTimeout(2000);
}
console.log("post-login url:", page.url());

const pages = [
  ["admin-dashboard", "/admin/dashboard"],
  ["admin-users", "/admin/users"],
  ["admin-vendors", "/admin/vendors"],
  ["admin-bookings", "/admin/bookings"],
  ["admin-content", "/admin/content"],
  ["admin-disputes", "/admin/disputes"],
  ["admin-fraud", "/admin/fraud-review"],
  ["admin-notifications", "/admin/notifications"],
  ["admin-settings", "/admin/settings"],
];

for (const [name, path] of pages) {
  await page.goto(`http://localhost:5173${path}`, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log("captured", name, page.url());
}

await browser.close();
