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