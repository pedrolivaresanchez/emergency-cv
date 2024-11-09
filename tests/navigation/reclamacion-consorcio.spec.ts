import { test, expect } from '@playwright/test';
import { acceptCookiePolicy } from 'tests/utils';

test('should navigate to the "Reclamar a Consorcio" page ', async ({ page, context }) => {
  await page.goto('/');
  // Accept cookie policy
  await acceptCookiePolicy(page);

  const pagePromise = context.waitForEvent('page');
  await page.click('text=Reclamar a Consorcio');
  const newPage = await pagePromise;

  await expect(newPage).toHaveURL(
    'https://www.consorseguros.es/ambitos-de-actividad/seguros-de-riesgos-extraordinarios/solicitud-de-indemnizacion',
  );
});
