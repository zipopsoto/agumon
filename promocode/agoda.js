
// 복사 기능만 유지 (링크는 <a>로 처리됨)
document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const codeInput = button.parentElement.querySelector('input');
    if (!codeInput) return;


    const code = codeInput.value;

    navigator.clipboard.writeText(code).then(() => {
      const original = button.textContent;
      button.textContent = '복사됨!';
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    }).catch(err => {
      alert('복사 실패: ' + err);
    });
  });
});

// 유효기간 자동 판단 → 만료된 할인코드에 .expired 추가
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
    expiresEl.textContent = '기간 만료';
    card.classList.add('expired');
    if (copyBtn) copyBtn.setAttribute('disabled', true);
  } else if (diffDays === 0) {
    expiresEl.textContent = `D-Day (${dateStr}까지)`;
  } else {
    expiresEl.textContent = `D-${diffDays} (${dateStr}까지)`;
  }
});
