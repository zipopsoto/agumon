// Copy button functionality (link handled via <a>)
document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', () => {
    const codeInput = button.parentElement.querySelector('input');
    if (!codeInput) return;

    const code = codeInput.value;

    navigator.clipboard.writeText(code).then(() => {
      const original = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    }).catch(err => {
      alert('Copy failed: ' + err);
    });
  });
});

// Expiry check — add .expired if promo is past validThrough
document.querySelectorAll('article.discount-card').forEach(card => {
  const meta = card.querySelector('meta[itemprop="validThrough"]');
  const expiresEl = card.querySelector('.badge.expires');
  const copyBtn = card.querySelector('.copy-btn');

  if (!meta || !expiresEl) return;

  const dateStr = meta.getAttribute('content');
  const today = new Date();
  const target = new Date(dateStr);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    expiresEl.textContent = 'Expired';
    card.classList.add('expired');
    if (copyBtn) copyBtn.setAttribute('disabled', true);
  } else if (diffDays === 0) {
    expiresEl.textContent = `D-Day (until ${dateStr})`;
  } else {
    expiresEl.textContent = `D-${diffDays} (until ${dateStr})`;
  }
});
