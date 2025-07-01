const mainPage = document.getElementById('main-page');
const resultPage = document.getElementById('result-page');
const linkInput = document.getElementById('link-input');
const resultLinkInput = document.getElementById('result-link-input');
const submitBtn = document.getElementById('submit-btn');
const resultSubmitBtn = document.getElementById('result-submit-btn');
const errorMessage = document.getElementById('error-message');
const resultErrorMessage = document.getElementById('result-error-message');
const resultLinks = document.getElementById('result-links');
const recentSearchesList = document.getElementById('recent-searches-list');
const recentSearchesListResult = document.getElementById('recent-searches-list-result');
const logos = document.querySelectorAll('.logo');

const cids = {
    "검색 카테고리": [
        { id: '1833981', name: '구글지도1' },
        { id: '1917614', name: '구글지도2' },
        { id: '1829968', name: '구글지도3' },
        { id: '1908612', name: '구글 검색1' },
        { id: '1922868', name: '구글 검색2' },
        { id: '1922887', name: '구글 검색3' },
        { id: '1891504', name: '네이버 검색1' }
    ],
    "카드사 카테고리": [
        { id: '1895693&tag=A100692912', name: '현대카드' },
        { id: '1563295', name: '국민카드' },
        { id: '1937712&tag=A100692912', name: '유니온페이' },
        /*
        { link: 'https://www.abc.com/', name: '직링크 이름' },
        */
        { id: '1654104', name: '우리카드' },
        { id: '1932810', name: '우리(마스터)' },
        { id: '1748498', name: 'BC카드' },
        { id: '1917257', name: '신한(마스터)' },
        { id: '1760133', name: '신한카드' },
        { id: '1917334', name: '토스' },
        { id: '1729471', name: '하나' },
        { id: '1942636&tag=A100692912', name: '카카오페이' },
        { id: '1889572', name: '마스터카드' },
        { id: '1889319', name: '비자' }
    ],
    "항공사 카테고리": [
        { id: '1904827', name: '대한항공(적립)' },
        { id: '1806212', name: '아시아나항공(적립)' },
        { id: '1800120', name: '에어서울' }
    ]
};

const affiliateDiscounts = [
    { name: '국민', url: 'https://www.agoda.com/ko-kr/kbcard' },
    { name: '현대', url: 'https://www.agoda.com/ko-kr/hyundaipromo?cid=1895693&tag=A100692912' },
    { name: '우리', url: 'https://www.agoda.com/ko-kr/wooricard' },
    { name: '유니온페이', url: 'https://www.agoda.com/ko-kr/upikrpromo?cid=1937712&tag=A100692912' },
    { name: '우리(마스터)', url: 'https://www.agoda.com/ko-kr/wooricardmaster' },
    { name: '비씨', url: 'https://www.agoda.com/ko-kr/bccard' },
    { name: '신한', url: 'https://www.agoda.com/ko-kr/shinhancard' },
    { name: '신한(마스터)', url: 'https://www.agoda.com/ko-kr/shinhanmaster' },
    { name: '토스', url: 'https://www.agoda.com/ko-kr/tossbank' },
    { name: '하나', url: 'https://www.agoda.com/ko-kr/hanacard' },
    { name: '카카오페이', url: 'https://www.agoda.com/ko-kr/kakaopaypromo?cid=1942636&tag=A100692912' },
    { name: '마스터카드', url: 'https://www.agoda.com/ko-kr/krmastercard' },
    { name: '유니온페이', url: 'https://www.agoda.com/ko-kr/unionpayKR' },
    { name: '비자', url: 'https://www.agoda.com/ko-kr/visakorea' },
    { name: '대한항공', url: 'https://www.agoda.com/ko-kr/koreanair' },
    { name: '아시아나항공', url: 'https://www.agoda.com/ko-kr/flyasiana' },
    { name: '에어서울', url: 'https://www.agoda.com/ko-kr/airseoul' }
];

submitBtn.addEventListener('click', () => handleSubmit(linkInput, errorMessage));
resultSubmitBtn.addEventListener('click', () => handleSubmit(resultLinkInput, resultErrorMessage));

logos.forEach(logo => {
    logo.addEventListener('click', () => {
        resultPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        linkInput.value = '';
    });
});

function handleSubmit(input, errorMsg) {
    const link = input.value.trim();
    if (isValidAgodaLink(link)) {
        addToRecentSearches(link);
        showResults(link);
    } else {
        showError(errorMsg);
    }
}

function isValidAgodaLink(link) {
    return link.includes('agoda.com') && link.includes('/hotel/');
}

function showError(errorMsg) {
    errorMsg.classList.remove('hidden');
    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, 3000);
}

function showResults(originalLink) {
    resultLinks.innerHTML = '';
    const hotelName = extractTitleFromLink(originalLink);
    
    Object.entries(cids).forEach(([category, cidList]) => {
        const categoryDiv = createCategoryDiv(category, cidList, originalLink);
        resultLinks.appendChild(categoryDiv);
    });
    
    const affiliateCategoryDiv = createAffiliateCategoryDiv();
    resultLinks.appendChild(affiliateCategoryDiv);
    
    mainPage.classList.add('hidden');
    resultPage.classList.remove('hidden');
    
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            copyToClipboard(this.getAttribute('data-link'), this);
        });
    });

    resultLinkInput.value = hotelName;
    updateRecentSearchesList();
}

function createCategoryDiv(category, cidList, originalLink) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = category;
    categoryDiv.appendChild(categoryTitle);
    
    cidList.forEach(cid => {
        const newLink = cid.link
        ? cid.link
        : (() => {
            let url = originalLink;
    
            // cid가 있는데 값이 없거나 이상하면 제거
            url = url.replace(/([?&])cid=[^&]*/i, '$1');
    
            // 마지막 & 또는 ? 남으면 정리
            url = url.replace(/[&?]$/, '');
    
            // ?가 이미 있으면 &cid 추가, 아니면 ?cid 추가
            url += (url.includes('?') ? '&' : '?') + `cid=${cid.id}`;
    
            return url;
        })();
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <span>${cid.name}</span>
            <div class="button-group">
                <button onclick="window.open('${newLink}', '_blank')">열기</button>
                <button class="copy-btn" data-link="${newLink}">링크 복사</button>
            </div>
            <span class="copy-message hidden">복사 되었습니다.</span>
        `;
        categoryDiv.appendChild(resultItem);
    });
    
    return categoryDiv;
}

function createAffiliateCategoryDiv() {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = '제휴사 할인';
    categoryDiv.appendChild(categoryTitle);
    
    affiliateDiscounts.forEach(affiliate => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <span>${affiliate.name}</span>
            <div class="button-group">
                <button onclick="window.open('${affiliate.url}', '_blank')">열기</button>
            </div>
        `;
        categoryDiv.appendChild(resultItem);
    });
    
    return categoryDiv;
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const copyMessage = button.parentNode.nextElementSibling;
        copyMessage.classList.remove('hidden');
        copyMessage.classList.add('visible');
        setTimeout(() => {
            copyMessage.classList.remove('visible');
            copyMessage.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('링크 복사 실패:', err);
    });
}

function addToRecentSearches(link) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const title = extractTitleFromLink(link);
    
    recentSearches = recentSearches.filter(item => item.title !== title);
    
    recentSearches.unshift({ title, link });
    recentSearches = recentSearches.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    updateRecentSearchesList();
}

function extractTitleFromLink(link) {
    const urlParts = link.split('/');
    const hotelNameIndex = urlParts.findIndex(part => part === 'hotel') - 1;
    if (hotelNameIndex >= 0) {
        return urlParts[hotelNameIndex].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return '알 수 없는 호텔';
}

function updateRecentSearchesList() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearchesList.innerHTML = '';
    recentSearchesListResult.innerHTML = '';
    recentSearches.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item.title;
        button.addEventListener('click', () => showResults(item.link));
        
        const buttonClone = button.cloneNode(true);
        buttonClone.addEventListener('click', () => showResults(item.link));
        
        recentSearchesList.appendChild(buttonClone);
        recentSearchesListResult.appendChild(button);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateRecentSearchesList();
});

function handleAISuggestions() {
    const aiGenerating = document.getElementById('ai-generating');
    const aiSuggestions = document.getElementById('ai-suggestions');

    // AI Generating 표시
    aiGenerating.classList.remove('hidden');

    setTimeout(() => {
        aiGenerating.classList.add('hidden');  // 4초 후 "AI Generating..." 제거
        aiSuggestions.classList.remove('hidden');  // 사이트 리스트 표시
    }, 4000);
}

// 페이지 로드 후 AI 추천 리스트 표시
document.addEventListener('DOMContentLoaded', handleAISuggestions);

// --- F12 & 개발자 도구 방지 코드 시작 ---
document.addEventListener('keydown', function (e) {
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        alert('개발자 도구 열지 마세요 😠');
        e.preventDefault();
    }
});
 
setInterval(function () {
    const before = new Date();
    debugger;
    const after = new Date();
    if (after - before > 100) {
        alert('개발자 도구 감지됨. 사이트가 차단됩니다.');
        window.location.href = 'about:blank';
    }
}, 1000);
// --- F12 & 개발자 도구 방지 코드 끝 ---
