import { test, expect } from '@playwright/test';
import { acceptCookiePolicy } from 'tests/utils';

test('should navigate to the "Servicio Notarial" page ', async ({ page, context }) => {
  await page.goto('/');
  // Accept cookie policy
  await acceptCookiePolicy(page);

  const pagePromise = context.waitForEvent('page');
  await page.click('text=Servicio Notarial');
  const newPage = await pagePromise;

  await expect(newPage).toHaveURL(
    'https://valencia.notariado.org/portal/-/20241031-servicio-notarial-de-ayuda-gratuito-para-los-afectados-por-la-dana-noticia-p%C3%BAblica-',
  );
  await expect(newPage.locator('h2:has-text("DANA")')).toHaveText(
    'Habilitado un servicio notarial gratuito de ayuda para los afectados por la DANA',
  );
});
