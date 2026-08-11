# İstanbul Rota - GitHub Safe v14

Bu sürüm GitHub Pages için düzeltildi.

## Ne düzeltildi?
- CSS ve JavaScript `index.html` içine gömüldü.
- Böylece GitHub'da `css/styles.css` veya `js/script.js` yolu yanlış yüklenirse player bozulmaz.
- Harita hotspotları ve tıklama koordinatları değiştirilmedi.
- Yerel müzik playerı, kapak görselleri ve MP4 dosyaları paketin içindedir.

## GitHub'a yüklerken
Repository kök dizininde şunlar görünmeli:

- index.html
- assets/
- css/
- js/
- README.md

En kritik dosya `index.html`, en kritik klasör ise `assets/`.

## Yayına alma
Settings > Pages > Deploy from branch > main / root seç.

## Sorun devam ederse
Tarayıcıda Ctrl + F5 yap. GitHub Pages bazen eski dosyayı cache'te tutar.
