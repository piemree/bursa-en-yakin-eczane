# Nöbetçi Eczane — En Yakın Nöbetçi Eczaneler

Türkiye'de nöbetçi eczaneleri **harita üzerinde** ve **konumuna göre en yakından** başlayarak bulmanı sağlayan bir web uygulaması. Şu an **Bursa** aktif olup, mimari yeni şehirler eklenecek şekilde tasarlanmıştır.

## Özellikler

- **En yakın nöbetçi eczane** — Tarayıcı konum izni ile sana en yakın açık eczaneleri mesafeye göre sıralar.
- **Harita görünümü** — Leaflet tabanlı interaktif harita, çok sayıda eczane için kümeleme (clustering) desteği.
- **İlçe / mahalle araması** — İlçe ve mahalleye göre filtreleme ve arama.
- **SEO uyumlu sayfalar** — Her ilçe ve mahalle için ayrı, sunucu tarafında üretilen sayfalar; `sitemap`, `robots` ve JSON-LD yapısal verisi.
- **Güncel veri** — Nöbetçi eczane listesi [Bursa Eczacı Odası](https://www.beo.org.tr/nobetci-eczaneler)'ndan periyodik olarak çekilir (ISR / önbellekleme ile).
- **Çoklu şehir mimarisi** — Şehirler `lib/cities` altında merkezi bir kayıt (registry) ile yönetilir; yeni şehir eklemek kolaydır.

## Teknolojiler

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Leaflet](https://leafletjs.com/) · `react-leaflet` · `react-leaflet-cluster`
- [Cheerio](https://cheerio.js.org/) (HTML parse / scraping)
- TypeScript

## Başlangıç

Gereksinim: Node.js 20+

```bash
# Bağımlılıkları yükle
pnpm install

# Geliştirme sunucusunu başlat
pnpm run dev
```

Ardından [http://localhost:3000](http://localhost:3000) adresini aç.

### Komutlar


| Komut                | Açıklama                                                                        |
| -------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`        | Geliştirme sunucusunu başlatır                                                  |
| `npm run build`      | Üretim derlemesi oluşturur                                                      |
| `npm run start`      | Üretim sunucusunu başlatır                                                      |
| `npm run lint`       | ESLint ile kod denetimi yapar                                                   |
| `npm run build:data` | `site.html` / `mahalle.html` dosyalarından ilçe ve mahalle JSON verisini üretir |


### Ortam değişkenleri


| Değişken               | Açıklama                                              | Varsayılan                                 |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Sitenin tam URL'i (metadata, sitemap, canonical için) | `https://bursa-en-yakin-eczane.vercel.app` |


## Proje Yapısı

```
app/
  page.tsx                         # Şehir seçim sayfası
  [city]/page.tsx                  # Şehir nöbetçi eczane listesi
  [city]/en-yakin-nobetci-eczane/  # Konuma göre en yakın eczaneler
  [city]/[slug]/page.tsx           # İlçe / mahalle bazlı SEO sayfaları
  api/eczaneler/                   # Nöbetçi eczane verisi
  api/cities/                      # Aktif şehirler
  api/revalidate/                  # Önbellek yenileme
components/                        # Harita, kart, arama vb. UI bileşenleri
lib/
  cities/                          # Şehir kayıt sistemi (registry) ve şehir konfigürasyonları
  scrape.ts                        # Veri çekme yardımcıları
  geo.ts                           # Mesafe / konum hesaplamaları
data/                              # Üretilmiş ilçe / mahalle JSON verisi
scripts/build-data.mjs            # Veri üretim betiği
```

## Yeni Şehir Ekleme

1. `lib/cities/<sehir>/` altında `meta.ts`, `scrape.ts` ve `config.ts` oluştur.
2. Şehri `lib/cities/registry.ts` içindeki `CITIES` kaydına ekle.
3. İlgili veri kaynağı için bir scraper yazıp `data/<sehir>/` altında ilçe/mahalle verisini üret.

## Destek Ol ☕

Bu proje açık ve ücretsiz olarak geliştiriliyor. Faydalı bulduysan geliştirmenin devamı için destek olabilirsin:

👉 **[kreosus.com/piemree](https://kreosus.com/piemree)** üzerinden kahve ısmarlayabilirsin.

Her türlü destek; sunucu maliyetleri, yeni şehirlerin eklenmesi ve uygulamanın geliştirilmesi için çok değerli. Teşekkürler!

## Sorumluluk Reddi

Nöbetçi eczane bilgileri ilgili eczacı odalarının resmi kaynaklarından alınır. Veriler güncel tutulmaya çalışılsa da, çıkmadan önce eczaneyi telefonla teyit etmeniz önerilir.