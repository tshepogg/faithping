function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}

let allVerses = [];

function renderVerses(verses) {
  const list = document.getElementById('verse-list');
  list.innerHTML = '';
  verses.forEach(v => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(v.reference)}</strong><br>${escapeHtml(v.text)}`;
    list.appendChild(li);
  });
}

async function loadVerses() {
  const list = document.getElementById('verse-list');
  try {
    const res = await fetch('verses.json', { cache: 'no-store' });
    allVerses = await res.json();
    renderVerses(allVerses);
    const search = document.getElementById('search');
    if (search) {
      search.addEventListener('input', () => {
        const q = search.value.toLowerCase();
        const filtered = allVerses.filter(v =>
          v.reference.toLowerCase().includes(q) ||
          v.text.toLowerCase().includes(q)
        );
        renderVerses(filtered);
      });
    }
  } catch {
    list.innerHTML = '<li>Failed to load verses.</li>';
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  loadVerses();
});
