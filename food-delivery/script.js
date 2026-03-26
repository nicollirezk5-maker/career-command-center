// ============================================
// FOOD TO EAT — Menu Data & Interactivity
// ============================================

const foodItems = [
    {
        id: 1,
        name: "Mega Bacon Burger",
        price: 34.90,
        description: "Dois blends de carne suculenta, muito bacon crocante, queijo derretido e molho especial da casa.",
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Combo Batata Suprema",
        price: 24.90,
        description: "Batatas fritas super crocantes com cheddar cremoso e pedacinhos de bacon por cima.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Milkshake de Nutella",
        price: 19.90,
        description: "Gelado, cremoso e feito com a legítima Nutella. O acompanhamento perfeito para seu combo.",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=400&fit=crop"
    },
    {
        id: 4,
        name: "Chicken Crunchy Wrap",
        price: 28.90,
        description: "Wrap crocante com frango empanado, salada fresca, tomate e maionese temperada.",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Onion Rings Especial",
        price: 18.90,
        description: "Anéis de cebola empanados e fritos na hora, acompanhados de molho barbecue.",
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Double Cheeseburger",
        price: 39.90,
        description: "Dois hambúrgueres artesanais, queijo prato duplo, picles, cebola caramelizada e ketchup.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop"
    }
];

let cart = []; // Array of { id, qty }

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartCount();
    initScrollEffects();
    initAnimations();
    initCartDrawer();
});

// ── Render Menu ──
function renderMenu() {
    const grid = document.getElementById('foodGrid');
    if (!grid) return;

    grid.innerHTML = foodItems.map((item, i) => `
        <div class="food-card" data-animate style="transition-delay: ${i * 0.08}s">
            <div class="food-img-container">
                <img src="${item.image}" alt="${item.name}" class="food-img"
                     onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'">
            </div>
            <div class="food-info">
                <div class="food-header">
                    <h3>${item.name}</h3>
                    <span class="food-price">R$ ${item.price.toFixed(2)}</span>
                </div>
                <p class="food-desc">${item.description}</p>
                <button class="btn-add" onclick="addToCart(${item.id})">
                    <i data-lucide="plus"></i>
                    Adicionar
                </button>
            </div>
        </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
}

// ── Cart Logic ──
function addToCart(id) {
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, qty: 1 });
    }
    updateCartCount();
    renderCartDrawer();
    showToast(`${foodItems.find(i => i.id === id).name} adicionado! 🍔`);
}

function removeFromCart(id) {
    const idx = cart.findIndex(c => c.id === id);
    if (idx === -1) return;

    if (cart[idx].qty > 1) {
        cart[idx].qty--;
    } else {
        cart.splice(idx, 1);
    }
    updateCartCount();
    renderCartDrawer();
}

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;

    const total = cart.reduce((sum, c) => sum + c.qty, 0);
    badge.textContent = total;
    badge.style.transform = 'scale(1.3)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
}

function getCartTotal() {
    return cart.reduce((sum, c) => {
        const item = foodItems.find(i => i.id === c.id);
        return sum + (item ? item.price * c.qty : 0);
    }, 0);
}

// ── Cart Drawer ──
function initCartDrawer() {
    const toggle = document.getElementById('cartToggle');
    const close = document.getElementById('cartClose');
    const overlay = document.getElementById('cartOverlay');
    const checkout = document.getElementById('btnCheckout');

    if (toggle) toggle.addEventListener('click', openCart);
    if (close) close.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);
    if (checkout) checkout.addEventListener('click', handleCheckout);

    renderCartDrawer();
}

function openCart() {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
}

function renderCartDrawer() {
    const body = document.getElementById('cartBody');
    const totalEl = document.getElementById('cartTotal');
    if (!body) return;

    if (cart.length === 0) {
        body.innerHTML = `
            <div class="cart-empty">
                <i data-lucide="shopping-bag"></i>
                <p>Seu carrinho está vazio.<br>Adicione algo do cardápio!</p>
            </div>
        `;
    } else {
        body.innerHTML = cart.map(c => {
            const item = foodItems.find(i => i.id === c.id);
            if (!item) return '';
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">R$ ${(item.price * c.qty).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="removeFromCart(${item.id})">−</button>
                        <span class="qty-value">${c.qty}</span>
                        <button class="qty-btn" onclick="addToCart(${item.id})">+</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    if (totalEl) {
        totalEl.textContent = `R$ ${getCartTotal().toFixed(2)}`;
    }

    if (window.lucide) lucide.createIcons();
}

function handleCheckout() {
    if (cart.length === 0) {
        showToast('Adicione itens antes de finalizar! 🛒');
        return;
    }
    const total = getCartTotal().toFixed(2);
    showToast(`Pedido de R$ ${total} enviado! 🎉`);
    cart = [];
    updateCartCount();
    renderCartDrawer();
    setTimeout(closeCart, 1500);
}

// ── Toast ──
function showToast(text) {
    const prev = document.querySelector('.toast');
    if (prev) prev.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i data-lucide="check-circle"></i>
        <span>${text}</span>
    `;
    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ── Scroll Effects ──
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}

// ── Intersection Observer Animations ──
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    setTimeout(() => {
        document.querySelectorAll('[data-animate]:not(.visible)').forEach(el => observer.observe(el));
    }, 200);
}

