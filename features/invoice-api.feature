Feature: Invoice API işlemleri

  Scenario: Fatura görüntüleme ve gönderme işlemlerinin başarılı olması
    Given API kullanıcısı geçerli bilgilerle token alır
    When kullanıcı bir barkod ile faturayı görüntüler
    Then viewInvoice cevabı başarılı olmalı ve dosyaya yazılmalı
    When kullanıcı aynı barkod ile faturayı gönderir
    Then sendInvoice cevabı başarılı olmalı ve dosyaya yazılmalı