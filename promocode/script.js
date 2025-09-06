document.addEventListener('DOMContentLoaded', function () {
  // FAQ 토글 기능
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((question) => {
    question.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const isDisplayed = window.getComputedStyle(answer).display !== 'none';
      answer.style.display = isDisplayed ? 'none' : 'block';
    });
  });

  // 할인코드 복사 버튼 기능
  const copyButtons = document.querySelectorAll('.btn-copy');
  const messageBox = document.getElementById('message-box');

  copyButtons.forEach((button) => {
    button.addEventListener('click', async function () {
      const row = button.closest('tr');
      const codeCell = row ? row.querySelector('td:first-child') : null;
      const code = codeCell ? codeCell.textContent.trim() : '';

      if (!code) {
        messageBox.textContent = '복사할 코드가 없습니다.';
        messageBox.style.display = 'block';
        setTimeout(() => (messageBox.style.display = 'none'), 2000);
        return;
      }

      // Clipboard API 우선 사용
      try {
        await navigator.clipboard.writeText(code);
        messageBox.textContent = `'${code}' 코드가 복사되었습니다.`;
      } catch (err) {
        // execCommand 폴백
        const tempInput = document.createElement('textarea');
        tempInput.value = code;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand('copy');
          messageBox.textContent = `'${code}' 코드가 복사되었습니다.`;
        } catch (err2) {
          messageBox.textContent = '복사 실패! 다시 시도해 주세요.';
          console.error('Copy failed:', err2);
        } finally {
          document.body.removeChild(tempInput);
        }
      }

      // 메시지 박스 보여주기
      messageBox.style.display = 'block';
      setTimeout(() => (messageBox.style.display = 'none'), 2000);

      // 버튼에 지정된 리다이렉트 URL 읽기
      const redirectUrl = button.getAttribute('data-redirect-url');
      if (redirectUrl) {
        // 클릭 이벤트 안에서 바로 열어야 팝업 차단을 피할 확률이 높습니다.
        window.open(redirectUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });
});
