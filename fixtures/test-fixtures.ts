import { Page } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { ProductPage } from '../pages/ProductPage';

type TestState = {
  productPage?: Page;
  productDetailPage?: ProductPage;
};

type ApiState = {
  token?: string;
  barcode: string;
  viewInvoiceResponse?: unknown;
  sendInvoiceResponse?: unknown;
};

export const test = base.extend<{
  testState: TestState;
  apiState: ApiState;
}>({
  testState: async ({}, use) => {
    const state: TestState = {};

    await use(state);
  },

  apiState: async ({}, use) => {
    const state: ApiState = {
      barcode: '123456789',
    };

    await use(state);
  },
});

export { expect } from '@playwright/test';