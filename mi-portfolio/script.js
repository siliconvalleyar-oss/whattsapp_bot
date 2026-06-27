// ── Data ──
let products = [
    { id: 1, name: 'Auriculares Bluetooth', category: 'electronica', price: 49.99, emoji: '🎧' },
    { id: 2, name: 'Cargador Inalámbrico', category: 'electronica', price: 29.99, emoji: '🔋' },
    { id: 3, name: 'Lámpara LED', category: 'hogar', price: 39.99, emoji: '💡' },
    { id: 4, name: 'Organizador Escritorio', category: 'hogar', price: 24.99, emoji: '📦' },
    { id: 5, name: 'Mochila Urbana', category: 'accesorios', price: 59.99, emoji: '🎒' },
    { id: 6, name: 'Reloj Minimalista', category: 'accesorios', price: 89.99, emoji: '⌚' },
    { id: 7, name: 'Altavoz Portátil', category: 'electronica', price: 44.99, emoji: '🔊' },
    { id: 8, name: 'Planta Artificial', category: 'hogar', price: 19.99, emoji: '🌿' },
];

const services = [
    { id: 1, name: 'Envío Exprés', desc: 'Entrega en 24 horas', emoji: '🚚' },
    { id: 2, name: 'Soporte Técnico', desc: 'Asistencia personalizada 24/7', emoji: '🛠️' },
    { id: 3, name: 'Garantía Extendida', desc: 'Cobertura de hasta 2 años', emoji: '🛡️' },
    { id: 4, name: 'Personalización', desc: 'Productos a tu medida', emoji: '🎨' },
];

let currentFilter = 'todo';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ── DOM refs ──
const productsGrid = document.getElementById('productsGrid');
const servicesGrid = document.getElementById('servicesGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartBtn = document.getElementById('cartBtn');
const cartClose = document.getElementById('cartClose');
const checkoutBtn = document.getElementById('checkoutBtn');
const chatBtn = document.getElementById('chatBtn');
const chatBox = document.getElementById('chatBox');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const adminToggle = document.getElementById('adminToggle');
const adminPanel = document.getElementById('adminPanel');
const adminClose = document.getElementById('adminClose');
const adminProducts = document.getElementById('adminProducts');
const addProductBtn = document.getElementById('addProductBtn');
const contactForm = document.getElementById('contactForm');

// ── Render Products ──
function renderProducts(filter = currentFilter) {
    const filtered = filter === 'todo'
        ? products
        : products.filter(p => p.category === filter);
    productsGrid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <span class="emoji">${p.emoji}</span>
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <div class="price">$${p.price.toFixed(2)}</div>
            <button class="add-cart" data-id="${p.id}">agregar al carrito</button>
        </div>
    `).join('');
}

// ── Render Services ──
function renderServices() {
    servicesGrid.innerHTML = services.map(s => `
        <div class="service-card">
            <span class="emoji">${s.emoji}</span>
            <h3>${s.name}</h3>
            <p>${s.desc}</p>
        </div>
    `).join('');
}

// ── Cart ──
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function cartAdd(id) {
    const idx = cart.findIndex(c => c.id === id);
    if (idx > -1) {
        cart[idx].qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    saveCart();
    updateCartUI();
    showToast('producto agregado al carrito');
}

function cartRemove(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    updateCartUI();
}

function cartChangeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cartRemove(id);
        return;
    }
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    cartCount.textContent = count;

    if (!cart.length) {
        cartItems.innerHTML = '<div class="cart-empty">el carrito está vacío</div>';
        cartTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(c => {
        const p = products.find(pr => pr.id === c.id);
        if (!p) return '';
        const subtotal = p.price * c.qty;
        total += subtotal;
        return `
            <div class="cart-item">
                <span>${p.emoji}</span>
                <div class="cart-item-info">
                    <h4>${p.name}</h4>
                    <span>$${p.price.toFixed(2)} c/u</span>
                </div>
                <div class="cart-item-qty">
                    <button onclick="cartChangeQty(${c.id}, -1)">−</button>
                    <span>${c.qty}</span>
                    <button onclick="cartChangeQty(${c.id}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="cartRemove(${c.id})">&times;</button>
            </div>
        `;
    }).join('');
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function openCart() {
    cartModal.classList.add('open');
    cartOverlay.classList.add('open');
}

function closeCart() {
    cartModal.classList.remove('open');
    cartOverlay.classList.remove('open');
}

// ── Toast ──
let toastTimer;

function showToast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
        el = document.createElement('div');
        el.className = 'toast';
        document.body.appendChild(el);
    }
    clearTimeout(toastTimer);
    el.textContent = msg;
    el.classList.add('show');
    toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// ── Chatbot ──
const botResponses = {
    hola: '¡Hola! ¿Cómo puedo ayudarte?',
    precio: 'Los precios van desde $19.99 hasta $89.99. Mirá la sección de productos.',
    envio: 'Hacemos envíos a todo el país. El costo varía según tu ubicación.',
    horario: 'Atención de lunes a viernes de 9 a 18 hs.',
    pago: 'Aceptamos tarjetas de crédito, débito y transferencia bancaria.',
    contacto: 'Podés escribirnos a hola@tiendaonline.com o al +54 11 2345-6789.',
    default: 'No entendí tu consulta. Probá preguntarme por precio, envío, horario, pago o contacto.',
};

function addChatMsg(text, type = 'bot') {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChat(input) {
    const msg = input.trim().toLowerCase();
    if (!msg) return;
    addChatMsg(input.trim(), 'user');
    chatInput.value = '';

    setTimeout(() => {
        let reply = botResponses.default;
        for (const key of Object.keys(botResponses)) {
            if (msg.includes(key)) {
                reply = botResponses[key];
                break;
            }
        }
        addChatMsg(reply);
    }, 400);
}

function toggleChat() {
    chatBox.classList.toggle('open');
    if (chatBox.classList.contains('open')) chatInput.focus();
}

// ── Admin ──
function toggleAdmin() {
    adminPanel.classList.toggle('open');
    if (adminPanel.classList.contains('open')) renderAdminProducts();
}

function renderAdminProducts() {
    adminProducts.innerHTML = products.map(p => `
        <div class="admin-product-item">
            <span>${p.emoji} ${p.name}</span>
            <button onclick="deleteProduct(${p.id})">&times;</button>
        </div>
    `).join('');
}

function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    products = products.filter(p => p.id !== id);
    cart = cart.filter(c => c.id !== id);
    saveCart();
    renderProducts();
    renderAdminProducts();
    updateCartUI();
}

function showAddProductModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.id = 'productModal';
    overlay.innerHTML = `
        <div class="modal-box">
            <h3>agregar producto</h3>
            <input id="modalName" placeholder="nombre">
            <input id="modalCategory" placeholder="categoría (electronica, hogar, accesorios)">
            <input id="modalPrice" type="number" step="0.01" placeholder="precio">
            <input id="modalEmoji" placeholder="emoji (ej: 📱)">
            <div class="modal-actions">
                <button class="btn-secondary" id="modalCancel">cancelar</button>
                <button class="btn-primary" id="modalSave">guardar</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#modalCancel').onclick = () => overlay.remove();
    overlay.querySelector('#modalSave').onclick = () => {
        const name = overlay.querySelector('#modalName').value.trim();
        const category = overlay.querySelector('#modalCategory').value.trim();
        const price = parseFloat(overlay.querySelector('#modalPrice').value);
        const emoji = overlay.querySelector('#modalEmoji').value.trim() || '📦';
        if (!name || !category || isNaN(price)) {
            showToast('completá todos los campos');
            return;
        }
        products.push({ id: Date.now(), name, category, price, emoji });
        renderProducts();
        renderAdminProducts();
        overlay.remove();
        showToast('producto agregado');
    };
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

// ── Admin: Colors ──
function applyColors() {
    const root = document.documentElement;
    root.style.setProperty('--primary', document.getElementById('colorPrimary').value);
    root.style.setProperty('--secondary', document.getElementById('colorSecondary').value);
    root.style.setProperty('--accent', document.getElementById('colorAccent').value);
    root.style.setProperty('--bg', document.getElementById('colorBg').value);
    root.style.setProperty('--text', document.getElementById('colorText').value);
    localStorage.setItem('tiendaColors', JSON.stringify({
        primary: document.getElementById('colorPrimary').value,
        secondary: document.getElementById('colorSecondary').value,
        accent: document.getElementById('colorAccent').value,
        bg: document.getElementById('colorBg').value,
        text: document.getElementById('colorText').value,
    }));
}

function loadColors() {
    const saved = JSON.parse(localStorage.getItem('tiendaColors'));
    if (!saved) return;
    Object.entries(saved).forEach(([key, val]) => {
        const el = document.getElementById('color' + key.charAt(0).toUpperCase() + key.slice(1));
        if (el) el.value = val;
    });
    applyColors();
}

// ── Events ──
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderProducts();
    });
});

productsGrid.addEventListener('click', e => {
    const btn = e.target.closest('.add-cart');
    if (btn) cartAdd(parseInt(btn.dataset.id));
});

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => {
    if (!cart.length) return showToast('el carrito está vacío');
    showToast('¡gracias por tu compra!');
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
});

chatBtn.addEventListener('click', toggleChat);
chatClose.addEventListener('click', toggleChat);
chatSend.addEventListener('click', () => handleChat(chatInput.value));
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleChat(chatInput.value); });

adminToggle.addEventListener('click', toggleAdmin);
adminClose.addEventListener('click', toggleAdmin);
addProductBtn.addEventListener('click', showAddProductModal);

document.querySelectorAll('#adminPanel input[type="color"]').forEach(input => {
    input.addEventListener('input', applyColors);
});

contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('mensaje enviado correctamente');
    contactForm.reset();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeCart();
        chatBox.classList.remove('open');
        adminPanel.classList.remove('open');
        const modal = document.getElementById('productModal');
        if (modal) modal.remove();
    }
});

// ── Carousel ──
let currentSlide = 0;
let carouselInterval;
const slides = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('carouselDots');

function buildDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
}

function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
    document.querySelectorAll('.carousel-dots span').forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
    currentSlide = index;
}

function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, 5000);
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

document.getElementById('carouselPrev').addEventListener('click', () => { prevSlide(); startCarousel(); });
document.getElementById('carouselNext').addEventListener('click', () => { nextSlide(); startCarousel(); });
document.getElementById('hero').addEventListener('mouseenter', stopCarousel);
document.getElementById('hero').addEventListener('mouseleave', startCarousel);

buildDots();
startCarousel();

// ── Init ──
renderProducts();
renderServices();
updateCartUI();
loadColors();
