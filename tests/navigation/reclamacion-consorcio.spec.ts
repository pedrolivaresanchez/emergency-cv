import { test, expect } from '@playwright/test';

test('should navigate to the "Reclamar a Consorcio" page ', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Reclamar a Consorcio');
  await expect(page).toHaveURL(
    'https://www.consorseguros.es/ambitos-de-actividad/seguros-de-riesgos-extraordinarios/solicitud-de-indemnizacion',
  );
  await expect(page.locator('h2:has-text("Abono")')).toHaveText('Abono de la indemnización');
});
