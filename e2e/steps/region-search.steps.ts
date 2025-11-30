import { expect, Locator } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('I am on the search page', async ({ page }) => {
  await page.goto('/search');
});

When('I type {string} in the search field', async ({ page }, text: string) => {
  const input: Locator = page.getByTestId('region-input');
  await input.fill(text);
  await page.waitForTimeout(400);
});

When('I select {string} from the suggestions', async ({ page }, regionName: string) => {
  const suggestions: Locator = page.getByTestId('suggestions');
  await suggestions.waitFor({ state: 'visible' });
  await suggestions.getByText(regionName).click();
});

Then('I should see the departments list', async ({ page }) => {
  const departmentsList: Locator = page.getByTestId('departments-list');
  await departmentsList.waitFor({ state: 'visible' });
  await expect(departmentsList).toBeVisible();
});

Then('I should see {string} in the departments list', async ({ page }, departmentName: string) => {
  const departmentsList: Locator = page.getByTestId('departments-list');
  await expect(departmentsList).toContainText(departmentName);
});

When('I click on department {string}', async ({ page }, departmentCode: string) => {
  const departmentsList: Locator = page.getByTestId('departments-list');
  await departmentsList.getByText(departmentCode).click();
});

Then('I should be on the municipalities page for department {string}', async ({ page }, code: string) => {
  await expect(page).toHaveURL(`/departments/${code}/municipalities`);
});

Then('I should see municipalities', async ({ page }) => {
  await page.waitForTimeout(500);
  const viewport: Locator = page.locator('cdk-virtual-scroll-viewport');
  await expect(viewport).toBeVisible();
});

Given('I am on the municipalities page for department {string}', async ({ page }, code: string) => {
  await page.goto(`/departments/${code}/municipalities`);
  await page.waitForTimeout(500);
});

When('I type {string} in the municipality filter', async ({ page }, text: string) => {
  const input = page.getByTestId('municipality-filter');
  await input.fill(text);
});

Then('I should see {string} in the municipalities list', async ({ page }, name: string) => {
  const viewport = page.locator('cdk-virtual-scroll-viewport');
  await expect(viewport).toContainText(name);
});

Then('I should not see {string} in the municipalities list', async ({ page }, name: string) => {
  const viewport = page.locator('cdk-virtual-scroll-viewport');
  await expect(viewport).not.toContainText(name);
});