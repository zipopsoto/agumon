document.addEventListener('DOMContentLoaded', function() {
    // FAQ 토글 기능
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isDisplayed = window.getComputedStyle(answer).display !== 'none';
            answer.style.display = isDisplayed ? 'none' : 'block';
        });
    });
    
    // 할인코드 복사 버튼 기능
    const copyButtons = document.querySelectorAll('.btn-copy');
    const messageBox = document.getElementById('message-box');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 버튼이 속한 행(tr)을 찾습니다.
            const row = button.closest('tr');
            // 행의 첫 번째 셀(td)에 있는 텍스트(할인코드)를 가져옵니다.
            const code = row.querySelector('td:first-child').textContent;

            // 임시 input 요소를 생성하여 복사 기능을 안정화합니다.
            const tempInput = document.createElement('textarea');
            tempInput.value = code;
            document.body.appendChild(tempInput);
            tempInput.select();
            
            try {
                // 텍스트를 클립보드에 복사합니다.
                document.execCommand('copy');
                messageBox.textContent = `'${code}' 코드가 복사되었습니다.`;
            } catch (err) {
                messageBox.textContent = '복사 실패! 다시 시도해 주세요.';
                console.error('Copy failed:', err);
            } finally {
                // 임시 input 요소를 제거합니다.
                document.body.removeChild(tempInput);
            }
            
            messageBox.style.display = 'block';

            // TODO: 여기에 원하는 링크를 입력하세요.
            // 복사 메시지 박스가 표시된 후 바로 새 탭을 엽니다.
            const redirectUrl = 'https://www.agoda.com'; // 예시 링크
            window.open(redirectUrl, '_blank');
            
            // 2초 후에 메시지 박스를 숨깁니다.
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 2000);
        });
    });
});
