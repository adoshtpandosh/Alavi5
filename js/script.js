/* global XMLHttpRequest */
/* exported sendMessage, openModal, closeModal, sendOrder, openAbout, closeAbout */

let products = [];

/* ---------- بارگذاری JSON ---------- */
fetch('data/products.json?v=2.1')
  .then(r => r.json())
  .then(json => {
    products = json;
    sendWelcome();
  });

/* ---------- بارگذاری درباره‌ما ---------- */
fetch('data/about.txt?v=2.1')
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

/* ---------- خوش‌آمدگویی اولیه ---------- */
function sendWelcome() {
  if (document.getElementById('chat-messages').children.length === 0) {
    appendChat('bot', `
      سلام 👋 به دنیای سیلندر علوی خوش اومدین!<br>
      چه چیزی نیاز دارید؟
      <div class="mt-2 flex flex-wrap gap-2">
        <button onclick="quickSearch('سرسیلندر')" class="bg-purple-600 text-white px-3 py-1 rounded text-sm">سرسیلندر</button>
        <button onclick="quickSearch('سیلندر')" class="bg-purple-600 text-white px-3 py-1 rounded text-sm">سیلندر</button>
        <button onclick="quickSearch('موتور کامل')" class="bg-purple-600 text-white px-3 py-1 rounded text-sm">موتور کامل</button>
        <button onclick="quickSearch('نیم موتور')" class="bg-purple-600 text-white px-3 py-1 rounded text-sm">نیم موتور</button>
      </div>
    `);
  }
}

/* ---------- جستجوی سریع با کلیک روی دکمه ---------- */
function quickSearch(key) {
  document.getElementById('chat-input').value = key;
  sendMessage();
}

/* ---------- جستجوی هوشمند (جزئی‌واژه + نرمال‌سازی فارسی) ---------- */
function sendMessage() {
  const inp = document.getElementById('chat-input');
  let q = inp.value.trim().toLowerCase();
  q = q.replace(/ي/g, 'ی').replace(/ك/g, 'ک');
  if (!q) return;

  appendChat('user', `<b>شما:</b> ${inp.value}`);
  inp.value = '';

  /* جستجوی جزئی‌واژه در نام+مدل+توضیح */
  const found = products.filter(r => {
    const hay = (r.name + ' ' + r.model + ' ' + r.description).toLowerCase();
    return q.split(' ').every(word => hay.includes(word));
  });

  if (found.length) {
    const groups = {};
    found.forEach(r => {
      const key = `${r.name} (${r.model})`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });

    Object.entries(groups).forEach(([key, items]) => {
      items.forEach(r => {
        const desc = r.description ? ` - ${r.description}` : '';
        appendChat('bot', `
          <div class="mb-2">
            <b>${key}</b>${desc}<br>
            <span class="text-purple-600 font-bold">${Number(r.price).toLocaleString('fa')} تومان</span>
            <button onclick="openModal('${r.name}','${r.model}','${r.price}','${r.description}')" class="text-xs underline ml-2">سفارش</button>
          </div>
        `);
      });
    });
  } else {
    appendChat('bot', 'محصولی یافت نشد. لطفاً با ۰۹۳۷۰۷۶۹۱۹۱ یا ۰۹۹۲۱۳۵۲۰۸۸ تماس بگیرید.');
  }
}

/* ---------- مودال محصول ---------- */
function openModal(n, d, p, i) {
  document.getElementById('modal-content').innerHTML = `
    ${i ? `<img src="${i}" class="w-full rounded mb-2">` : ''}
    <h3 class="text-lg font-bold">${n}</h3>
    <p class="text-sm">${d}</p>
    <p class="text-purple-600 font-bold">${Number(p).toLocaleString('fa')} تومان</p>
  `;
  document.getElementById('product-modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('product-modal').classList.add('hidden');
}

/* ---------- مودال درباره‌ما ---------- */
function openAbout() {
  document.getElementById('about-modal').classList.remove('hidden');
}
function closeAbout() {
  document.getElementById('about-modal').classList.add('hidden');
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