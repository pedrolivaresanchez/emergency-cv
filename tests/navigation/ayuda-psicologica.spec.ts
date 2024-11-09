import { test, expect } from '@playwright/test';
import { acceptCookiePolicy } from 'tests/utils';

test('should navigate to the "Ayuda Psicologica" page ', async ({ page, context }) => {
  await page.goto('/');

  await acceptCookiePolicy(page);

  const pagePromise = context.waitForEvent('page');
  await page.click('text=Ayuda Psicológica');
  const newPage = await pagePromise;

  await expect(newPage).toHaveURL('https://ayudana.org/');
  await expect(newPage.locator('h1:has-text("Ayuda psicológica")')).toHaveText(
    'Ayuda psicológica gratuita a los afectados por la Dana de Valencia',
  );
});
