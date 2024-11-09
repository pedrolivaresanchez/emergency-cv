import { Page, expect } from '@playwright/test';

export const acceptCookiePolicy = async (page: Page) => {
  // Accept cookie dialog
  await page.click('button:has-text("Aceptar")');
  await expect(page).toHaveURL('/');
};
