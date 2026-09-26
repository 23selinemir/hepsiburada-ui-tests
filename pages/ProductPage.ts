import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly merchantNames: Locator;
  readonly merchantRatings: Locator;
  readonly mainMerchant: Locator;

  selectedMerchantName: string = '';

  constructor(page: Page) {
    this.page = page;

    this.merchantNames = page.locator(
      '[data-test-id="merchant-name"]'
    );

    this.merchantRatings = page.locator(
      '[data-test-id="merchant-rating"]'
    );

    this.mainMerchant = page
      .locator('a[href*="/magaza/"]')
      .first();
  }

  async showAllSellers() {
    // Ana satıcının adını al
    const mainMerchantName =
      (await this.mainMerchant.textContent())?.trim() ?? '';

    // Ana satıcının puanını al
    const mainMerchantRatingText =
      await this.merchantRatings.first().textContent();

    const mainMerchantRatingValue =
      mainMerchantRatingText?.match(/\d+[,.]\d+/)?.[0];

    const mainMerchantRating =
      mainMerchantRatingValue
        ? Number(mainMerchantRatingValue.replace(',', '.'))
        : null;

    // Başlangıçta ana satıcı seçili kabul edilir
    let selectedMerchantName = mainMerchantName;
    let selectedMerchantRating = mainMerchantRating;

    let selectedMerchantGoToProductButton: Locator | null =
      null;

    // Görünür alternatif satıcıları al
    const visibleMerchantNames =
      this.merchantNames.filter({
        visible: true,
      });

    const alternativeMerchantCount =
      await visibleMerchantNames.count();

    // Alternatif satıcıları dolaş
    for (
      let i = 0;
      i < alternativeMerchantCount;
      i++
    ) {
      const merchant =
        visibleMerchantNames.nth(i);

      const merchantName =
        (await merchant.innerText()).trim();

      const merchantParent =
        merchant.locator('..');

      // Satıcının puanını al
      const ratingText =
        await merchantParent
          .locator('[data-test-id="merchant-rating"]')
          .first()
          .innerText();

      const merchantRatingValue =
        ratingText.match(/\d+[,.]\d+/)?.[0];

      const merchantRating =
        merchantRatingValue
          ? Number(
              merchantRatingValue.replace(',', '.')
            )
          : null;

      // Satıcı adı ile "Ürüne git" butonunun
      // bulunduğu ortak satır
      const merchantRow =
        merchant.locator(
          'xpath=ancestor::div[3]'
        );

      // Daha düşük puanlıysa bu satıcıyı seç
      if (
        merchantRating !== null &&
        (
          selectedMerchantRating === null ||
          merchantRating < selectedMerchantRating
        )
      ) {
        selectedMerchantName =
          merchantName;

        selectedMerchantRating =
          merchantRating;

        selectedMerchantGoToProductButton =
          merchantRow.getByRole('button', {
            name: 'Ürüne git',
            exact: true,
          });
      }
    }

    // Seçilen satıcıyı sonraki BDD adımları için sakla
    this.selectedMerchantName =
      selectedMerchantName;

    console.log(
      'Seçilen satıcı:',
      selectedMerchantName,
      '->',
      selectedMerchantRating
    );

    // Alternatif satıcı seçildiyse
    // o satıcının ürün sayfasına geç
    if (
      selectedMerchantGoToProductButton !== null
    ) {
      await selectedMerchantGoToProductButton.click();

      const currentUrl =
        this.page.url();

      const expectedMerchant =
        selectedMerchantName.toLowerCase();

      const decodedUrl =
        decodeURIComponent(currentUrl).toLowerCase();

      if (
        !decodedUrl.includes(
          `magaza=${expectedMerchant}`
        )
      ) {
        throw new Error(
          `Yanlış satıcı sayfasına geçildi. ` +
          `Beklenen satıcı: ${selectedMerchantName}, ` +
          `URL: ${currentUrl}`
        );
      }

      console.log(
        'Doğru alternatif satıcı sayfasına geçildi:',
        selectedMerchantName
      );
    } else {
      console.log(
        'Ana satıcı seçildi:',
        selectedMerchantName
      );
    }
  }

  async addToCart() {
    const addToCartButton =
      this.page.getByRole('button', {
        name: 'Sepete ekle',
        exact: true,
      });

    await addToCartButton.waitFor({
      state: 'visible',
    });

    console.log(
      'Sepete eklenecek satıcı:',
      this.selectedMerchantName
    );

    await addToCartButton.click();
  }
}