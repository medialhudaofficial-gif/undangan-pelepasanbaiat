// Initialization of AOS Animation
AOS.init({
    duration: 1000,
    once: true
});

// 1. Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});

// 2. Extract Guest Name from URL (?to=NamaTamu)
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to');
const guestElement = document.getElementById('guest-name');
if (guestName) {
    guestElement.innerText = decodeURIComponent(guestName);
} else {
    guestElement.innerText = "Tamu Undangan";
}

// 3. Audio & Hero Open Button Functionality
const btnOpen = document.getElementById('btn-open');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');
const musicCtrl = document.getElementById('music-control');

btnOpen.addEventListener('click', () => {
    // Reveal content
    mainContent.classList.remove('content-hidden');
    musicCtrl.classList.remove('hidden');
    
    // Play sound track safely
    bgMusic.play().then(() => {
        musicCtrl.innerHTML = '<i class="fas fa-volume-up"></i>';
    }).catch(error => {
        console.log("Autoplay dicegah oleh browser, audio aktif setelah interaksi.");
    });
    
    // Smooth scroll straight into the content
    mainContent.scrollIntoView({ behavior: 'smooth' });
    
    // Refresh AOS elements so they register properly after reveal
    setTimeout(() => {
        AOS.refresh();
    }, 100);
});

// Toggle Music Track Control
musicCtrl.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicCtrl.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        bgMusic.pause();
        musicCtrl.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// 4. Target Countdown Timer logic (Target: June 21, 2026 08:00 WIB)
const targetDate = new Date("June 21, 2026 08:00:00").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector('.countdown-wrapper').innerHTML = "<h4>Acara Telah Berlangsung</h4>";
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}, 1000);

// 5. Responsive Lightbox Gallery
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(element) {
    const imgSrc = element.querySelector('img').src;
    lightboxImg.src = imgSrc;
    lightbox.style.display = 'flex';
}

function closeLightbox() {
    lightbox.style.display = 'none';
}

// 6. Wishes/Ucapan Form Engine (Persisting to Local Storage)
const formUcapan = document.getElementById('form-ucapan');
const containerUcapan = document.getElementById('container-ucapan');

// Render Function
function renderUcapan() {
    containerUcapan.innerHTML = '';
    let dataUcapan = JSON.parse(localStorage.getItem('al_huda_invitation_wishes')) || [];
    
    // Default Messages fallback if LocalStorage is clear
    if (dataUcapan.length === 0) {
        dataUcapan = [
            { nama: "Ustadz Mansur", pesan: "Selamat dan berkah atas pelepasan dan pembai'atan santriwan/wati. Semoga menjadi generasi penerus bangsa dan agama.", waktu: "Baru saja" }
        ];
    }
    
    dataUcapan.forEach(item => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `
            <h5>${escapeHtml(item.nama)}</h5>
            <p>${escapeHtml(item.pesan)}</p>
            <small>${item.waktu}</small>
        `;
        containerUcapan.appendChild(div);
    });
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

formUcapan.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('input-nama').value.trim();
    const pesan = document.getElementById('input-pesan').value.trim();
    
    if(nama && pesan) {
        let dataUcapan = JSON.parse(localStorage.getItem('al_huda_invitation_wishes')) || [];
        dataUcapan.unshift({
            nama: nama,
            pesan: pesan,
            waktu: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute:'2-digit' })
        });
        
        localStorage.setItem('al_huda_invitation_wishes', JSON.stringify(dataUcapan));
        renderUcapan();
        formUcapan.reset();
    }
});

// Trigger initial render
renderUcapan();

// 7. Utility Toolbar Actions (Copy & WhatsApp Share)
document.getElementById('btn-copy-link').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link undangan berhasil disalin!");
    }).catch(err => {
        console.error("Gagal menyalin link: ", err);
    });
});

document.getElementById('btn-share-wa').addEventListener('click', () => {
    const text = encodeURIComponent(`Assalamu'alaikum Wr. Wb. Kami mengundang Anda untuk menghadiri acara Pelepasan & Bai'at Nujummutakatifah dan Nujumul 'Uqola YPI Al-Huda Al-Musri' 1 melalui link berikut: ` + window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
});

// 8. Back To Top Mechanics
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500 && !mainContent.classList.contains('content-hidden')) {
        backToTopBtn.classList.remove('hidden');
    } else {
        backToTopBtn.classList.add('hidden');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});