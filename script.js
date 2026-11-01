// Initialize Supabase Client
const SUPABASE_URL = 'https://chhwujiajdhaihupvuix.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bHflg5jJHZfPzoOdsC5f_Q_H3YO4v3c';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let playlist = [];
let currentIndex = 0;
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');

// Fetch tracks and related artist info from Supabase on load
async function loadMusicCatalog() {
    const { data, error } = await _supabase
        .from('tracks')
        .select(`
            *,
            artists (
                name,
                aweber_tag
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching catalog:', error);
        return;
    }

    playlist = data;
    if (playlist.length > 0) {
        loadTrack(0);
    }
}

function loadTrack(index) {
    currentIndex = index;
    const track = playlist[index];
    
    audio.src = track.audio_file_path;
    document.getElementById('current-title').innerText = track.title;
    document.getElementById('current-artist').innerText = track.artists.name;
    document.getElementById('current-artwork').src = track.artwork_url || 'https://via.placeholder.com/250';
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerText = '⏸';
    } else {
        audio.pause();
        playPauseBtn.innerText = '▶';
    }
}

function nextTrack() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
    playPauseBtn.innerText = '⏸';
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
    playPauseBtn.innerText = '⏸';
}

// Smart Subscribe Button: Morph into email input inline
function transformSubscribeInput() {
    document.getElementById('subscribe-btn').style.display = 'none';
    document.getElementById('subscribe-input-box').style.display = 'flex';
}

// Handle the dynamic tagging submission
async function submitFanSubscription() {
    const email = document.getElementById('fan-email').value;
    const currentTrack = playlist[currentIndex];
    const artistTag = currentTrack.artists.aweber_tag; // Automatically grabbed from active track relation!

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email.');
        return;
    }

    console.log(`Subscribing ${email} with tag: ${artistTag}`);
    
    alert(`You're locked in with ${currentTrack.artists.name}!`);
    document.getElementById('subscribe-input-box').style.display = 'none';
    document.getElementById('subscribe-btn').style.display = 'block';
    document.getElementById('fan-email').value = '';
}

// Run loader on page start
loadMusicCatalog();
