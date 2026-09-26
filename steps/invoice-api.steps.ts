import { createBdd } from 'playwright-bdd';
import { test, expect } from '../fixtures/test-fixtures';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const { Given, When, Then } = createBdd(test);

Given(
  'API kullanıcısı geçerli bilgilerle token alır',
  async ({ request, apiState }) => {
    const response = await request.post('http://localhost:3000/token', {
      headers: {
        user: 'testuser',
        pass: 'testpass',
      },
    });

    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    expect(responseBody.token).toBeTruthy();

    apiState.token = responseBody.token;
  }
);
When(
  'kullanıcı bir barkod ile faturayı görüntüler',
  async ({ request, apiState }) => {
    const response = await request.get(
      `http://localhost:3000/viewInvoice?barcode=${apiState.barcode}`
    );

    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    apiState.viewInvoiceResponse = responseBody;
  }
);
Then(
  'viewInvoice cevabı başarılı olmalı ve dosyaya yazılmalı',
  async ({ apiState }) => {
    const responseBody = apiState.viewInvoiceResponse as {
      InvoiceLink: string;
      Result: {
        success: boolean;
      };
    };

    expect(responseBody).toBeDefined();
    expect(responseBody.InvoiceLink).toBe('http://abc.com/invoice.pdf');
    expect(responseBody.Result.success).toBe(true);

    const responseDir = path.join(process.cwd(), 'api-responses');

    await mkdir(responseDir, { recursive: true });

    await writeFile(
      path.join(responseDir, 'viewInvoice-response.json'),
      JSON.stringify(responseBody, null, 2),
      'utf-8'
    );
  }
);
When(
  'kullanıcı aynı barkod ile faturayı gönderir',
  async ({ request, apiState }) => {
    expect(apiState.token).toBeDefined();

    const response = await request.post(
      'http://localhost:3000/sendInvoice',
      {
        headers: {
          token: apiState.token!,
        },
        data: {
          Barcode: apiState.barcode,
        },
      }
    );

    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    apiState.sendInvoiceResponse = responseBody;
  }
);
Then(
  'sendInvoice cevabı başarılı olmalı ve dosyaya yazılmalı',
  async ({ apiState }) => {
    const responseBody = apiState.sendInvoiceResponse as {
      Barcode: string;
      Result: {
        success: boolean;
      };
    };

    expect(responseBody).toBeDefined();
    expect(responseBody.Barcode).toBe(apiState.barcode);
    expect(responseBody.Result.success).toBe(true);

    const responseDir = path.join(process.cwd(), 'api-responses');

    await mkdir(responseDir, { recursive: true });

    await writeFile(
      path.join(responseDir, 'sendInvoice-response.json'),
      JSON.stringify(responseBody, null, 2),
      'utf-8'
    );
  }
);