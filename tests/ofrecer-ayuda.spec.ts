import { test, expect } from '@playwright/test';

test('should navigate to the "Ofrecer ayuda" page and fill in the data', async ({ page }) => {
  await page.goto('/');

  // Find the button with "Necesito ayuda"
  await page.click('text=Quiero Ayudar');

  await expect(page).toHaveURL('/ofrecer-ayuda');

  // Fill in information
  await page.getByLabel('Nombre completo').fill('Testing Testington');
  await page.getByLabel('Número de teléfono').fill('123456789');
  await page.getByLabel('Correo electrónico').fill('testing@testington.com');
  await page.getByLabel('Ubicación exacta').fill('testing@testington.com');
  await page.getByLabel('Alojamiento temporal').check();
  expect(page.getByLabel('Alojamiento temporal')).toBeChecked();
  await page.locator('#townName').selectOption('1');

  await page
    .getByLabel(
      'Acepto seguir el protocolo de actuación y las indicaciones de las autoridades competentes. Entiendo que mi seguridad y la de los demás es prioritaria.',
    )
    .scrollIntoViewIfNeeded();
  expect(
    page.getByLabel(
      'Acepto seguir el protocolo de actuación y las indicaciones de las autoridades competentes. Entiendo que mi seguridad y la de los demás es prioritaria.',
    ),
  ).toBeChecked();
});
