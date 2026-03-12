// Configuration : remplacer le numéro WhatsApp ici pour le client final
// Format international : 243971668906 (sans + pour WhatsApp API)
const WHATSAPP_NUMBER = '243971668906';

// Produits fixes de la boutique
const produits = [
  { id: 1, nom: 'Parfum Élégance', description: 'Fragrance boisée et florale, 100 ml', prix: 85, image: 'WhatsApp Image 2026-03-10 at 22.30.02.jpeg' },
  { id: 2, nom: 'Montre Classique', description: 'Cadran noir, bracelet cuir, 40 mm', prix: 220, image: 'WhatsApp Image 2026-03-10 at 22.30.02 (1).jpeg' },
  { id: 3, nom: 'Sac Cuir Premium', description: 'Sac bandoulière, cuir véritable', prix: 199, image: 'WhatsApp Image 2026-03-10 at 22.30.03.jpeg' },
  { id: 4, nom: 'Chemise Sur-Mesure', description: '100% coton égyptien, coupe slim', prix: 95, image: 'WhatsApp Image 2026-03-10 at 22.30.05.jpeg' },
  { id: 5, nom: 'Lunettes de Soleil', description: 'Verre polarisé, monture métal', prix: 150, image: 'WhatsApp Image 2026-03-10 at 22.30.06.jpeg' },
  { id: 6, nom: 'Ceinture Luxe', description: 'Boucle argentée, cuir lisse', prix: 60, image: 'WhatsApp Image 2026-03-10 at 22.30.06 (1).jpeg' },
  { id: 7, nom: 'Parfum Floral', description: 'Notes agrumes et jasmin', prix: 75, image: 'WhatsApp Image 2026-03-10 at 22.30.09.jpeg' },
  { id: 8, nom: 'Montre Sport', description: 'Étanche 50m, bracelet silicone', prix: 180, image: 'WhatsApp Image 2026-03-10 at 22.30.10.jpeg' },
  { id: 9, nom: 'Pochette Soirée', description: 'Tissu satiné, fermeture aimantée', prix: 65, image: 'WhatsApp Image 2026-03-10 at 22.30.10 (1).jpeg' },
  { id: 10, nom: 'Bague Joaillerie', description: 'Alliage premium, design épuré', prix: 260, image: 'logo.jpeg' }
];

let cart = {};

const productGrid = document.getElementById('productGrid');
const cartItemsElement = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const clientNameInput = document.getElementById('clientName');
const clientEmailInput = document.getElementById('clientEmail');
const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const ctaTopBtn = document.getElementById('ctaTopBtn');

function loadCart() {
  try {
    const saved = localStorage.getItem('chic_mode_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (error) {
    cart = {};
  }
}

function saveCart() {
  localStorage.setItem('chic_mode_cart', JSON.stringify(cart));
}

function renderProducts() {
  produits.forEach(prod => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-lg-4 col-xl-3 mb-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm product-card" data-product-id="${prod.id}">
        <img src="${prod.image}" class="card-img-top product-image" alt="${prod.nom}" onerror="this.onerror=null;this.src='https://via.placeholder.com/800x600.png?text=Image+indisponible';">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.nom}</h5>
          <p class="card-text text-muted mb-3">${prod.description}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <button class="btn btn-custom" data-product-id="${prod.id}">Ajouter au panier</button>
            <small class="text-secondary">Cliquez pour détails</small>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(col);
  });

  document.querySelectorAll('[data-product-id]').forEach(button => {
    button.addEventListener('click', event => {
      const productId = parseInt(button.getAttribute('data-product-id'), 10);
      if (button.classList.contains('btn')) {
        event.stopPropagation();
        addToCart(productId);
      }
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const productId = parseInt(card.getAttribute('data-product-id'), 10);
      showProductDetails(productId);
    });
  });
}

function showProductDetails(productId) {
  const produit = produits.find(item => item.id === productId);
  if (!produit) return;

  document.getElementById('productDetailImage').src = produit.image;
  document.getElementById('productDetailImage').alt = produit.nom;
  document.getElementById('productDetailName').textContent = produit.nom;
  document.getElementById('productDetailDesc').textContent = produit.description;
  document.getElementById('productDetailPrice').textContent = `${produit.prix} €`; // affiché uniquement en détail

  const detailAddToCartBtn = document.getElementById('detailAddToCart');
  detailAddToCartBtn.onclick = () => {
    addToCart(productId);
    const modal = bootstrap.Modal.getInstance(document.getElementById('productDetailModal'));
    if (modal) modal.hide();
  };

  const modal = new bootstrap.Modal(document.getElementById('productDetailModal'), { keyboard: true });
  modal.show();
}


function addToCart(productId) {
  if (!cart[productId]) {
    const produit = produits.find(item => item.id === productId);
    cart[productId] = { ...produit, quantity: 0 };
  }
  cart[productId].quantity += 1;
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  renderCart();
}

function clearCart() {
  cart = {};
  saveCart();
  renderCart();
}

function renderCart() {
  cartItemsElement.innerHTML = '';
  const items = Object.values(cart);
  if (items.length === 0) {
    cartItemsElement.innerHTML = '<li class="list-group-item">Votre panier est vide.</li>';
    cartTotalElement.textContent = '0 €';
    return;
  }

  let total = 0;
  items.forEach(item => {
    total += item.prix * item.quantity;

    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <strong>${item.nom}</strong> x ${item.quantity}<br>
          <small>${item.prix} € chacun</small>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-secondary me-1" data-action="decrement" data-id="${item.id}">-</button>
          <button class="btn btn-sm btn-outline-secondary me-1" data-action="increment" data-id="${item.id}">+</button>
          <button class="btn btn-sm btn-danger" data-action="remove" data-id="${item.id}">Supprimer</button>
        </div>
      </div>
    `;

    cartItemsElement.appendChild(li);
  });

  cartTotalElement.textContent = `${total} €`;

  cartItemsElement.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'), 10);
      const action = button.getAttribute('data-action');
      if (action === 'remove') {
        removeFromCart(id);
      } else if (action === 'increment') {
        cart[id].quantity += 1;
        saveCart(); renderCart();
      } else if (action === 'decrement') {
        cart[id].quantity = Math.max(1, cart[id].quantity - 1);
        if (cart[id].quantity === 0) removeFromCart(id);
        else { saveCart(); renderCart(); }
      }
    });
  });
}

function showSuccessNotification() {
  const alertEl = document.getElementById('checkoutAlert');
  if (!alertEl) return;
  alertEl.textContent = 'Votre commande a été faite avec succès. Vous serez contacté par nos fournisseurs.';
  alertEl.classList.remove('d-none', 'alert-danger');
  alertEl.classList.add('alert-success');
  setTimeout(() => {
    alertEl.classList.add('d-none');
  }, 7000);
}

function generateWhatsAppMessage() {
  const nomClient = clientNameInput.value.trim();
  if (nomClient === '') {
    clientNameInput.classList.add('is-invalid');
    clientNameInput.focus();
    return null;
  }
  clientNameInput.classList.remove('is-invalid');

  const items = Object.values(cart);
  if (items.length === 0) {
    alert('Votre panier est vide. Ajoutez des produits avant de commander.');
    return null;
  }

  let message = `Bonjour, je suis ${nomClient} et je souhaite commander :\n`;

  items.forEach(item => {
    message += `- ${item.nom} x${item.quantity} (${item.prix}€)`;
    if (item.image) {
      message += ` [Image: ${item.image}]`;
    }
    message += `\n`;
  });

  const email = clientEmailInput.value.trim();
  if (email) {
    message += `\nEmail : ${email}\n`;
  }

  message += `\nNom client : ${nomClient}`;
  message += '\n\nMerci !';
  return message;
}

// Supprime tout contenu entre crochets [] (ex: [Image: ...]) pour le message final
function removeBracketContent(str) {
  if (!str) return str;
  return str.replace(/\s*\[.*?\]\s*/g, '').trim();
}

function checkoutWhatsApp() {
  const message = generateWhatsAppMessage();
  if (!message) return;

  const clean = removeBracketContent(message);
  const encoded = encodeURIComponent(clean);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Ouvre WhatsApp (Web ou App)
  window.open(whatsappLink, '_blank');

  // Notification directe au client sur le site
  showSuccessNotification();
}


function setupEvents() {
  whatsappCheckoutBtn.addEventListener('click', checkoutWhatsApp);
  ctaTopBtn.addEventListener('click', checkoutWhatsApp);
  clearCartBtn.addEventListener('click', () => {
    if (confirm('Vider le panier ?')) clearCart();
  });

  clientNameInput.addEventListener('input', () => {
    if (clientNameInput.value.trim() !== '') {
      clientNameInput.classList.remove('is-invalid');
    }
  });
}

function init() {
  loadCart();
  renderProducts();
  renderCart();
  setupEvents();
  // Notice explicite de fonctionnement direct
  console.log('Site statique: pas de backend, pas de base de données. Commande via WhatsApp seulement.');
}

init();
