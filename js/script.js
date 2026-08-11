const stops = window.ROUTE_STOPS || [];
const modal = document.querySelector('#infoModal');
const content = document.querySelector('#dialogContent');
const closeBtn = document.querySelector('.closeBtn');
const hotspots = Array.from(document.querySelectorAll('.map-hotspot'));

let currentStop = null;
let currentImageIndex = 0;

const popupDetails = {
  fsm: {
    importance: 'Boğaz geçişi üzerinden İstanbul’un iki yakasını ve modern ulaşım hafızasını temsil eder.',
    presentation: 'Köprünün sadece ulaşım aracı değil, iki kıta arasında kurulan bağın simgesi olduğunu vurgulayabilirsin.',
    photoNote: 'Fotoğraf önerisi: köprü, Boğaz manzarası veya rota geçişini gösteren kareler.'
  },
  belgrad: {
    importance: 'Megakentin içinde korunmuş geniş yeşil dokuyu gösterir.',
    presentation: 'İstanbul’un yalnızca kalabalık ve yapılaşmadan ibaret olmadığını; güçlü bir doğal hafızaya sahip olduğunu anlatabilirsin.',
    photoNote: 'Fotoğraf önerisi: orman yolu, ağaç dokusu, yürüyüş yolu veya su kemeri.'
  },
  arboretum: {
    importance: 'Bitki çeşitliliği ve koruma fikriyle doğayı yaşayan bir arşiv gibi sunar.',
    presentation: 'Doğanın sadece gezilecek alan değil, korunması ve öğrenilmesi gereken bir kültür parçası olduğunu vurgulayabilirsin.',
    photoNote: 'Fotoğraf önerisi: gölet, ağaç koleksiyonları, giriş tabelası veya yürüyüş alanı.'
  },
  rumeli: {
    importance: 'Boğaz’ın tarihî savunma hattını ve İstanbul’un fetih hafızasını temsil eder.',
    presentation: 'Doğal manzaranın tarihî yapılarla nasıl birleştiğini anlatabilirsin.',
    photoNote: 'Fotoğraf önerisi: hisar duvarları, kuleler veya Boğaz manzaralı hisar kareleri.'
  },
  bebek: {
    importance: 'Boğaz’ın gündelik hayatla birleştiği kıyı kültürünü gösterir.',
    presentation: 'İstanbul’da suyun sadece manzara değil; yürüyüş, buluşma ve sosyalleşme alanı olduğunu anlatabilirsin.',
    photoNote: 'Fotoğraf önerisi: sahil yürüyüşü, tekneler, deniz kıyısı veya sosyal yaşam kareleri.'
  },
  anadolu: {
    importance: 'Boğaz’ın daha sakin ve tarihî Anadolu yakası hafızasını tamamlar.',
    presentation: 'Rumeli Hisarı ile karşılıklı konumu üzerinden iki yakanın tarihsel bağını anlatabilirsin.',
    photoNote: 'Fotoğraf önerisi: Anadolu Hisarı, sahil dokusu veya Boğaz’ın sakin kıyı görüntüleri.'
  },
  cekmekoy: {
    importance: 'Rota anlatısının başladığı ve kapandığı gündelik yaşam noktasıdır.',
    presentation: 'Şehir içinden başlayıp doğa, tarih ve Boğaz hattını dolaşarak tekrar başlangıca dönen döngüsel rota fikrini açıklayabilirsin.',
    photoNote: 'Fotoğraf önerisi: başlangıç/kapanış duygusunu veren sokak, yol, ekip ya da rota başlangıcı kareleri.'
  }
};

function getStop(id){
  return stops.find(stop => stop.id === id);
}
function stopIndex(id){
  return stops.findIndex(stop => stop.id === id);
}
function setActive(id){
  hotspots.forEach(h => h.classList.toggle('active', h.dataset.stop === id));
}
function openModal(){
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden', 'false');
}
function closeModal(){
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden', 'true');
  setActive(null);
}
function tagHTML(tags){
  return (tags || []).map(tag => `<span class="meta">${tag}</span>`).join('');
}
function normalizeMedia(stop){
  if(Array.isArray(stop.media) && stop.media.length){
    return stop.media.map(item => {
      if(typeof item === 'string'){
        return { type: guessType(item), src: item, caption: '' };
      }
      return { type: item.type || guessType(item.src || ''), src: item.src, caption: item.caption || '' };
    }).filter(item => item.src);
  }

  const photos = stop.photos && stop.photos.length ? stop.photos : ['assets/images/rota-haritasi.png'];
  return photos.map(src => ({ type: guessType(src), src, caption: '' }));
}
function guessType(src){
  return /\.(mp4|webm|ogg)$/i.test(src) ? 'video' : 'image';
}
function renderMainMedia(item, stop){
  if(!item || !item.src){
    return `
      <div class="photoEmpty">
        <div class="photoEmptyBox">Bu durak için fotoğraf/video alanı hazır. Dosya eklediğinde burada tam haliyle görünecek.</div>
      </div>
    `;
  }
  if(item.type === 'video'){
    return `<video src="${item.src}" controls playsinline preload="metadata"></video>`;
  }
  return `<img src="${item.src}" alt="${stop.title} görseli">`;
}
function renderThumb(item, stop, index, active){
  const cls = `${active ? 'active' : ''} ${item.type === 'video' ? 'videoThumb' : ''}`.trim();
  const thumbMedia = item.type === 'video'
    ? `<video src="${item.src}" muted preload="metadata"></video>`
    : `<img src="${item.src}" alt="${stop.title} küçük görsel ${index + 1}">`;
  return `
    <button type="button" class="${cls}" data-thumb="${index}" aria-label="${index + 1}. medya">
      ${thumbMedia}
    </button>
  `;
}
function renderStop(stop, imageIndex = 0){
  if(!stop || !content) return;
  currentStop = stop;
  const media = normalizeMedia(stop);
  currentImageIndex = Math.max(0, Math.min(imageIndex, media.length - 1));
  const detail = popupDetails[stop.id] || {};
  const currentItem = media[currentImageIndex];
  const currentCaption = currentItem.caption || detail.photoNote || 'Bu alana durakla ilgili fotoğraf veya video açıklaması eklenebilir.';

  const thumbs = media.map((item, index) => renderThumb(item, stop, index, index === currentImageIndex)).join('');

  content.innerHTML = `
    <article class="travelCard">
      <div class="travelHero">
        ${renderMainMedia(currentItem, stop)}
        <div class="heroOverlay">
          <div class="chipRow">
            <span class="chip">${currentImageIndex + 1}/${media.length} medya</span>
            <span class="chip">${stop.category}</span>
          </div>
          <div class="galleryNav">
            <button class="arrowBtn" type="button" data-gallery="prev" aria-label="Önceki medya" ${media.length < 2 ? 'disabled' : ''}>‹</button>
            <button class="arrowBtn" type="button" data-gallery="next" aria-label="Sonraki medya" ${media.length < 2 ? 'disabled' : ''}>›</button>
          </div>
        </div>
      </div>

      <div class="travelInfo">
        <div class="travelTop">
          <div>
            <span class="kicker">Gezi Kartı</span>
            <h1 id="modalTitle">${stop.title}</h1>
            <p class="subtitle">${stop.subtitle}</p>
          </div>
          <div class="badge">${stop.category}</div>
        </div>

        <div class="routeOrder">${stop.routeOrder}</div>
        <div class="smallMeta">${tagHTML(stop.tags)}</div>

        <div class="contentGrid">
          <div class="contentBox full">
            <h3>Kısa Bilgi</h3>
            <p>${stop.text}</p>
          </div>
          <div class="contentBox">
            <h3>Neden Önemli?</h3>
            <p>${detail.importance || 'Bu durak rota anlatısının önemli parçalarından biridir.'}</p>
          </div>
          <div class="contentBox">
            <h3>Sunumda Nasıl Anlatılır?</h3>
            <p>${detail.presentation || 'Bu durak üzerinden İstanbul’un mavi, yeşil ve tarihî hafızasıyla bağlantı kurulabilir.'}</p>
          </div>
        </div>

        <div class="noteBlock">
          <strong>Sunum Cümlesi</strong>
          <div>${stop.note}</div>
        </div>

        <div class="photoCaption">${currentCaption}</div>

        <div>
          <div class="thumbHeader">
            <span class="kicker">Fotoğraf / Video Albümü</span>
            <span class="thumbHint">Medya ekledikçe burada çoğalır</span>
          </div>
          <div class="thumbStrip">${thumbs}</div>
        </div>

        <div class="routeButtons">
          <button class="routeBtn" type="button" data-route="prev">← Önceki Durak</button>
          <button class="routeBtn primary" type="button" data-route="next">Sonraki Durak →</button>
        </div>
      </div>
    </article>
  `;

  content.querySelectorAll('[data-gallery]').forEach(btn => {
    btn.addEventListener('click', () => {
      if(media.length < 2) return;
      const nextIndex = btn.dataset.gallery === 'next'
        ? (currentImageIndex + 1) % media.length
        : (currentImageIndex - 1 + media.length) % media.length;
      renderStop(stop, nextIndex);
    });
  });

  content.querySelectorAll('[data-thumb]').forEach(btn => {
    btn.addEventListener('click', () => renderStop(stop, Number(btn.dataset.thumb)));
  });

  content.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = stopIndex(stop.id);
      const nextIndex = btn.dataset.route === 'next'
        ? (index + 1) % stops.length
        : (index - 1 + stops.length) % stops.length;
      openStop(stops[nextIndex].id);
    });
  });
}
function openStop(id){
  const stop = getStop(id);
  if(!stop) return;
  setActive(id);
  renderStop(stop, 0);
  openModal();
}
hotspots.forEach(h => {
  h.addEventListener('click', () => openStop(h.dataset.stop));
});
closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', event => {
  if(event.target?.dataset?.close === 'true') closeModal();
});
document.addEventListener('keydown', event => {
  if(!modal?.classList.contains('open')) return;
  if(event.key === 'Escape') closeModal();
  if(!currentStop) return;
  const media = normalizeMedia(currentStop);
  if(event.key === 'ArrowRight') renderStop(currentStop, (currentImageIndex + 1) % media.length);
  if(event.key === 'ArrowLeft') renderStop(currentStop, (currentImageIndex - 1 + media.length) % media.length);
});


/* Profesyonel yerel müzik playerı */
const localTracks = window.LOCAL_MUSIC_TRACKS || [];
const routeAudio = document.querySelector('#routeAudio');
const playerMiniButton = document.querySelector('#playerMiniButton');
const playerPanel = document.querySelector('#playerPanel');
const playerClose = document.querySelector('#playerClose');
const miniCover = document.querySelector('#miniCover');
const miniTrackName = document.querySelector('#miniTrackName');
const miniDisc = document.querySelector('.miniDisc');
const playerCover = document.querySelector('#playerCover');
const trackTitle = document.querySelector('#trackTitle');
const trackArtist = document.querySelector('#trackArtist');
const progressRange = document.querySelector('#progressRange');
const currentTimeLabel = document.querySelector('#currentTime');
const durationTimeLabel = document.querySelector('#durationTime');
const prevTrackButton = document.querySelector('#prevTrack');
const nextTrackButton = document.querySelector('#nextTrack');
const playPauseButton = document.querySelector('#playPause');
const volumeRange = document.querySelector('#volumeRange');
const loopToggle = document.querySelector('#loopToggle');
const trackList = document.querySelector('#trackList');

let activeTrackIndex = 0;
let playlistLoop = true;
let firstInteractionStarted = false;

function formatTime(seconds){
  if(!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}
function getTrack(index){
  return localTracks[index] || localTracks[0];
}
function updateTrackList(){
  if(!trackList) return;
  trackList.innerHTML = localTracks.map((track, index) => `
    <button class="trackItem ${index === activeTrackIndex ? 'active' : ''}" type="button" data-track="${index}">
      <img src="${track.cover}" alt="">
      <span>
        <strong>${track.title}</strong>
        <span>${track.artist}</span>
      </span>
      <em>${index === activeTrackIndex ? 'Çalıyor' : 'Seç'}</em>
    </button>
  `).join('');
  trackList.querySelectorAll('[data-track]').forEach((button) => {
    button.addEventListener('click', () => setTrack(Number(button.dataset.track), true));
  });
}
function setTrack(index, shouldPlay = false){
  const track = getTrack(index);
  if(!track || !routeAudio) return;
  activeTrackIndex = index;
  routeAudio.src = track.src;
  routeAudio.volume = Number(volumeRange?.value ?? 0.45);
  if(playerCover) playerCover.src = track.cover;
  if(miniCover) miniCover.src = track.cover;
  if(trackTitle) trackTitle.textContent = track.title;
  if(trackArtist) trackArtist.textContent = track.artist;
  if(miniTrackName) miniTrackName.textContent = track.title;
  if(progressRange) progressRange.value = 0;
  if(currentTimeLabel) currentTimeLabel.textContent = '0:00';
  if(durationTimeLabel) durationTimeLabel.textContent = '0:00';
  updateTrackList();
  if(shouldPlay) playRouteMusic();
}
async function playRouteMusic(){
  if(!routeAudio) return;
  try{
    await routeAudio.play();
    if(playPauseButton) playPauseButton.textContent = 'Ⅱ';
    miniDisc?.classList.add('is-playing');
  }catch(error){
    if(playPauseButton) playPauseButton.textContent = '▶';
    miniDisc?.classList.remove('is-playing');
  }
}
function pauseRouteMusic(){
  if(!routeAudio) return;
  routeAudio.pause();
  if(playPauseButton) playPauseButton.textContent = '▶';
  miniDisc?.classList.remove('is-playing');
}
function toggleRouteMusic(){
  if(!routeAudio) return;
  if(routeAudio.paused) playRouteMusic();
  else pauseRouteMusic();
}
function nextTrack(shouldPlay = true){
  if(!localTracks.length) return;
  setTrack((activeTrackIndex + 1) % localTracks.length, shouldPlay);
}
function prevTrack(shouldPlay = true){
  if(!localTracks.length) return;
  setTrack((activeTrackIndex - 1 + localTracks.length) % localTracks.length, shouldPlay);
}
function openPlayer(){
  playerPanel?.classList.add('open');
  playerPanel?.setAttribute('aria-hidden', 'false');
}
function closePlayer(){
  playerPanel?.classList.remove('open');
  playerPanel?.setAttribute('aria-hidden', 'true');
}
function togglePlayer(){
  if(playerPanel?.classList.contains('open')) closePlayer();
  else openPlayer();
}
function tryStartOnFirstInteraction(){
  if(firstInteractionStarted) return;
  firstInteractionStarted = true;
  if(routeAudio && routeAudio.paused) playRouteMusic();
}

playerMiniButton?.addEventListener('click', () => {
  togglePlayer();
  tryStartOnFirstInteraction();
});
playerClose?.addEventListener('click', closePlayer);
playPauseButton?.addEventListener('click', toggleRouteMusic);
nextTrackButton?.addEventListener('click', () => nextTrack(true));
prevTrackButton?.addEventListener('click', () => prevTrack(true));
volumeRange?.addEventListener('input', () => {
  if(routeAudio) routeAudio.volume = Number(volumeRange.value);
});
loopToggle?.addEventListener('click', () => {
  playlistLoop = !playlistLoop;
  loopToggle.classList.toggle('active', playlistLoop);
  loopToggle.textContent = playlistLoop ? 'Loop açık' : 'Loop kapalı';
});
progressRange?.addEventListener('input', () => {
  if(!routeAudio || !Number.isFinite(routeAudio.duration)) return;
  routeAudio.currentTime = (Number(progressRange.value) / 100) * routeAudio.duration;
});
routeAudio?.addEventListener('timeupdate', () => {
  if(!routeAudio || !Number.isFinite(routeAudio.duration)) return;
  if(progressRange) progressRange.value = (routeAudio.currentTime / routeAudio.duration) * 100;
  if(currentTimeLabel) currentTimeLabel.textContent = formatTime(routeAudio.currentTime);
  if(durationTimeLabel) durationTimeLabel.textContent = formatTime(routeAudio.duration);
});
routeAudio?.addEventListener('loadedmetadata', () => {
  if(durationTimeLabel) durationTimeLabel.textContent = formatTime(routeAudio.duration);
});
routeAudio?.addEventListener('pause', () => miniDisc?.classList.remove('is-playing'));
routeAudio?.addEventListener('play', () => miniDisc?.classList.add('is-playing'));
routeAudio?.addEventListener('ended', () => {
  if(playlistLoop || activeTrackIndex < localTracks.length - 1){
    nextTrack(true);
  }else{
    pauseRouteMusic();
  }
});
document.addEventListener('pointerdown', tryStartOnFirstInteraction, { once:true });
if(localTracks.length){
  setTrack(0, false);
}
