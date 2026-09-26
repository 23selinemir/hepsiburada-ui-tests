import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test-fixtures';
import { SearchPage } from '../pages/SearchPage';
import { ProductPage } from '../pages/ProductPage';
import { LoginPage } from '../pages/LoginPage';

const { Given, When, Then } = createBdd(test);


Given('kullanıcı Hepsiburada ana sayfasını açar', async ({ page }) => {
  await page.goto('https://www.hepsiburada.com/');

  const pageTitle = await page.title();

  console.log('Ana sayfa URL:', page.url());
  console.log('Sayfa başlığı:', pageTitle);

  if (pageTitle.includes('Güvenlik')) {
    throw new Error(
      'Hepsiburada güvenlik sayfası görüntülendi. Test ana sayfaya erişemedi.'
    );
  }
});

Given('kullanıcı hesabına giriş yapar', async ({ page }) => {
  const username = process.env.HB_USERNAME;
  const password = process.env.HB_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'HB_USERNAME veya HB_PASSWORD .env dosyasında tanımlı değil.'
    );
  }

  const loginPage = new LoginPage(page);

  await loginPage.login(username, password);
});

When('kullanıcı {string} için arama yapar', async ({ page }, searchText: string) => {
  const searchPage = new SearchPage(page);

  await searchPage.search(searchText);
  //Arama işlemi
});

When(
  'kullanıcı fiyat aralığını {int} ile {int} TL olarak filtreler',
  async ({ page }, minPrice: number, maxPrice: number) => {
    const searchPage = new SearchPage(page);

    await searchPage.filterByPrice(minPrice, maxPrice);
  }
  //Fiyat filtreleme işlemi
);

When(
  'kullanıcı sonuçların alt sırasından rastgele bir ürün seçer',
  async ({ page, testState }) => {
    const searchPage = new SearchPage(page);

    await searchPage.selectRandomProductFromLastRow();

    testState.productPage = searchPage.productPage!;
  }
);
//en alt sıradan rastgele ürün seçme işlemi

When(
  'kullanıcı ürün detay sayfasını açar',
  async ({ testState }) => {
    if (!testState.productPage) {
      throw new Error('Ürün detay sayfası bulunamadı.');
    }

    await testState.productPage.waitForLoadState(
      'domcontentloaded'
    );

    console.log(
      'BDD ürün detay sayfası URL:',
      testState.productPage.url()
    );
  }
);
//ürün detay sayfasının açılması

When(
  'kullanıcı uygun satıcıyı belirler',
  async ({ testState }) => {
    if (!testState.productPage) {
      throw new Error('Ürün detay sayfası bulunamadı.');
    }

    testState.productDetailPage = new ProductPage(
      testState.productPage
    );

    await testState.productDetailPage.showAllSellers();
  }
);
//uygun satıcıyı belirleme işlemi

When(
  'kullanıcı ürünü sepete ekler',
  async ({ testState }) => {
    if (!testState.productDetailPage) {
      throw new Error('Ürün detay bilgisi bulunamadı.');
    }

    await testState.productDetailPage.addToCart();
  }
);

Then(
  'ürünün sepete eklendiği doğrulanır',
  async ({ testState }) => {
    if (!testState.productPage) {
      throw new Error('Ürün detay sayfası bulunamadı.');
    }

    await testState.productPage
      .getByText('Ürün sepetinizde')
      .waitFor({ state: 'visible' });

    console.log(
      'Ürünün sepete eklendiği doğrulandı.'
    );
  }
);
//ürünün sepete eklendiğinin doğrulanması

Then(
  'ürünün doğru satıcıdan eklendiği doğrulanır',
  async ({ testState }) => {
    if (!testState.productPage) {
      throw new Error('Ürün detay sayfası bulunamadı.');
    }

    if (!testState.productDetailPage) {
      throw new Error('Ürün detay bilgisi bulunamadı.');
    }

    const selectedMerchantName =
      testState.productDetailPage.selectedMerchantName;

    const merchantNameInCart = testState.productPage
      .getByText(selectedMerchantName, { exact: true })
      .last();

    await merchantNameInCart.waitFor({
      state: 'visible',
    });

    console.log(
      'Ürünün doğru satıcıdan eklendiği doğrulandı:',
      selectedMerchantName
    );
  }
);
//ürünün doğru satıcıdan eklendiğinin doğrulanması