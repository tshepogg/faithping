function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}

async function loadVerses() {
  const list = document.getElementById('verse-list');
  try {
    const res = await fetch('verses.json', { cache: 'no-store' });
    const verses = await res.json();
    verses.forEach(v => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${escapeHtml(v.reference)}</strong><br>${escapeHtml(v.text)}`;
      list.appendChild(li);
    });
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
