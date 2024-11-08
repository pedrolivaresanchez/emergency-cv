import { test, expect } from '@playwright/test';

test('should navigate to the "Encontrar tu Coche" page ', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Encontrar tu Coche');
  await expect(page).toHaveURL('https://tucochedana.es/index.php/');
  await expect(page.locator('p:has-text("Sistema")')).toHaveText(
    'Sistema de registro y consulta de vehículos perdidos.',
  );
});
