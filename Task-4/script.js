const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const volumeControl = document.getElementById('volume');
const autoplayToggle = document.getElementById('autoplay');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const playlistEl = document.getElementById('playlist');

const tracks = [
  {
    title: 'Rising Waves',
    artist: 'SoundHelix',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Mellow Mood',
    artist: 'SoundHelix',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Summer Beats',
    artist: 'SoundHelix',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

let currentTrackIndex = 0;
let isPlaying = false;

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  updatePlaylistUI();
  audio.load();
}

function updatePlaylistUI() {
  playlistEl.innerHTML = tracks
    .map((track, index) => `
      <li class="${index === currentTrackIndex ? 'track-active' : ''}" data-index="${index}">
        <div>
          <div class="track-item-title">${track.title}</div>
          <div class="track-item-artist">${track.artist}</div>
        </div>
        <span>${index + 1}</span>
      </li>
    `)
    .join('');
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function playAudio() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = '⏸';
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = '▶️';
}

function togglePlay() {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

function setProgress(value) {
  const duration = audio.duration || 0;
  audio.currentTime = (value / 100) * duration;
}

function updateProgress() {
  const duration = audio.duration || 0;
  const currentTime = audio.currentTime;
  const percent = duration ? (currentTime / duration) * 100 : 0;
  progress.value = percent;
  currentTimeEl.textContent = formatTime(currentTime);
  totalTimeEl.textContent = formatTime(duration);
}

function playNext() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  playAudio();
}

function playPrevious() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  playAudio();
}

function selectTrack(event) {
  const trackItem = event.target.closest('li');
  if (!trackItem) return;
  currentTrackIndex = parseInt(trackItem.dataset.index, 10);
  loadTrack(currentTrackIndex);
  playAudio();
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);
progress.addEventListener('input', (event) => setProgress(event.target.value));
volumeControl.addEventListener('input', (event) => {
  audio.volume = event.target.value;
});
playlistEl.addEventListener('click', selectTrack);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);
audio.addEventListener('ended', () => {
  if (autoplayToggle.checked) {
    playNext();
  } else {
    pauseAudio();
    audio.currentTime = 0;
    updateProgress();
  }
});

loadTrack(currentTrackIndex);
audio.volume = parseFloat(volumeControl.value);
