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
  "through that searches": [
    { id: '1833981', name: 'Google Maps 1' },
    { id: '1917614', name: 'Google Maps 2' },
    { id: '1829968', name: 'Google Maps 3' },
    { id: '1908612', name: 'Google Search 1' },
    { id: '1922868', name: 'Google Search 2' },
    { id: '1922887', name: 'Google Search 3' },
    { id: '1891504', name: 'Naver Search 1' }
  ],
  "through that promo pages": [
    { id: '1895693&tag=A100692912', name: 'Hyundai Card' },
    { id: '1563295', name: 'KB Card' },
    { id: '1937712&tag=A100692912', name: 'UnionPay' },
    { id: '1654104', name: 'Woori Card' },
    { id: '1932810', name: 'Woori (Master)' },
    { id: '1748498', name: 'BC Card' },
    { id: '1917257', name: 'Shinhan (Master)' },
    { id: '1760133', name: 'Shinhan Card' },
    { id: '1917334', name: 'Toss Bank' },
    { id: '1729471', name: 'Hana Card' },
    { id: '1845094&tag=A100692912', name: 'Kakao Pay' },
    { id: '1889572', name: 'MasterCard' },
    { id: '1889319', name: 'Visa' }
  ],
  "through that airline": [
    { id: '1904827', name: 'Korean Air (Mileage)' },
    { id: '1806212', name: 'Asiana Airlines (Mileage)' },
    { id: '1800120', name: 'Air Seoul' }
  ]
};

const affiliateDiscounts = [
  { name: 'KB', url: 'https://www.agoda.com/ko-kr/kbcard' },
  { name: 'Hyundai', url: 'https://www.agoda.com/ko-kr/hyundaipromo?cid=1895693&tag=A100692912' },
  { name: 'Woori', url: 'https://www.agoda.com/ko-kr/wooricard' },
  { name: 'UnionPay', url: 'https://www.agoda.com/ko-kr/upikrpromo?cid=1937712&tag=A100692912' },
  { name: 'Woori (Master)', url: 'https://www.agoda.com/ko-kr/wooricardmaster' },
  { name: 'BC', url: 'https://www.agoda.com/ko-kr/bccard' },
  { name: 'Shinhan', url: 'https://www.agoda.com/ko-kr/shinhancard' },
  { name: 'Shinhan (Master)', url: 'https://www.agoda.com/ko-kr/shinhanmaster' },
  { name: 'Toss', url: 'https://www.agoda.com/ko-kr/tossbank' },
  { name: 'Hana', url: 'https://www.agoda.com/ko-kr/hanacard' },
  { name: 'KakaoPay', url: 'https://www.agoda.com/ko-kr/kakaopaypromo?cid=1845094&tag=A100692912' },
  { name: 'MasterCard', url: 'https://www.agoda.com/ko-kr/krmastercard' },
  { name: 'UnionPay', url: 'https://www.agoda.com/ko-kr/unionpayKR' },
  { name: 'Visa', url: 'https://www.agoda.com/ko-kr/visakorea' },
  { name: 'Korean Air', url: 'https://www.agoda.com/ko-kr/koreanair' },
  { name: 'Asiana Airlines', url: 'https://www.agoda.com/ko-kr/flyasiana' },
  { name: 'Air Seoul', url: 'https://www.agoda.com/ko-kr/airseoul' }
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
    btn.addEventListener('click', function () {
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
        url = url.replace(/([?&])cid=[^&]*/i, '$1');
        url = url.replace(/[&?]$/, '');
        url += (url.includes('?') ? '&' : '?') + `cid=${cid.id}`;
        return url;
      })();

    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.innerHTML = `
      <span>${cid.name}</span>
      <div class="button-group">
        <button onclick="window.open('${newLink}', '_blank')">Open</button>
        <button class="copy-btn" data-link="${newLink}">Copy</button>
      </div>
      <span class="copy-message hidden">Copied!</span>
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
  categoryTitle.textContent = 'Affiliate Discounts';
  categoryDiv.appendChild(categoryTitle);

  affiliateDiscounts.forEach(affiliate => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.innerHTML = `
      <span>${affiliate.name}</span>
      <div class="button-group">
        <button onclick="window.open('${affiliate.url}', '_blank')">Open</button>
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
    console.error('Copy failed:', err);
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
  return 'Unknown Hotel';
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
  aiGenerating.classList.remove('hidden');

  setTimeout(() => {
    aiGenerating.classList.add('hidden');
    aiSuggestions.classList.remove('hidden');
  }, 4000);
}

document.addEventListener('DOMContentLoaded', handleAISuggestions);

// --- F12 Block ---
document.addEventListener('keydown', function (e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    alert('Developer tools are not allowed 😠');
    e.preventDefault();
  }
});

setInterval(function () {
  const before = new Date();
  debugger;
  const after = new Date();
  if (after - before > 100) {
    alert('DevTools detected. Redirecting...');
    window.location.href = 'about:blank';
  }
}, 1000);
