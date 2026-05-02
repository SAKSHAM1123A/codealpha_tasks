// Beginner-friendly gallery program in JavaScript
// This script adds images to the page, enables filtering, and opens a lightbox.

const images = [
    {
        src: 'https://www.shutterstock.com/image-photo/beautiful-shot-trail-through-dark-600nw-2616370421.jpg',
        title: 'Misty Forest',
        category: 'nature',
        desc: 'Soft morning light in a serene forest.'
    },
    {
        src: 'https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/z/u/Zugpsitze_mountain.jpg?crop=0%2C214%2C3008%2C1579&wid=1200&hei=630&scl=2.506666666666667',
        title: 'Mountain Lake',
        category: 'nature',
        desc: 'Clear lake reflections framed by mountains.'
    },
    {
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF1H3qYGU02ZEhT_22aPl4d9kzXsycnUvizA&s',
        title: 'City Lights',
        category: 'city',
        desc: 'Night skyline with illuminated high-rises.'
    },
    {
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsoQrH43NwgzSVtThwBji5WSibQyNS4huXDw&s',
        title: 'Portrait Moment',
        category: 'people',
        desc: 'A candid portrait against a soft backdrop.'
    }
];

const galleryEl = document.getElementById('gallery');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightboxEl = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const closeBtn = document.getElementById('lightboxClose');

let currentImages = images;
let currentIndex = 0;

function createGallery(items) {
    galleryEl.innerHTML = items.map((item, index) => {
        return `
            <article class="gallery-item" data-index="${index}">
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                <div class="item-overlay">
                    <span>${item.category.toUpperCase()}</span>
                </div>
            </article>
        `;
    }).join('');

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            currentIndex = Number(item.dataset.index);
            openLightbox(currentImages[currentIndex]);
        });
    });
}

function openLightbox(imageData) {
    lightboxImage.src = imageData.src;
    lightboxTitle.textContent = imageData.title;
    lightboxDesc.textContent = imageData.desc;
    lightboxEl.classList.add('open');
    lightboxEl.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    lightboxEl.classList.remove('open');
    lightboxEl.setAttribute('aria-hidden', 'true');
}

function showImage(index) {
    if (index < 0) {
        index = currentImages.length - 1;
    }
    if (index >= currentImages.length) {
        index = 0;
    }
    currentIndex = index;
    openLightbox(currentImages[currentIndex]);
}

prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
closeBtn.addEventListener('click', closeLightbox);

lightboxEl.addEventListener('click', event => {
    if (event.target === lightboxEl) {
        closeLightbox();
    }
});

document.addEventListener('keydown', event => {
    if (!lightboxEl.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;
        currentImages = filter === 'all'
            ? images
            : images.filter(image => image.category === filter);
        createGallery(currentImages);
    });
});

createGallery(currentImages);
