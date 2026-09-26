# Hepsiburada UI Test Automation

Hepsiburada üzerinde ürün arama, fiyat filtreleme, ürün seçimi, satıcı seçimi ve sepete ekleme akışını test eden UI test otomasyon projesidir.

## Kullanılan Teknolojiler

- Playwright
- TypeScript
- playwright-bdd
- Cucumber / Gherkin
- Page Object Model (POM)
- dotenv

## Test Senaryosu

```gherkin
Feature: Hepsiburada ürün sepete ekleme

  Scenario: Cep telefonunun uygun satıcıdan sepete eklenmesi
    Given kullanıcı Hepsiburada ana sayfasını açar
    And kullanıcı hesabına giriş yapar
    When kullanıcı "cep telefonu" için arama yapar
    And kullanıcı fiyat aralığını 15000 ile 20000 TL olarak filtreler
    And kullanıcı sonuçların alt sırasından rastgele bir ürün seçer
    And kullanıcı ürün detay sayfasını açar
    And kullanıcı uygun satıcıyı belirler
    And kullanıcı ürünü sepete ekler
    Then ürünün sepete eklendiği doğrulanır
    And ürünün doğru satıcıdan eklendiği doğrulanır
```

## Satıcı Seçim Kuralı

Ürün detay sayfasında:

- Birden fazla satıcı varsa puanı en düşük olan satıcı seçilir.
- Tek satıcı varsa mevcut satıcı seçilir.
- Alternatif satıcı seçildiğinde ilgili satıcının ürün sayfasına geçildiği doğrulanır.
- Ürün sepete eklendikten sonra doğru satıcıdan eklendiği kontrol edilir.

## Proje Yapısı

```text
features/
    hepsiburada.feature

steps/
    hepsiburada.steps.ts

pages/
    LoginPage.ts
    SearchPage.ts
    ProductPage.ts

fixtures/
    test-fixtures.ts

playwright.config.ts
package.json
tsconfig.json
.env
.gitignore
README.md
```

### features

BDD senaryolarını içerir.

### steps

Gherkin adımlarının Playwright implementasyonlarını içerir.

### pages

Page Object Model yapısındaki sayfa sınıflarını içerir.

### fixtures

Her test senaryosuna özel state yönetimini içerir. Sayfalar ve ProductPage nesnesi global değişkenler yerine test-scoped fixture üzerinden yönetilir.

## Environment Variables

Login bilgileri `.env` dosyasında tutulur.

```env
HB_USERNAME=your_username
HB_PASSWORD=your_password
```

Gerçek kullanıcı bilgileri repository'ye eklenmemelidir.

`.env` dosyası `.gitignore` içerisinde bulunmaktadır.

## Testleri Çalıştırma

Tüm konfigüre edilmiş browser'larda:

```bash
npm test
```

Sadece Chromium:

```bash
npm run test:chromium
```

Sadece Firefox:

```bash
npm run test:firefox
```

Sadece WebKit:

```bash
npm run test:webkit
```

## BDD Test Generation

Feature dosyalarından Playwright testlerini oluşturmak için:

```bash
npx bddgen
```

## TypeScript Kontrolü

TypeScript hatalarını testleri çalıştırmadan kontrol etmek için:

```bash
npx tsc --noEmit
```

## Test Raporu

Playwright HTML raporunu görüntülemek için:

```bash
npm run report
```

## Browser Parametrizasyonu

Testler Playwright projects yapısı kullanılarak aşağıdaki browser'larda çalıştırılabilir:

- Chromium
- Firefox
- WebKit

Browser seçimi test koduna hardcode edilmemiştir.

## Güvenlik / Login Notu

Test login adımını gerçek kullanıcı akışına uygun şekilde gerçekleştirir.

Hepsiburada production ortamında otomasyon oturumlarına yönelik güvenlik kontrolleri nedeniyle Playwright oturumlarında güvenlik sayfası veya login sırasında `N1E2` hatası görülebilmektedir.

Test bu durumu bypass etmeye çalışmaz. Güvenlik sayfası veya login hatası oluştuğunda test açık bir hata mesajıyla sonlandırılır.

Production güvenlik mekanizmalarından bağımsız, kesintisiz E2E çalıştırma için uygulama sahibi tarafından sağlanan yetkili test ortamı, test hesabı veya desteklenen authentication mekanizması kullanılmalıdır.

## Generated Dosyalar

Aşağıdaki dosya ve klasörler Git repository'ye dahil edilmez:

```gitignore
.env
playwright-report/
test-results/
.features-gen/
```

## Final Kontroller

BDD generation:

```bash
npx bddgen
```

TypeScript kontrolü:

```bash
npx tsc --noEmit
```

Test çalıştırma:

```bash
npm run test:chromium
```

Rapor görüntüleme:

```bash
npm run report
```