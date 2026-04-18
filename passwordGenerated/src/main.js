import './style.css'
// ✅ API URLs
const API_RANDOM = 'https://myproject24.ru/api/password/generate';
const API_WORDS = 'https://myproject24.ru/api/password/generate-from-words';
const API_PIN = 'https://myproject24.ru/api/password/generate';
const $ = (id) => document.getElementById(id);

// ✅ HTML-шаблон приложения
const html = `
<!-- МЕНЮ СПОСОБА ГЕНЕРАЦИИ -->
 <div class="generation-menu" >
     <button id="modeSelectBtn" class="mode-select-btn" >
         <span >Способ генерации </span >
         <span class="arrow" >▲ </span >
     </button >
     <div id="modeDropdown" class="mode-dropdown" >
         <div class="dropdown-item selected" data-mode="random" >Случайный </div >
         <div class="dropdown-item" data-mode="pin" >Пин-код </div >
         <div class="dropdown-item" data-mode="words" >Пароль из слов </div >
     </div >
 </div >

 <h1 class="title_Text" >Генератор паролей </h1 >

 <!-- КЛИКАБЕЛЬНЫЙ БЛОК ПАРОЛЯ -->
 <div class="password-block" id="passwordBlock" title="Нажмите для копирования" >
     <div id="password" class="password-text" >Нажмите "генерировать" </div >
     <button class="copy-btn" id="copyBtn" >Копировать </button >
 </div >

 <div class="strength-container" >
     <div class="strength-bar" id="strengthBar" ></div >
     <span class="strength-text" id="strengthText" >-</span >
 </div >
 <div class="strength-percent" id="strengthPercent" >Надежность: 0% </div >

 <!-- Режим: Обычная генерация -->
 <div id="randomSettings" class="settings-section" >
    <div class="custom-slider-wrapper" >
         <div class="slider-title" >Длина пароля </div >
         <div class="custom-slider" id="customSlider" >
             <div class="slider-track-bg" ></div >
             <div class="slider-track-fill" id="sliderFill" ></div >
             <div class="slider-thumb" id="sliderThumb" ></div >
             <div class="slider-value" id="sliderValue" >12 </div >
         </div >
         <div class="slider-labels" >
             <span >4 </span >
             <span >64 </span >
         </div >
         <input type="hidden" id="length" value="12" min="4" max="64" >
     </div >
     <button id="selectAllBtn" class="select-all-btn" >Выбрать все параметры </button >
     <div class="settings-with-counters" >
         <div class="setting-item" >
             <label class="checkbox-item" >
                 <input type="checkbox" id="includeLowercase" >
                 <span >Строчные (a-z) </span >
             </label >
         </div >
         <div class="setting-item" >
             <label class="checkbox-item" >
                 <input type="checkbox" id="includeUppercase" >
                 <span >Прописные (A-Z) </span >
             </label >
         </div >
         <div class="setting-item with-counter" >
             <label class="checkbox-item" >
                 <input type="checkbox" id="includeDigits" >
                 <span >Цифры (0-9) </span >
             </label >
             <div class="counter-control" >
                 <span class="counter-label" >Количество: </span >
                 <button class="counter-btn minus" data-target="digitsCount" >-</button >
                 <span class="counter-value" id="digitsCountValue" >0 </span >
                 <button class="counter-btn plus" data-target="digitsCount" >+</button >
             </div >
         </div >
         <div class="setting-item with-counter" >
             <label class="checkbox-item" >
                 <input type="checkbox" id="includeSpecial" >
                 <span >Спецсимволы (!@#$%) </span >
             </label >
             <div class="counter-control" >
                 <span class="counter-label" >Количество: </span >
                 <button class="counter-btn minus" data-target="specialCount" >-</button >
                 <span class="counter-value" id="specialCountValue" >0 </span >
                 <button class="counter-btn plus" data-target="specialCount" >+</button >
             </div >
         </div >
     </div >
     <div class="additional-section" >
         <div class="setting-item no-counter" >
             <label class="checkbox-item" >
                 <input type="checkbox" id="excludeSimilar" >
                 <span >Исключить похожие (0Ol1I) </span >
             </label >
         </div >
         <div class="setting-item no-counter" >
             <label class="checkbox-item" >
                 <input type="checkbox" id="noRepeats" >
                 <span >Без повторов </span >
             </label >
         </div >
     </div >
 </div >

 <!-- Режим: PIN-код -->
 <div id="pinSettings" class="settings-section" style="display: none;" >
     <div class="custom-slider-wrapper" >
         <div class="slider-title" >Длина пароля </div >
         <div class="custom-slider" id="pinSlider" >
             <div class="slider-track-bg" ></div >
             <div class="slider-track-fill" id="pinSliderFill" ></div >
             <div class="slider-thumb" id="pinSliderThumb" ></div >
             <div class="slider-value" id="pinSliderValue" >4 </div >
         </div >
         <div class="slider-labels" >
             <span >4 </span >
             <span >8 </span >
         </div >
         <input type="hidden" id="pinLength" value="4" min="4" max="8" >
     </div >
     <div class="setting-item" >
         <label class="checkbox-item" >
             <input type="checkbox" id="pinNoRepeats" >
             <span >Без повторяющихся цифр </span >
         </label >
     </div >
 </div >

 <!-- Режим: Из слов -->
 <div id="wordsSettings" class="settings-section" style="display: none;" >
     <div class="custom-slider-wrapper" >
         <div class="slider-title" >Количество слов </div >
         <div class="custom-slider" id="wordsSlider" >
             <div class="slider-track-bg" ></div >
             <div class="slider-track-fill" id="wordsSliderFill" ></div >
             <div class="slider-thumb" id="wordsSliderThumb" ></div >
             <div class="slider-value" id="wordsSliderValue" >3 </div >
         </div >
         <div class="slider-labels" >
             <span >2 </span >
             <span >8 </span >
         </div >
         <input type="hidden" id="wordCount" value="3" min="2" max="8" >
     </div >
     <div class="settings-with-counters" >
         <div class="setting-item" >
             <label class="checkbox-item" >
                 <span >Регистр: </span >
             </label >
             <select id="wordCase" >
                 <option value="0" >Нижний </option >
                 <option value="1" selected >Заглавный </option >
                 <option value="2" >С заглавной </option >
             </select >
         </div >
         <div class="setting-item" >
             <label class="checkbox-item" >
                 <span >Разделитель: </span >
             </label >
             <select id="separator" >
                 <option value="-" >дефис (-) </option >
                 <option value="_" >подчёркивание (_) </option >
                 <option value=" " >нет </option >
             </select >
         </div >
     </div >
 </div >

 <button id="generateBtn" class="generate-btn" >Сгенерировать пароль </button >
 <div id="loading" class="loading" >⏳ Генерация... </div >
 <div id="error" class="error-message" > </div >
 <!-- ✅ КНОПКА-СТРЕЛКА ДЛЯ МОБИЛКИ -->
 <button id="scrollToGenerateBtn" class="scroll-arrow-mobile" title="Перейти к генерации">⬇</button>
`;

// ✅ Отрисовка интерфейса
document.getElementById('app').innerHTML = html;

// ✅ Запуск только после готовности DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    const els = {
        theme: $('themeToggle'),
        copy: $('copyBtn'),
        passwordBlock: $('passwordBlock'),
        password: $('password'),
        length: $('length'),
        customSlider: $('customSlider'),
        sliderThumb: $('sliderThumb'),
        sliderFill: $('sliderFill'),
        sliderValue: $('sliderValue'),
        strengthText: $('strengthText'),
        strengthPercent: $('strengthPercent'),
        generate: $('generateBtn'),
        loading: $('loading'),
        error: $('error'),
        randomSec: $('randomSettings'),
        pinSec: $('pinSettings'),
        wordsSec: $('wordsSettings'),
        wordCount: $('wordCount'),
        wordCase: $('wordCase'),
        separator: $('separator'),
        selectAllBtn: $('selectAllBtn'),
        modeSelectBtn: $('modeSelectBtn'),
        modeDropdown: $('modeDropdown'),
        dropdownItems: document.querySelectorAll('.dropdown-item'),
        pinLength: $('pinLength'),
        pinSlider: $('pinSlider'),
        pinSliderThumb: $('pinSliderThumb'),
        pinSliderFill: $('pinSliderFill'),
        pinSliderValue: $('pinSliderValue'),
        wordsSlider: $('wordsSlider'),
        wordsSliderThumb: $('wordsSliderThumb'),
        wordsSliderFill: $('wordsSliderFill'),
        wordsSliderValue: $('wordsSliderValue')
    };

    if (!els.generate) {
        console.warn('⚠️ generateBtn not found');
        return;
    }

    let mode = 'random';

    // ===== Тема =====
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    if (els.theme) {
        els.theme.onclick = () => {
            const html = document.documentElement;
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        };
    }

    // ===== ЛОГИКА ВЫПАДАЮЩЕГО МЕНЮ =====
    let isDropdownOpen = false;
    if (els.modeSelectBtn) {
        els.modeSelectBtn.onclick = (e) => {
            e.stopPropagation();
            isDropdownOpen = !isDropdownOpen;
            els.modeDropdown.classList.toggle('show', isDropdownOpen);
            els.modeSelectBtn.classList.toggle('active', isDropdownOpen);
        };
    }
    els.dropdownItems.forEach(item => {
        item.onclick = () => {
            mode = item.dataset.mode;
            isDropdownOpen = false;
            els.modeDropdown.classList.remove('show');
            els.modeSelectBtn.classList.remove('active');
            els.dropdownItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            els.randomSec.style.display = mode === 'random' ? 'block' : 'none';
            els.pinSec.style.display = mode === 'pin' ? 'block' : 'none';
            els.wordsSec.style.display = mode === 'words' ? 'block' : 'none';
            if (els.error) els.error.style.display = 'none';
        };
    });
    document.addEventListener('click', () => {
        if (isDropdownOpen) {
            isDropdownOpen = false;
            els.modeDropdown.classList.remove('show');
            els.modeSelectBtn.classList.remove('active');
        }
    });
    if (els.modeDropdown) {
        els.modeDropdown.onclick = (e) => e.stopPropagation();
    }

    // ===== Кнопка "Выбрать все параметры" =====
    const allCheckboxIds = [
        'includeLowercase', 'includeUppercase', 'includeDigits', 'includeSpecial',
        'excludeSimilar', 'noRepeats'
    ];
    if (els.selectAllBtn) {
        els.selectAllBtn.onclick = () => {
            allCheckboxIds.forEach(id => {
                const cb = $(id);
                if (cb) cb.checked = true;
            });
            counters.digitsCount = 1;
            counters.specialCount = 1;
            updateCounterDisplay();
        };
    }

    // ===== СЧЁТЧИКИ =====
    const counters = { digitsCount: 0, specialCount: 0 };
    function getPasswordLength() { return parseInt(els.length?.value) || 12; }
    function getMaxCounterValue() {
        const length = getPasswordLength();
        let minRequired = 0;
        if ($('includeLowercase')?.checked) minRequired++;
        if ($('includeUppercase')?.checked) minRequired++;
        return Math.max(0, length - minRequired);
    }
    function updateCounterDisplay() {
        const digitsValue = document.getElementById('digitsCountValue');
        const specialValue = document.getElementById('specialCountValue');
        const maxVal = getMaxCounterValue();
        if (digitsValue) digitsValue.textContent = counters.digitsCount;
        if (specialValue) specialValue.textContent = counters.specialCount;
        
        const digitsMinus = document.querySelector('[data-target="digitsCount"].minus');
        const digitsPlus = document.querySelector('[data-target="digitsCount"].plus');
        const specialMinus = document.querySelector('[data-target="specialCount"].minus');
        const specialPlus = document.querySelector('[data-target="specialCount"].plus');
        
        if (digitsMinus) digitsMinus.disabled = counters.digitsCount <= 0;
        if (specialMinus) specialMinus.disabled = counters.specialCount <= 0;
        if (digitsPlus) {
            const newTotal = counters.digitsCount + 1 + counters.specialCount;
            digitsPlus.disabled = newTotal > maxVal || !$('includeDigits')?.checked;
        }
        if (specialPlus) {
            const newTotal = counters.digitsCount + counters.specialCount + 1;
            specialPlus.disabled = newTotal > maxVal || !$('includeSpecial')?.checked;
        }
    }
    function initCounters() {
        document.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.dataset.target;
                const isPlus = e.target.classList.contains('plus');
                const maxVal = getMaxCounterValue();
                let currentValue = counters[target];
                if (isPlus) {
                    const otherCounter = target === 'digitsCount' ? counters.specialCount : counters.digitsCount;
                    if (currentValue + 1 + otherCounter <= maxVal) currentValue++;
                } else {
                    if (currentValue > 0) currentValue--;
                }
                counters[target] = currentValue;
                if (currentValue === 0) {
                    if (target === 'digitsCount' && $('includeDigits')) $('includeDigits').checked = false;
                    else if (target === 'specialCount' && $('includeSpecial')) $('includeSpecial').checked = false;
                }
                updateCounterDisplay();
            });
        });
        allCheckboxIds.forEach(id => {
            const checkbox = $(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    const maxVal = getMaxCounterValue();
                    if (id === 'includeSpecial') {
                        if (checkbox.checked && counters.specialCount === 0) {
                            if (counters.digitsCount + 1 <= maxVal) counters.specialCount = 1;
                            else if (counters.digitsCount > 0) { counters.digitsCount--; counters.specialCount = 1; }
                        } else if (!checkbox.checked) counters.specialCount = 0;
                    }
                    if (id === 'includeDigits') {
                        if (checkbox.checked && counters.digitsCount === 0) {
                            if (counters.specialCount + 1 <= maxVal) counters.digitsCount = 1;
                            else if (counters.specialCount > 0) { counters.specialCount--; counters.digitsCount = 1; }
                        } else if (!checkbox.checked) counters.digitsCount = 0;
                    }
                    if (id === 'includeLowercase' || id === 'includeUppercase') {
                        const total = counters.digitsCount + counters.specialCount;
                        if (total > maxVal) {
                            const excess = total - maxVal;
                            if (counters.digitsCount >= counters.specialCount) counters.digitsCount = Math.max(0, counters.digitsCount - excess);
                            else counters.specialCount = Math.max(0, counters.specialCount - excess);
                        }
                    }
                    updateCounterDisplay();
                });
            }
        });
        updateCounterDisplay();
    }
    initCounters();

    // ===== СЛАЙДЕРЫ (Общий хелпер) =====
    function initSlider(sliderEl, thumbEl, fillEl, valueEl, hiddenInput, MIN, MAX, initVal) {
        if (!sliderEl) return;
        let isDragging = false;
        const update = (val) => {
            val = Math.max(MIN, Math.min(MAX, Math.round(val)));
            hiddenInput.value = val;
            const pct = ((val - MIN) / (MAX - MIN)) * 100;
            thumbEl.style.left = pct + '%';
            fillEl.style.width = pct + '%';
            valueEl.style.left = pct + '%';
            valueEl.textContent = val;
            valueEl.style.opacity = (val === MIN || val === MAX) ? '0' : '1';
            if (hiddenInput.id === 'length') updateCounterDisplay();
        };
        const getPos = (cx) => {
            const rect = sliderEl.getBoundingClientRect();
            return MIN + ((cx - rect.left) / rect.width) * (MAX - MIN);
        };
        const start = (e) => { isDragging = true; update(getPos(e.touches ? e.touches[0].clientX : e.clientX)); thumbEl.classList.add('dragging'); };
        const move = (e) => { if (!isDragging) return; e.preventDefault(); update(getPos(e.touches ? e.touches[0].clientX : e.clientX)); };
        const end = () => { isDragging = false; thumbEl.classList.remove('dragging'); };
        
        sliderEl.addEventListener('mousedown', start);
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
        sliderEl.addEventListener('touchstart', start, { passive: true });
        document.addEventListener('touchmove', move, { passive: false });
        document.addEventListener('touchend', end);
        update(initVal);
    }
    initSlider(els.customSlider, els.sliderThumb, els.sliderFill, els.sliderValue, els.length, 4, 64, 12);
    initSlider(els.pinSlider, els.pinSliderThumb, els.pinSliderFill, els.pinSliderValue, els.pinLength, 4, 8, 4);
    initSlider(els.wordsSlider, els.wordsSliderThumb, els.wordsSliderFill, els.wordsSliderValue, els.wordCount, 2, 8, 3);

    // ===== КОПИРОВАНИЕ =====
    async function copyPassword() {
        const text = els.password.textContent;
        if (!text || text === 'Нажмите "генерировать"') return;
        try {
            await navigator.clipboard.writeText(text);
            els.copy.textContent = 'Скопировано';
            els.passwordBlock.classList.add('copied');
            setTimeout(() => { els.copy.textContent = 'Копировать'; els.passwordBlock.classList.remove('copied'); }, 1500);
        } catch (e) {
            els.copy.textContent = '❌ Ошибка';
            setTimeout(() => els.copy.textContent = 'Копировать', 1500);
        }
    }
    if (els.copy) els.copy.onclick = (e) => { e.stopPropagation(); copyPassword(); };
    if (els.passwordBlock) { els.passwordBlock.onclick = copyPassword; els.passwordBlock.style.cursor = 'pointer'; }

    // ===== Сбор данных =====
    function getRandData() {
        return {
            length: +els.length.value || 12, includeLowercase: $('includeLowercase')?.checked || false,
            includeUppercase: $('includeUppercase')?.checked || false, includeDigits: $('includeDigits')?.checked || false,
            includeSpecial: $('includeSpecial')?.checked || false, excludeSimilar: $('excludeSimilar')?.checked || false,
            noRepeats: $('noRepeats')?.checked || false, digitsCount: counters.digitsCount || 0,
            specialCount: counters.specialCount || 0, minDigits: counters.digitsCount || 0, minSpecial: counters.specialCount || 0
        };
    }
    function getPinData() {
        return {
            length: +els.pinLength.value || 4, includeLowercase: false, includeUppercase: false,
            includeDigits: true, includeSpecial: false, excludeSimilar: false,
            noRepeats: $('pinNoRepeats')?.checked || false, digitsCount: +els.pinLength.value || 4,
            specialCount: 0, minDigits: +els.pinLength.value || 4, minSpecial: 0
        };
    }
    function getWordsData() {
        return { WordCount: +els.wordCount.value || 3, wordCase: +els.wordCase.value, separator: els.separator.value };
    }

    // ===== Индикатор надежности =====
    function updateStrengthIndicator(entropy) {
        const container = document.querySelector('.strength-container');
        if (!container || !els.strengthText || !els.strengthPercent) return;
        container.classList.remove('weak', 'medium', 'strong', 'very-strong');
        let level = '', percent = 0;
        if (entropy !== undefined) percent = Math.min(100, Math.round((entropy / 80) * 100));
        if (entropy < 28) level = 'weak';
        else if (entropy < 36) level = 'medium';
        else if (entropy < 60) level = 'strong';
        else level = 'very-strong';
        container.classList.add(level);
        els.strengthText.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        els.strengthPercent.textContent = `Надежность: ${percent}%`;
    }
    function resetStrengthIndicator() {
        const container = document.querySelector('.strength-container');
        if (container) container.classList.remove('weak', 'medium', 'strong', 'very-strong');
        if (els.strengthText) els.strengthText.textContent = '-';
        if (els.strengthPercent) els.strengthPercent.textContent = 'Надежность: 0%';
    }

    // ===== Генерация =====
    async function generate() {
        resetStrengthIndicator();
        if (els.error) els.error.style.display = 'none';
        if (els.loading) els.loading.style.display = 'block';
        if (els.generate) els.generate.disabled = true;
        try {
            let url, data;
            if (mode === 'random') { url = API_RANDOM; data = getRandData(); if (!data.includeLowercase && !data.includeUppercase && !data.includeDigits && !data.includeSpecial) throw new Error('Выберите хотя бы один тип символов'); }
            else if (mode === 'pin') { url = API_PIN; data = getPinData(); }
            else if (mode === 'words') { url = API_WORDS; data = getWordsData(); }
            
            const ctrl = new AbortController();
            const timeout = setTimeout(() => ctrl.abort(), 10000);
            const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: ctrl.signal });
            clearTimeout(timeout);
            if (!res.ok) { const t = await res.text(); throw new Error(t.includes('{"message"') ? JSON.parse(t.slice(t.indexOf('{'))).message : t); }
            const json = await res.json();
            if (els.password) els.password.textContent = json.password || 'Ошибка';
            if (json.entropy !== undefined) updateStrengthIndicator(json.entropy);
        } catch (err) {
            console.error(err);
            let msg = err.name === 'AbortError' ? 'Таймаут сервера' : err.message || 'Не удалось сгенерировать пароль';
            if (els.error) { els.error.textContent = msg; els.error.style.display = 'block'; }
            resetStrengthIndicator();
        } finally {
            if (els.loading) els.loading.style.display = 'none';
            if (els.generate) els.generate.disabled = false;
        }
    }
    if (els.generate) els.generate.onclick = generate;

    // ✅ ЛОГИКА СТРЕЛКИ СКРОЛЛА ДЛЯ МОБИЛКИ
    const scrollBtn = $('scrollToGenerateBtn');
    if (scrollBtn && els.generate) {
        scrollBtn.onclick = () => els.generate.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const checkVisibility = () => {
            if (window.innerWidth > 768) { scrollBtn.classList.remove('visible'); return; }
            const rect = els.generate.getBoundingClientRect();
            const isOffScreen = rect.top < 0 || rect.bottom > window.innerHeight;
            scrollBtn.classList.toggle('visible', isOffScreen);
        };
        window.addEventListener('scroll', checkVisibility, { passive: true });
        window.addEventListener('resize', checkVisibility);
        checkVisibility();
    }
}