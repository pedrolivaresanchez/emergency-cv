import { test, expect } from '@playwright/test';

test('should navigate to the "Servicio Notarial" page ', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Servicio Notarial');
  await expect(page).toHaveURL(
    'https://valencia.notariado.org/portal/-/20241031-servicio-notarial-de-ayuda-gratuito-para-los-afectados-por-la-dana-noticia-p%C3%BAblica-',
  );
  await expect(page.locator('h2:has-text("DANA")')).toHaveText(
    'Habilitado un servicio notarial gratuito de ayuda para los afectados por la DANA',
  );
});
