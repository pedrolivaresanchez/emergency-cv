import { test, expect } from '@playwright/test';

test('should navigate to the "Ayuda Psicologica" page ', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Ayuda Psicológica');
  await expect(page).toHaveURL('https://ayudana.org/');
  await expect(page.locator('h1:has-text("Ayuda psicológica")')).toHaveText(
    'Ayuda psicológica gratuita a los afectados por la Dana de Valencia',
  );
});
