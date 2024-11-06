import { test, expect } from '@playwright/test';

test('should navigate to the "Compartir coche" page ', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Compartir Coche');
  await expect(page).toHaveURL('https://anem.guruwalk.com/');
  await expect(page.locator('h2:has-text("Comparte")')).toHaveText(
    'Comparte coche con quien no tiene y alivia el tráfico de la ciudad.',
  );
});
