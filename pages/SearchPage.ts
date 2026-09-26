import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  productPage?: Page;
  readonly searchArea: Locator;
  readonly searchInput: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;
  readonly filterButton: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
this.searchArea = page.locator('div[class*="initialComponent-"]').first();
   this.searchInput = page.getByRole('searchbox', { name: 'Site içinde ara' });
    this.minPriceInput = page.getByRole('textbox', { name: 'En az' });
    this.maxPriceInput = page.getByRole('textbox', { name: 'En çok' });
    this.filterButton = page.getByRole('button', { name: 'Filtrele' });
    this.productCards = page.locator('article[class*="productCard-module_article"]');
  }

async search(searchText: string) {
  await this.searchArea.click();
  await this.searchInput.waitFor({ state: 'visible' });
  await this.page.waitForTimeout(1000);

  await this.searchInput.pressSequentially(searchText, { delay: 100 });

  const inputValue = await this.searchInput.inputValue();
  console.log('Arama kutusundaki değer:', inputValue);

  await Promise.all([
    this.page.waitForURL(/ara\?q=/),
    this.searchInput.press('Enter'),
  ]);
}
  async filterByPrice(minPrice: number, maxPrice: number) {
    const firstProductBeforeFilter = await this.productCards.first().locator('a').first().getAttribute('href');
  console.log('Filtre öncesi ilk ürün linki:', firstProductBeforeFilter);
await this.minPriceInput.fill(minPrice.toString());
await this.maxPriceInput.fill(maxPrice.toString());
  console.log('Minimum fiyat input değeri:', await this.minPriceInput.inputValue());
console.log('Maksimum fiyat input değeri:', await this.maxPriceInput.inputValue());

  await Promise.all([
    this.page.waitForURL(
      url => url.toString().includes(`filtreler=fiyat:${minPrice}-${maxPrice}`)
    ),
    this.filterButton.click(),
  ]);
  await this.page.reload({ waitUntil: 'domcontentloaded' });
const firstProductText = await this.productCards.first().innerText();
console.log('Filtre sonrası ilk ürün kartı:', firstProductText);

}
 async getProductCount() {
    const count = await this.productCards.count();
    console.log('Bulunan ürün kartı sayısı:', count);
  }
  async selectRandomProductFromLastRow() {
    
 const count = await this.productCards.count();
 console.log('Filtre sonrası bulunan ürün kartı sayısı:', count);

  const cardPositions: { index: number; top: number }[] = [];

  for (let i = 0; i < count; i++) {
    const top = await this.productCards.nth(i).evaluate(
      element => Math.round(element.getBoundingClientRect().top)
    );

    cardPositions.push({
      index: i,
      top: top,
    });
  }

  console.log('Ürün kartlarının konumları:', cardPositions);
  const maxTop = Math.max(...cardPositions.map(card => card.top));

const lastRowCards = cardPositions.filter(card => card.top === maxTop);

console.log('En alt sıradaki ürünler:', lastRowCards);
const randomIndex = Math.floor(Math.random() * lastRowCards.length);
const selectedCard = lastRowCards[randomIndex];

console.log('Rastgele seçilen ürün:', selectedCard);

const selectedProductCard = this.productCards.nth(selectedCard.index);
const productLink = selectedProductCard.locator('a').first();

console.log('Seçilen ürün linki:', await productLink.getAttribute('href'));
console.log('Link target:', await productLink.getAttribute('target'));
const [productPage] = await Promise.all([
  this.page.waitForEvent('popup'),
  productLink.click(),
]);

this.productPage = productPage;

await this.productPage.waitForLoadState('domcontentloaded');

console.log('Ürün detay sayfası URL:', this.productPage.url());
}
}