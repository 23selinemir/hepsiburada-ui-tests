import { Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { ProductPage } from '../pages/ProductPage';

type TestState = {
  productPage?: Page;
  productDetailPage?: ProductPage;
};

export const test = base.extend<{
  testState: TestState;
}>({
  testState: async ({}, use) => {
    const state: TestState = {};

    await use(state);
  },
});

export { expect } from '@playwright/test';