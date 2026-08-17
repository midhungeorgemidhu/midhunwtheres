/**
 * Eternal Bloom - Interactive Guestbook & Wishes Wall
 */

const SEEDED_WISHES = [
  {
    id: 'w1',
    author: 'Eleanor & Marcus Vance',
    relation: 'Bride’s Godparents',
    message: 'To our dearest Sophia & Alexander, wishing you a lifetime as radiant and blissful as this beautiful day. May your home always be filled with joy, laughter, and endless adventure!',
    likes: 28,
    time: '2 hours ago'
  },
  {
    id: 'w2',
    author: 'David Hayes',
    relation: 'Best Man',
    message: 'Alexander, you found the absolute love of your life. Sophia, welcome to the family! Can’t wait to dance until 3 AM and celebrate you two forever.',
    likes: 42,
    time: '5 hours ago'
  },
  {
    id: 'w3',
    author: 'Clara & Julien Monet',
    relation: 'College Friends',
    message: 'From study sessions in Paris to watching you both tie the knot! So thrilled and honoured to be part of your fairytale chapter. Counting down the seconds!',
    likes: 19,
    time: 'Yesterday'
  }
];

class GuestbookManager {
  constructor() {
    this.storageKey = 'eternal_bloom_wishes';
    this.gridEl = document.getElementById('guestbookGrid');
    this.form = document.getElementById('wishForm');

    this.init();
  }

  init() {
    this.renderWishes();

    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handlePostWish(e));
    }
  }

  getWishes() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return [...SEEDED_WISHES];
  }

  saveWishes(wishes) {
    localStorage.setItem(this.storageKey, JSON.stringify(wishes));
  }

  renderWishes() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';
    const wishes = this.getWishes();

    wishes.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'wish-card animate-fade-up is-visible';
      card.innerHTML = `
        <div>
          <div class="wish-header">
            <div>
              <h4 class="wish-author">${wish.author}</h4>
              <span class="wish-date">${wish.relation || wish.time}</span>
            </div>
            <span style="color: var(--gold-primary); font-size: 1.2rem;">✨</span>
          </div>
          <p class="wish-message">"${wish.message}"</p>
        </div>
        <div class="wish-footer">
          <button class="wish-like-btn" data-id="${wish.id}">
            <span>❤️</span>
            <span class="like-count">${wish.likes}</span>
          </button>
        </div>
      `;

      const likeBtn = card.querySelector('.wish-like-btn');
      likeBtn.addEventListener('click', () => this.toggleLike(wish.id, likeBtn));

      this.gridEl.appendChild(card);
    });
  }

  handlePostWish(e) {
    e.preventDefault();
    const authorInput = document.getElementById('wishAuthor');
    const msgInput = document.getElementById('wishMessage');

    const author = authorInput.value.trim();
    const message = msgInput.value.trim();

    if (!author || !message) {
      alert('Please enter your name and a sweet message for the couple.');
      return;
    }

    const newWish = {
      id: 'wish_' + Date.now(),
      author,
      relation: 'Guest',
      message,
      likes: 1,
      time: 'Just now'
    };

    const wishes = this.getWishes();
    wishes.unshift(newWish);
    this.saveWishes(wishes);
    this.renderWishes();

    this.form.reset();

    // Trigger slight confetti burst
    if (window.rsvpManager && window.rsvpManager.confetti) {
      window.rsvpManager.confetti.burst(60);
    }
  }

  toggleLike(wishId, btnEl) {
    const wishes = this.getWishes();
    const target = wishes.find(w => w.id === wishId);
    if (!target) return;

    target.likes += 1;
    this.saveWishes(wishes);

    const countEl = btnEl.querySelector('.like-count');
    if (countEl) countEl.textContent = target.likes;
    btnEl.classList.add('liked');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.guestbookManager = new GuestbookManager();
});
