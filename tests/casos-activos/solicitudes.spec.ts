import { test, expect } from '@playwright/test';

test('should navigate to the "Casos activos" page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Casos Activos');

  await page.getByTestId('necesidades-selector').selectOption('limpieza');
  await expect(page).toHaveURL(
    '/casos-activos/solicitudes?currentPage=1&pueblo=todos&tipoAyuda=limpieza&urgencia=todas',
  );
});
