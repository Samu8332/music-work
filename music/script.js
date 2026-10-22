
// Demo music collection
// Replace demo audio with music you have permission to stream.
const songs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Demo Artist",
    category: "Bollywood",
    language: "Hindi",
    cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "City Lights",
    artist: "Demo Artist",
    category: "Hollywood",
    language: "English",
    cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Melody of Love",
    artist: "Demo Artist",
    category: "Tollywood",
    language: "Telugu",
    cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Golden Memories",
    artist: "Demo Artist",
    category: "Bollywood",
    language: "Hindi",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "Ocean Waves",
    artist: "Demo Artist",
    category: "Hollywood",
    language: "English",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: 6,
    title: "Rainy Evening",
    artist: "Demo Artist",
    category: "Tollywood",
    language: "Telugu",
    cover: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: 7,
    title: "Summer Vibes",
    artist: "Demo Artist",
    category: "Bollywood",
    language: "Hindi",
    cover: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: 8,
    title: "Starry Night",
    artist: "Demo Artist",
    category: "Hollywood",
    language: "English",
    cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: 9,
    title: "Sweet Melody",
    artist: "Demo Artist",
    category: "Tollywood",
    language: "Telugu",
    cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
  }
];

const authScreen = document.getElementById("authScreen");
const mainApp = document.getElementById("mainApp");
const player = document.getElementById("player");
const audio = document.getElementById("audio");
const songGrid = document.getElementById("songGrid");
const favoriteGrid = document.getElementById("favoriteGrid");

let activeCategory = "All";
let currentSongIndex = -1;
let favorites = JSON.parse(localStorage.getItem("melodyFavorites") || "[]");

// Registration
const savedUser = JSON.parse(localStorage.getItem("melodyUser") || "null");

function showApp(user) {
  authScreen.classList.add("hidden");
  mainApp.classList.remove("hidden");
  document.getElementById("profileName").textContent = user.name;
  renderSongs();
  renderFavorites();
}

if (savedUser) {
  showApp(savedUser);
}

document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Please enter your name and email.");
    return;
  }

  const user = { name, email };
  localStorage.setItem("melodyUser", JSON.stringify(user));
  showApp(user);
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("melodyUser");
  audio.pause();
  mainApp.classList.add("hidden");
  player.classList.add("hidden");
  authScreen.classList.remove("hidden");
});

// Create song cards
function createSongCard(song) {
  const isFavorite = favorites.includes(song.id);

  const card = document.createElement("article");
  card.className = "song-card";

  const coverWrap = document.createElement("div");
  coverWrap.className = "cover-wrap";

  const img = document.createElement("img");
  img.src = song.cover;
  img.alt = `${song.title} album artwork`;
  img.loading = "lazy";

  const play = document.createElement("button");
  play.className = "card-play";
  play.textContent = "▶";
  play.setAttribute("aria-label", `Play ${song.title}`);
  play.addEventListener("click", () => playSong(song.id));

  coverWrap.append(img, play);

  const title = document.createElement("h3");
  title.textContent = song.title;

  const artist = document.createElement("p");
  artist.textContent = `${song.artist} · ${song.language}`;

  const bottom = document.createElement("div");
  bottom.className = "card-bottom";

  const category = document.createElement("p");
  category.textContent = song.category;

  const favorite = document.createElement("button");
  favorite.className = `favorite-btn ${isFavorite ? "active" : ""}`;
  favorite.textContent = isFavorite ? "♥" : "♡";
  favorite.setAttribute("aria-label", "Toggle favorite");
  favorite.addEventListener("click", () => toggleFavorite(song.id));

  bottom.append(category, favorite);
  card.append(coverWrap, title, artist, bottom);
  return card;
}

// Display filtered songs
function renderSongs() {
  const search = document.getElementById("searchInput").value
    .trim().toLowerCase();

  const filtered = songs.filter(song => {
    const matchesCategory =
      activeCategory === "All" || song.category === activeCategory;

    const matchesSearch =
      `${song.title} ${song.artist} ${song.category} ${song.language}`
        .toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  songGrid.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No songs found. Try another search.";
    songGrid.appendChild(empty);
    return;
  }

  filtered.forEach(song => songGrid.appendChild(createSongCard(song)));
}

// Category selection
document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.getElementById("songsTitle").textContent =
      activeCategory === "All" ? "Trending songs" : `${activeCategory} songs`;
    renderSongs();
    document.querySelector(".songs-section").scrollIntoView({
      behavior: "smooth"
    });
  });
});

document.getElementById("searchInput").addEventListener("input", renderSongs);

document.getElementById("showAll").addEventListener("click", () => {
  activeCategory = "All";
  document.getElementById("searchInput").value = "";
  document.getElementById("songsTitle").textContent = "Trending songs";
  renderSongs();
});

// Favorites
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("melodyFavorites", JSON.stringify(favorites));
  renderSongs();
  renderFavorites();
  updatePlayerFavorite();
}

function renderFavorites() {
  favoriteGrid.replaceChildren();

  const favoriteSongs = songs.filter(song => favorites.includes(song.id));

  if (favoriteSongs.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Your favorite songs will appear here.";
    favoriteGrid.appendChild(empty);
    return;
  }

  favoriteSongs.forEach(song => {
    favoriteGrid.appendChild(createSongCard(song));
  });
}

// Music playback
function playSong(id) {
  const index = songs.findIndex(song => song.id === id);
  if (index === -1) return;

  currentSongIndex = index;
  const song = songs[index];

  audio.src = song.audio;
  audio.play().then(() => {
    player.classList.remove("hidden");
    document.getElementById("playBtn").textContent = "Ⅱ";
  }).catch(() => {
    player.classList.remove("hidden");
    document.getElementById("playBtn").textContent = "▶";
    alert("Audio could not play. Check your internet connection or audio source.");
  });

  document.getElementById("playerCover").src = song.cover;
  document.getElementById("playerTitle").textContent = song.title;
  document.getElementById("playerArtist").textContent =
    `${song.artist} · ${song.language}`;

  updatePlayerFavorite();
}

document.getElementById("playBtn").addEventListener("click", () => {
  if (currentSongIndex === -1) {
    playSong(songs[0].id);
    return;
  }

  if (audio.paused) {
    audio.play().then(() => {
      document.getElementById("playBtn").textContent = "Ⅱ";
    }).catch(() => {
      document.getElementById("playBtn").textContent = "▶";
    });
  } else {
    audio.pause();
    document.getElementById("playBtn").textContent = "▶";
  }
});

function nextSong() {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  playSong(songs[nextIndex].id);
}

function previousSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(songs[prevIndex].id);
}

document.getElementById("nextBtn").addEventListener("click", nextSong);
document.getElementById("prevBtn").addEventListener("click", previousSong);
audio.addEventListener("ended", nextSong);

// Progress bar
const progress = document.getElementById("progress");

audio.addEventListener("timeupdate", () => {
  if (!audio.duration || !Number.isFinite(audio.duration)) return;

  progress.value = (audio.currentTime / audio.duration) * 100;
  document.getElementById("currentTime").textContent =
    formatTime(audio.currentTime);
  document.getElementById("duration").textContent =
    formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  if (audio.duration && Number.isFinite(audio.duration)) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${String(sec).padStart(2, "0")}`;
}

// Volume
document.getElementById("volume").addEventListener("input", e => {
  audio.volume = Number(e.target.value);
});
audio.volume = 0.7;

// Player favorite button
function updatePlayerFavorite() {
  const button = document.getElementById("playerFavorite");
  const song = songs[currentSongIndex];

  if (!song) return;

  const isFavorite = favorites.includes(song.id);
  button.textContent = isFavorite ? "♥" : "♡";
  button.style.color = isFavorite ? "#ff5b9d" : "white";
}

document.getElementById("playerFavorite").addEventListener("click", () => {
  if (currentSongIndex !== -1) {
    toggleFavorite(songs[currentSongIndex].id);
  }
});
