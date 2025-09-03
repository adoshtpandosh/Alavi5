/* global XMLHttpRequest */
/* exported sendMessage, openModal, closeModal, sendOrder, openAbout, closeAbout */

let products = [];

/* ---------- بارگذاری JSON ---------- */
fetch('data/products.json')
  .then(r => r.json())
  .then(json => { products = json.slice(1); }); // حذف هدر

/* ---------- بارگذاری درباره‌ما ---------- */
fetch('data/about.txt')
  .then(r => r.text())
  .then(t => { document.getElementById('about-content').textContent = t; });

/* ---------- افزودن پیام ---------- */
function appendChat(role, html) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = role;
  div.innerHTML = window.DOMPurify
    ? window.DOMPurify.sanitize(html, { ADD_ATTR: ['onclick'] })
    : html;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

/* ---------- جستجوی هوشمند ---------- */
function sendMessage() {
  const inp = document.getElementById('chat-input');
  const q = inp.value.trim().toLowerCase();
  if (!q) return;

  appendChat('user', `<b>شما:</b> ${inp.value}`);
  inp.value = '';

  // جستجوی دقیق یا fuzzy در JSON
  const found = products.filter(r =>
    r[0].toLowerCase().includes(q) ||
    r[1].toLowerCase().includes(q)
  );

  if (found.length) {
    found.forEach(r => {
      const [name, model, price, desc] = r;
      appendChat('bot', `
        <div class="flex items-start gap-3">
          <div>
            <b>${name} (${model})</b><br>${desc}<br>
            <span class="text-purple-600 font-bold">${price}</span>
            <button onclick="openModal('${name}','${model}','${price}')" class="text-xs underline ml-2">سفارش</button>
          </div>
        </div>
      `);
    });
  } else {
    appendChat('bot', 'محصولی یافت نشد. لطفاً با ۰۹۳۷۰۷۶۹۱۹۱ یا ۰۹۹۲۱۳۵۲۰۸۸ تماس بگیرید.');
  }
}

/* ---------- مودال ---------- */
function openModal(n, d, p, i) {
  document.getElementById('modal-content').innerHTML = `
    ${i ? `<img src="${i}" class="w-full rounded mb-2">` : ''}
    <h3 class="text-lg font-bold">${n}</h3>
    <p class="text-sm">${d}</p>
    <p class="text-purple-600 font-bold">${p}</p>
  `;
  document.getElementById('product-modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('product-modal').classList.add('hidden');
}

/* ---------- ارسال سفارش ---------- */
function sendOrder(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const platform = document.getElementById('platform').value;
  const text = `سفارش جدید
نام: ${fd.get('name')}
تلفن: ${fd.get('phone')}
شهر: ${fd.get('city')}
محصول: ${fd.get('product')}`;
  const phones = ['989370769191', '989921352088'];
  switch (platform) {
    case 'wa':
      phones.forEach(n => window.open(`https://wa.me/${n}?text=${encodeURIComponent(text)}`, '_blank'));
      break;
    case 'tg':
      window.open(`https://t.me/SilinderAlaviBot?start=${encodeURIComponent(text)}`, '_blank');
      break;
    case 'rub':
      window.open(`rubika://sendmessage?text=${encodeURIComponent(text)}&phone=989370769191`, '_blank');
      break;
  }
}