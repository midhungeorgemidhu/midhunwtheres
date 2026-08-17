/**
 * Eternal Bloom - Interactive Photo Gallery & Lightbox Viewer
 */

const GALLERY_DATA = [
  {
    id: 1,
    category: 'engagement',
    src: 'assets/images/hero.jpg',
    title: 'The Eternal Promise',
    caption: 'Surrounded by the glasshouse blooms in the warm golden light.'
  },
  {
    id: 2,
    category: 'engagement',
    src: 'assets/images/proposal.jpg',
    title: 'She Said Yes on the Cliffside',
    caption: 'Overlooking the azure waters of Amalfi as the golden sun dipped into the sea.'
  },
  {
    id: 3,
    category: 'travels',
    src: 'assets/images/travel.jpg',
    title: 'Lost in Venice',
    caption: 'Laughing and wandering through ancient bridges and romantic canals.'
  },
  {
    id: 4,
    category: 'ceremony',
    src: 'assets/images/venue.jpg',
    title: 'The Grand Botanical Glasshouse',
    caption: 'Our magical wedding reception hall glowing under crystal chandeliers.'
  },
  {
    id: 5,
    category: 'engagement',
    src: 'assets/images/rings.jpg',
    title: 'Symbols of Forever',
    caption: 'Handcrafted gold rings and vows written straight from the heart.'
  }
];

class WeddingGallery {
  constructor() {
    this.currentCategory = 'all';
    this.currentIndex = 0;
    this.filteredItems = [...GALLERY_DATA];

    this.initElements();
    this.bindEvents();
    this.renderGallery();
  }

  initElements() {
    this.gridEl = document.getElementById('galleryGrid');
    this.tabs = document.querySelectorAll('.gallery-tab');
    this.modal = document.getElementById('lightboxModal');
    this.lightboxImg = document.getElementById('lightboxImg');
    this.lightboxTitle = document.getElementById('lightboxTitle');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.btnClose = document.getElementById('lightboxClose');
    this.btnPrev = document.getElementById('lightboxPrev');
    this.btnNext = document.getElementById('lightboxNext');
  }

  bindEvents() {
    // Filter Tabs
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.currentCategory = e.target.dataset.filter;
        this.filterCategory(this.currentCategory);
      });
    });

    // Lightbox Controls
    if (this.btnClose) this.btnClose.addEventListener('click', () => this.closeLightbox());
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prevImage());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.nextImage());

    // Close on background click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeLightbox();
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    });
  }

  filterCategory(category) {
    if (category === 'all') {
      this.filteredItems = [...GALLERY_DATA];
    } else {
      this.filteredItems = GALLERY_DATA.filter(item => item.category === category);
    }
    this.renderGallery();
  }

  renderGallery() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    this.filteredItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      card.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="gallery-overlay">
          <span class="gallery-tag">${item.category}</span>
          <h4 class="gallery-caption">${item.title}</h4>
        </div>
      `;

      card.addEventListener('click', () => {
        this.openLightbox(index);
      });

      this.gridEl.appendChild(card);
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    const item = this.filteredItems[this.currentIndex];
    if (!item || !this.modal) return;

    this.lightboxImg.src = item.src;
    this.lightboxTitle.textContent = item.title;
    this.lightboxCaption.textContent = item.caption;

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.filteredItems.length) % this.filteredItems.length;
    this.openLightbox(this.currentIndex);
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.filteredItems.length;
    this.openLightbox(this.currentIndex);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.weddingGallery = new WeddingGallery();
});
