import { test } from '@playwright/test';
import devices from './devices.js';

test.describe("Base Scrabble Frontend UI", () => {

  test("Desktop + Mobile Render Validation", async ({ page }) => {
    // You must replace with the running preview URL
    await page.goto("http://127.0.0.1:4173");

    await page.screenshot({ path: "tests/playwright/desktop.png", fullPage: true });

    // Mobile screenshots (manual loop)
    for (const [label, device] of Object.entries(devices)) {
      test.use(device);

      await page.goto("http://127.0.0.1:4173");
      await page.screenshot({ path: `tests/playwright/${label}.png`, fullPage: true });
    }
  });

});
