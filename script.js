// Footer year

document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu
const menu = document.getElementById('menu');
document.getElementById('burger').addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// Typing effect
const words = ['SEO & Content Strategy', 'Google & Meta Ads', 'WordPress Websites', 'AI-Powered Marketing'];
const typed = document.getElementById('typed');
let w = 0, c = 0, deleting = false;
(function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  else if (c > 0) c--;
  else { deleting = false; w = (w + 1) % words.length; }
  setTimeout(type, deleting ? 40 : 80);
})();

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Counters
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    let n = 0;
    const step = setInterval(() => {
      el.textContent = ++n + (n === target ? '+' : '');
      if (n >= target) clearInterval(step);
    }, 120);
    counterIO.unobserve(el);
  });
});
document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

// Nav state, active link, back-to-top
const nav = document.getElementById('nav');
const topBtn = document.getElementById('top');
const links = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 20);
  topBtn.classList.toggle('show', scrollY > 600);
  const pos = scrollY + 120;
  sections.forEach((s, i) => links[i].classList.toggle('active', s && s.offsetTop <= pos && s.offsetTop + s.offsetHeight > pos));
});
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// Certificate lightbox
document.querySelectorAll('.cert-grid img').forEach(img => {
  img.addEventListener('click', () => {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    box.addEventListener('click', () => box.remove());
    document.body.appendChild(box);
  });
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelector('.lightbox')?.remove(); });

// Contact form: opens the visitor's email app with the message filled in
// document.getElementById('form').addEventListener('submit', e => {
//   e.preventDefault();
//   const name = document.getElementById('name').value.trim();
//   const email = document.getElementById('email').value.trim();
//   const msg = document.getElementById('msg').value.trim();
//   const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
//   const body = encodeURIComponent(`${msg}\n\nFrom: ${name} (${email})`);
//   location.href = `mailto:sidhinpk07@gmail.com?subject=${subject}&body=${body}`;
//   document.getElementById('status').textContent = 'Opening your email app…';
// });

// Contact form: sends the message to your inbox via Web3Forms
document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const status = document.getElementById('status');
  const btn = e.target.querySelector('button[type="submit"]');

  btn.disabled = true;
  status.textContent = 'Sending…';

  const payload = {
    access_key: '3f4707cf-f6b5-4774-b204-5370a1afd17e',
    subject: `Portfolio enquiry from ${document.getElementById('name').value.trim()}`,
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('msg').value.trim()
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      status.textContent = 'Thank you! Your message has been sent.';
      e.target.reset();
    } else {
      status.textContent = 'Something went wrong. Please try again or email me directly.';
    }
  } catch (err) {
    status.textContent = 'Network error. Please try again later.';
  } finally {
    btn.disabled = false;
  }
});
