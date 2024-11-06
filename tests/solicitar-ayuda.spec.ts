import { test, expect } from '@playwright/test';

test('should navigate to the "Solicitar ayuda" page and fill in a request', async ({ page }) => {
  await page.goto('/');

  // Find the button with "Necesito ayuda"
  await page.click('text=Necesito ayuda');

  await expect(page).toHaveURL('/solicitar-ayuda');

  // Fill in information
  await page.getByLabel('Nombre completo').fill('Testing Testington');
  expect(page.getByLabel('Nombre completo')).toBe('Kendrick');
});
