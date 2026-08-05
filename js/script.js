const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const glow = $('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const navToggle = $('.nav-toggle');
const mainNav = $('#main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  $$('#main-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

$$('[data-scroll]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = $(btn.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

const pollResult = $('#poll-result');
const pollMessages = {
  Gri: 'Gri cevabı güzel bir başlangıç: İstanbul’un görünen yüzü çoğu zaman trafik, beton ve kalabalık. Biz bu perdenin altındaki mavi ve yeşili anlatıyoruz.',
  Mavi: 'Mavi cevap, Boğaz’ın İstanbul kimliğindeki gücünü gösterir. Bu sitede mavi hafıza özellikle ön plana çıkarılıyor.',
  Yeşil: 'Yeşil cevap, Belgrad Ormanı ve Atatürk Arboretumu gibi alanların şehir hafızasında ne kadar değerli olduğunu gösterir.',
  Hepsi: 'En güçlü cevap bu: İstanbul tek renk değil. Sunumun ana fikri de İstanbul’un çok katmanlı bir şehir olduğu.'
};
$$('.poll-btn').forEach((button) => {
  button.addEventListener('click', () => {
    $$('.poll-btn').forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    pollResult.textContent = pollMessages[button.dataset.poll];
  });
});

const modal = $('#detail-modal');
const modalContent = $('#modal-content');
const modalClose = $('.modal-close');
const modalData = {
  mavi: {
    title: 'Mavi Hafıza: Boğaz',
    body: 'Boğaz, İstanbul’un yalnızca doğal güzelliği değil; stratejik konumu, ulaşımı, yalıları, köprüleri ve gündelik sahil yaşamıyla şehrin kimliğini kuran mavi omurgadır. Sunumda “dünyanın kolyesi” imgesiyle anlatılması bu yüzden güçlüdür.'
  },
  insan: {
    title: 'İnsan Hafızası: Kentin Gen Havuzu',
    body: 'İstanbul tarih boyunca farklı coğrafyalardan gelen toplulukları bir araya getirmiştir. Bu yüzden şehir sadece mekânların değil, insanların, dillerin, sınıfların ve hikâyelerin de üst üste biriktiği canlı bir arşivdir.'
  },
  yesil: {
    title: 'Yeşil Hafıza: Belgrad Ormanı ve Atatürk Arboretumu',
    body: 'Belgrad Ormanı ve Atatürk Arboretumu, megakentin içinde zamanı yavaşlatan alanlardır. Arboretum sıradan bir park değil; bitkilerin korunduğu, gözlemlendiği ve gelecek kuşaklara aktarıldığı canlı bir ağaç müzesi gibi ele alınabilir.'
  }
};
$$('.read-more').forEach((button) => {
  button.addEventListener('click', () => {
    const item = modalData[button.dataset.modal];
    modalContent.innerHTML = `<p class="eyebrow">Detay</p><h2>${item.title}</h2><p>${item.body}</p>`;
    if (typeof modal.showModal === 'function') modal.showModal();
  });
});
modalClose?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});

const choiceResult = $('#choice-result');
const choiceData = {
  maviSec: {
    title: 'Senin İstanbul’un: Mavi İstanbul',
    text: 'Boğaz, vapur, martı, köprü ve kıyı yaşamı senin için İstanbul’un ana kimliğini taşıyor. Bu bakış, projenin Boğaz merkezli omurgasıyla örtüşüyor.',
    className: 'mavi'
  },
  yesilSec: {
    title: 'Senin İstanbul’un: Yeşil İstanbul',
    text: 'İstanbul’u sadece kalabalık değil; aynı zamanda Belgrad Ormanı ve Atatürk Arboretumu gibi nefes alınan alanlarla düşünüyorsun. Yeşil hafıza senin için daha güçlü.',
    className: 'yesil'
  },
  hepsiSec: {
    title: 'Senin İstanbul’un: Mavi + Yeşil + İnsan',
    text: 'Senin bakışın bu projenin tam merkezine denk geliyor: İstanbul yalnızca tek bir renk değil; mavi, insan ve yeşil hafızanın üst üste geldiği çok katmanlı bir şehir.',
    className: 'karma'
  }
};
function renderChoice(key = 'maviSec') {
  const item = choiceData[key];
  if (!item || !choiceResult) return;
  choiceResult.className = `choice-result ${item.className}`;
  choiceResult.innerHTML = `<span class="pill">Sonuç</span><h3>${item.title}</h3><p>${item.text}</p>`;
  $$('.choice-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.choice === key));
}
$$('.choice-btn').forEach((button) => button.addEventListener('click', () => renderChoice(button.dataset.choice)));
renderChoice();

const places = {
  bogaz: {
    no: '01',
    title: 'İstanbul Boğazı',
    tag: 'Mavi hafızanın başlangıcı',
    img: 'assets/images/bogaz-havadan.webp',
    text: 'İstanbul’u İstanbul yapan ana sahne. İki kıtayı ayırır ama vapurlar, köprüler ve kıyı yaşamıyla aynı zamanda birleştirir.',
    line: 'Geçiş cümlesi: “Boğaz, İstanbul’un dış dünyaya açılan mavi kapısıdır.”'
  },
  anadolu: {
    no: '02',
    title: 'Anadolu Hisarı & Kanlıca',
    tag: 'Sakin ve içe dönük kıyı hafızası',
    img: 'assets/images/anadolu-hisari.webp',
    text: 'Kanlıca yoğurdu, kıyı kahveleri, Anadolu Hisarı ve yavaş akan zamanla Boğaz’ın daha sakin yüzü burada görünür olur.',
    line: 'Geçiş cümlesi: “Anadolu yakası Boğaz’ın daha sakin cildidir.”'
  },
  rumeli: {
    no: '03',
    title: 'Rumeli Hisarı & Sarayburnu Hattı',
    tag: 'Anıtsal güç ve stratejik bakış',
    img: 'assets/images/rumeli-hisari.webp',
    text: 'Hisarlar, surlar ve imparatorluk hafızası burada daha belirginleşir. Boğaz’ın güzelliği, tarihsel güçle birleşir.',
    line: 'Geçiş cümlesi: “Rumeli yakası Boğaz’ın dış dünyaya bakan vitrini gibidir.”'
  },
  belgrad: {
    no: '04',
    title: 'Belgrad Ormanı',
    tag: 'Megakentin nefes alanı',
    img: 'assets/images/belgrad-ormani.webp',
    text: 'Kentin betonlaşmasına karşı yeşil bir eşik. Orman, şehre yalnızca oksijen değil, yavaşlama ve kaçış duygusu da verir.',
    line: 'Geçiş cümlesi: “Boğaz maviyse, Belgrad Ormanı İstanbul’un derin yeşilidir.”'
  },
  arboretum: {
    no: '05',
    title: 'Atatürk Arboretumu',
    tag: 'Zamanın durduğu yeşil arşiv',
    img: 'assets/images/ataturk-arboretumu.webp',
    text: 'Belgrad Ormanı’nın yanında, bitkisel hafızayı görünür kılan canlı bir ağaç müzesi. Sunumun “zamanın durduğu yer” duygusunu en iyi taşıyan alanlardan biri.',
    line: 'Geçiş cümlesi: “Arboretum, İstanbul’un kendi içine çekildiği genetik hafızasıdır.”'
  }
};
const routeInfo = $('#route-info');
function renderPlace(key) {
  const place = places[key];
  if (!place || !routeInfo) return;
  routeInfo.innerHTML = `
    <span class="number">${place.no}</span>
    <h3>${place.title}</h3>
    <p class="tagline">${place.tag}</p>
    <img src="${place.img}" alt="${place.title} görseli">
    <p>${place.text}</p>
    <p><strong>${place.line}</strong></p>
  `;
  $$('.map-pin').forEach((pin) => pin.classList.toggle('active', pin.dataset.place === key));
  $$('.route-step').forEach((step) => step.classList.toggle('active', step.dataset.place === key));
}
$$('.map-pin, .route-step').forEach((item) => {
  item.addEventListener('click', () => renderPlace(item.dataset.place));
});
renderPlace('bogaz');

const questions = [
  {
    q: 'Bu web sayfasında İstanbul’un ana çıkış noktası hangi doğal unsur üzerinden kuruluyor?',
    options: ['Boğaz', 'Kapalıçarşı', 'Taksim Meydanı'],
    answer: 0,
    feedback: 'Doğru. Sayfanın merkezinde Boğaz’ın mavi hafızası var.'
  },
  {
    q: 'Atatürk Arboretumu bu projede nasıl yorumlanıyor?',
    options: ['Alışveriş merkezi', 'Canlı ağaç müzesi ve yeşil hafıza', 'Sadece bir köprü geçişi'],
    answer: 1,
    feedback: 'Doğru. Arboretum, yeşil sığınak ve bitkisel hafıza olarak anlatılıyor.'
  },
  {
    q: 'Projenin ana akışı hangisi?',
    options: ['Boğaz’dan Arboretum’a maviden yeşile yolculuk', 'Sadece tarihî camiler', 'Sadece sokak lezzetleri'],
    answer: 0,
    feedback: 'Doğru. Anlatım Boğaz’ın mavisinden Arboretum’un yeşiline ilerliyor.'
  },
  {
    q: '“İnsan hafızası” bölümünün temel fikri nedir?',
    options: ['İstanbul’un boş bir şehir olduğu', 'Farklı kültürlerin ve göçlerin şehirde birikmesi', 'Yalnızca ağaç türlerinin listelenmesi'],
    answer: 1,
    feedback: 'Doğru. İstanbul, farklı insan hikâyelerinin biriktiği sosyolojik bir kavşak olarak görülüyor.'
  },
  {
    q: 'Belgrad Ormanı ve Atatürk Arboretumu, Boğaz’ın yanında hangi anlamı güçlendiriyor?',
    options: ['Şehrin yeşil sığınağı ve nefes alanı', 'Sadece alışveriş kültürü', 'Endüstriyel üretim merkezi'],
    answer: 0,
    feedback: 'Doğru. Bu alanlar İstanbul’un korunan yeşil hafızası olarak ele alınıyor.'
  }
];
let quizIndex = 0;
let answered = false;
const quizCounter = $('#quiz-counter');
const quizQuestion = $('#quiz-question');
const quizOptions = $('#quiz-options');
const quizFeedback = $('#quiz-feedback');
const quizNext = $('#quiz-next');
function renderQuiz() {
  if (!quizCounter || !quizQuestion || !quizOptions) return;
  const item = questions[quizIndex];
  answered = false;
  quizCounter.textContent = `Soru ${quizIndex + 1}/${questions.length}`;
  quizQuestion.textContent = item.q;
  quizFeedback.textContent = '';
  quizOptions.innerHTML = item.options.map((option, index) => `<button class="quiz-option" type="button" data-index="${index}">${option}</button>`).join('');
  $$('.quiz-option', quizOptions).forEach((button) => {
    button.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const selected = Number(button.dataset.index);
      $$('.quiz-option', quizOptions).forEach((opt, index) => {
        if (index === item.answer) opt.classList.add('correct');
        if (index === selected && selected !== item.answer) opt.classList.add('wrong');
      });
      quizFeedback.textContent = selected === item.answer ? item.feedback : `Yanlış. Doğru cevap: ${item.options[item.answer]}.`;
    });
  });
}
quizNext?.addEventListener('click', () => {
  quizIndex = (quizIndex + 1) % questions.length;
  renderQuiz();
});
renderQuiz();

// Bir ses açıldığında diğerlerini durdurarak karışık ve bozuk duyulmasını engeller.
$$('audio').forEach((audio) => {
  audio.volume = 0.45;
  audio.addEventListener('play', () => {
    $$('audio').forEach((other) => {
      if (other !== audio) other.pause();
    });
    $$('.audio-card').forEach((card) => card.classList.remove('active-audio'));
    audio.closest('.audio-card')?.classList.add('active-audio');
  });
});

// Sunum modu
const presentationModal = $('#presentation-modal');
const presentationContent = $('#presentation-content');
const presentationCounter = $('#presentation-counter');
const presentationDots = $('#presentation-dots');
const presentationPrev = $('#presentation-prev');
const presentationNext = $('#presentation-next');
const presentationClose = $('.presentation-close');
const openPresentation = $('#open-presentation');
const presentationSlides = [
  {
    title: 'Megakent’in İçinde Zamanın Durduğu Yerler',
    subtitle: 'İstanbul’un Mavi ve Yeşil Hafızası',
    text: 'Bu sunum modu, web sayfasını sınıf içinde daha rahat anlatmanız için hazırlandı. Ana akış: Boğaz → İnsan Hafızası → Yeşil Hafıza → Nefes Rotası.',
    image: 'assets/images/bogaz-havadan.webp'
  },
  {
    title: 'Mavi Hafıza',
    subtitle: 'Boğaz: İstanbul’un mavi omurgası',
    text: 'Boğaz yalnızca doğal bir su yolu değil; İstanbul’un kültürel ritmini kuran ana sahnedir. Vapur, köprü, kıyı yaşamı ve sahil hafızası burada toplanır.',
    image: 'assets/images/kopru.webp'
  },
  {
    title: 'İnsan Hafızası',
    subtitle: 'Göçler, semtler, diller ve günlük hayat',
    text: 'İstanbul’un hafızası yalnızca mekânlarda değil, insanlarda birikir. Şehir farklı toplulukları, yaşam ritimlerini ve hikâyeleri bir arada taşır.',
    image: 'assets/images/anadolu-hisari.webp'
  },
  {
    title: 'Yeşil Hafıza',
    subtitle: 'Belgrad Ormanı ve Atatürk Arboretumu',
    text: 'Bu alanlar megakentin içinde zamanı yavaşlatan, nefes aldıran ve doğanın hafızasını koruyan yeşil arşivlerdir.',
    image: 'assets/images/ataturk-arboretumu.webp'
  },
  {
    title: 'Nefes Rotası',
    subtitle: 'Boğaz’dan Arboretum’a yolculuk',
    text: 'Proje bir gezi listesi değil; İstanbul’un mavi hafızasından yeşil hafızasına uzanan düşünsel bir rota sunar.',
    image: 'assets/images/belgrad-ormani.webp'
  },
  {
    title: 'Kapanış',
    subtitle: 'İstanbul’un iki ana rengi',
    text: 'Boğaz’ın mavisi şehri dünyaya açar; Arboretum’un yeşili şehre nefes aldırır. İstanbul’u özel yapan şey bu çok katmanlı birlikteliktir.',
    image: 'assets/images/bogaz-havadan.webp'
  }
];
let presentationIndex = 0;
function renderPresentation(index = 0) {
  const slide = presentationSlides[index];
  if (!slide || !presentationContent || !presentationCounter || !presentationDots) return;
  presentationContent.innerHTML = `
    <div class="presentation-slide">
      <div class="presentation-text">
        <p class="eyebrow">Sunum Modu</p>
        <h2>${slide.title}</h2>
        <h3>${slide.subtitle}</h3>
        <p>${slide.text}</p>
      </div>
      <div class="presentation-image"><img src="${slide.image}" alt="${slide.title}"></div>
    </div>
  `;
  presentationCounter.textContent = `Slayt ${index + 1}/${presentationSlides.length}`;
  presentationDots.innerHTML = presentationSlides.map((_, i) => `<button class="presentation-dot ${i === index ? 'active' : ''}" data-slide="${i}" aria-label="Slayt ${i + 1}"></button>`).join('');
  $$('.presentation-dot', presentationDots).forEach((dot) => {
    dot.addEventListener('click', () => {
      presentationIndex = Number(dot.dataset.slide);
      renderPresentation(presentationIndex);
    });
  });
}
openPresentation?.addEventListener('click', () => {
  presentationIndex = 0;
  renderPresentation(presentationIndex);
  if (typeof presentationModal.showModal === 'function') presentationModal.showModal();
});
presentationPrev?.addEventListener('click', () => {
  presentationIndex = (presentationIndex - 1 + presentationSlides.length) % presentationSlides.length;
  renderPresentation(presentationIndex);
});
presentationNext?.addEventListener('click', () => {
  presentationIndex = (presentationIndex + 1) % presentationSlides.length;
  renderPresentation(presentationIndex);
});
presentationClose?.addEventListener('click', () => presentationModal.close());
presentationModal?.addEventListener('click', (event) => {
  if (event.target === presentationModal) presentationModal.close();
});
document.addEventListener('keydown', (event) => {
  if (!presentationModal?.open) return;
  if (event.key === 'ArrowRight') {
    presentationIndex = (presentationIndex + 1) % presentationSlides.length;
    renderPresentation(presentationIndex);
  }
  if (event.key === 'ArrowLeft') {
    presentationIndex = (presentationIndex - 1 + presentationSlides.length) % presentationSlides.length;
    renderPresentation(presentationIndex);
  }
  if (event.key === 'Escape') {
    presentationModal.close();
  }
});
