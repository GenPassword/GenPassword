import './style.css'

// ✅ API URLs
const API_RANDOM = 'https://myproject24.ru/api/password/generate';
const API_WORDS = 'https://myproject24.ru/api/password/generate-from-words';
const API_PIN = 'https://myproject24.ru/api/password/generate';

const $ = (id) => document.getElementById(id);

// ✅ HTML-шаблон приложения
const html = `
<div class="container">
    <!-- КНОПКА ТЕМЫ (SVG внутри, 98x98, без фона) -->
    <button id="themeToggle" class="theme-toggle" title="Сменить тему">
        <!-- Луна (для светлой темы) -->
        <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="98" height="98" viewBox="0 0 98 98" fill="none">
            <path fill="#013374" d="M47.468 20.457q.76-.04 1.532-.04c15.786 0 28.583 12.797 28.583 28.583S64.786 77.583 49 77.583a28.45 28.45 0 0 1-14.802-4.126c15.074-.796 27.052-13.27 27.052-28.543 0-10.368-5.52-19.446-13.782-24.457M5.4 10.2c.101.304.152.456.203.523a.5.5 0 0 0 .794 0c.05-.067.102-.219.203-.523.082-.245.123-.368.176-.479a2 2 0 0 1 .945-.945c.111-.053.234-.094.479-.176.304-.101.456-.152.523-.203a.5.5 0 0 0 0-.794c-.067-.05-.219-.102-.523-.203-.245-.082-.368-.123-.479-.176a2 2 0 0 1-.945-.945A4 4 0 0 1 6.6 5.8c-.101-.304-.152-.456-.203-.522a.5.5 0 0 0-.794 0c-.05.066-.102.218-.203.522a4 4 0 0 1-.176.479 2 2 0 0 1-.945.945A4 4 0 0 1 3.8 7.4c-.304.101-.456.152-.522.203a.5.5 0 0 0 0 .794c.066.05.218.102.522.203.245.082.368.123.479.176a2 2 0 0 1 .945.945c.053.111.094.234.176.479"/>
        </svg>
        <!-- Солнце (для темной темы) -->
        <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="98" height="98" viewBox="0 0 97 97" fill="none">
            <circle cx="48.5" cy="48.5" r="15.167" stroke="#fc0" stroke-width="2"/>
            <path stroke="#fc0" stroke-linecap="round" stroke-width="2" d="M48.5 20.208v-8.083M48.5 84.875v-8.083M68.505 28.495l5.716-5.716M22.779 74.221l5.716-5.716M76.792 48.5h8.083M12.125 48.5h8.083M68.505 68.505l5.716 5.716M22.779 22.779l5.716 5.716"/>
        </svg>
    </button>
    
    <!-- МЕНЮ СПОСОБА ГЕНЕРАЦИИ -->
    <div class="generation-menu">
        <button id="modeSelectBtn" class="mode-select-btn">
            <span>Способ генерации</span>
            <span class="arrow">▲</span>
        </button>
        <div id="modeDropdown" class="mode-dropdown">
            <!-- ✅ ДОБАВЛЕН КЛАСС selected ПО УМОЛЧАНИЮ -->
            <div class="dropdown-item selected" data-mode="random">Случайный</div>
            <div class="dropdown-item" data-mode="pin">Пин-код</div>
            <div class="dropdown-item" data-mode="words">Пароль из слов</div>
        </div>
    </div>

    <h1 class="title_Text">Генератор паролей</h1>
    
    <!-- КЛИКАБЕЛЬНЫЙ БЛОК ПАРОЛЯ -->
    <div class="password-block" id="passwordBlock" title="Нажмите для копирования">
        <div id="password" class="password-text">Нажмите "генерировать"</div>
        <button class="copy-btn" id="copyBtn">Копировать</button>
    </div>
    
    <div class="strength-container">
        <div class="strength-bar" id="strengthBar"></div>
        <span class="strength-text" id="strengthText">-</span>
    </div>
    <div class="strength-percent" id="strengthPercent">Надежность: 0%</div>

    <!-- Режим: Обычная генерация -->
    <div id="randomSettings" class="settings-section">
        
        <!-- КАСТОМНЫЙ СЛАЙДЕР -->
        <div class="custom-slider-wrapper">
            <!-- ✅ ЗАГОЛОВОК -->
            <div class="slider-title">Длина пароля</div>

            <div class="custom-slider" id="customSlider">
                <div class="slider-track-bg"></div>
                <div class="slider-track-fill" id="sliderFill"></div>
                <div class="slider-thumb" id="sliderThumb"></div>
                <div class="slider-value" id="sliderValue">12</div>
            </div>
            <div class="slider-labels">
                <span>4</span>
                <span>64</span>
            </div>
            <input type="hidden" id="length" value="12" min="4" max="64">
        </div>

        <!-- Кнопка "Выбрать все параметры" -->
        <button id="selectAllBtn" class="select-all-btn">Выбрать все параметры</button>

        <!-- Настройки с счетчиками -->
        <div class="settings-with-counters">
            <div class="setting-item">
                <label class="checkbox-item">
                    <input type="checkbox" id="includeLowercase">
                    <span>Строчные (a-z)</span>
                </label>
            </div>

            <div class="setting-item">
                <label class="checkbox-item">
                    <input type="checkbox" id="includeUppercase">
                    <span>Прописные (A-Z)</span>
                </label>
            </div>

            <div class="setting-item with-counter">
                <label class="checkbox-item">
                    <input type="checkbox" id="includeDigits">
                    <span>Цифры (0-9)</span>
                </label>
                <div class="counter-control">
                    <span class="counter-label">Количество:</span>
                    <button class="counter-btn minus" data-target="digitsCount">-</button>
                    <span class="counter-value" id="digitsCountValue">0</span>
                    <button class="counter-btn plus" data-target="digitsCount">+</button>
                </div>
            </div>

            <div class="setting-item with-counter">
                <label class="checkbox-item">
                    <input type="checkbox" id="includeSpecial">
                    <span>Спецсимволы (!@#$%)</span>
                </label>
                <div class="counter-control">
                    <span class="counter-label">Количество:</span>
                    <button class="counter-btn minus" data-target="specialCount">-</button>
                    <span class="counter-value" id="specialCountValue">0</span>
                    <button class="counter-btn plus" data-target="specialCount">+</button>
                </div>
            </div>
        </div>
        
        <!-- Дополнительные опции -->
        <div class="additional-section">
            <div class="setting-item no-counter">
                <label class="checkbox-item">
                    <input type="checkbox" id="excludeSimilar">
                    <span>Исключить похожие (0Ol1I)</span>
                </label>
            </div>
            <div class="setting-item no-counter">
                <label class="checkbox-item">
                    <input type="checkbox" id="noRepeats">
                    <span>Без повторов</span>
                </label>
            </div>
        </div>
    </div>

    <!-- Режим: PIN-код -->
    <div id="pinSettings" class="settings-section" style="display: none;">
        <!-- ✅ ЗАГОЛОВОК ТАКОЙ ЖЕ, КАК В ОБЫЧНОМ РЕЖИМЕ -->
        <div class="custom-slider-wrapper">
            <div class="slider-title">Длина пароля</div>
            
            <div class="custom-slider" id="pinSlider">
                <div class="slider-track-bg"></div>
                <div class="slider-track-fill" id="pinSliderFill"></div>
                <div class="slider-thumb" id="pinSliderThumb"></div>
                <div class="slider-value" id="pinSliderValue">4</div>
            </div>
            <div class="slider-labels">
                <span>4</span>
                <span>8</span>
            </div>
            <input type="hidden" id="pinLength" value="4" min="4" max="8">
        </div>
        <div class="setting-item">
            <label class="checkbox-item">
                <input type="checkbox" id="pinNoRepeats">
                <span>Без повторяющихся цифр</span>
            </label>
        </div>
    </div>

    <!-- Режим: Из слов -->
    <div id="wordsSettings" class="settings-section" style="display: none;">
        
        <!-- СЛАЙДЕР ДЛЯ КОЛИЧЕСТВА СЛОВ -->
        <div class="custom-slider-wrapper">
            <!-- ✅ ЗАГОЛОВОК -->
            <div class="slider-title">Количество слов</div>

            <div class="custom-slider" id="wordsSlider">
                <div class="slider-track-bg"></div>
                <div class="slider-track-fill" id="wordsSliderFill"></div>
                <div class="slider-thumb" id="wordsSliderThumb"></div>
                <div class="slider-value" id="wordsSliderValue">3</div>
            </div>
            <div class="slider-labels">
                <span>2</span>
                <span>8</span>
            </div>
            <input type="hidden" id="wordCount" value="3" min="2" max="8">
        </div>

        <!-- ✅ ПАРАМЕТРЫ ОФОРМЛЕНЫ КАК setting-item (как в других режимах) -->
        <div class="settings-with-counters">
            
            <div class="setting-item">
                <label class="checkbox-item">
                    <span>Регистр:</span>
                </label>
                <select id="wordCase">
                    <option value="0">Нижний</option>
                    <option value="1" selected>Заглавный</option>
                    <option value="2">С заглавной</option>
                </select>
            </div>

            <div class="setting-item">
                <label class="checkbox-item">
                    <span>Разделитель:</span>
                </label>
                <select id="separator">
                    <option value="-">дефис (-)</option>
                    <option value="_">подчёркивание (_)</option>
                    <option value="">нет</option>
                </select>
            </div>

        </div>
    </div>

    <button id="generateBtn" class="generate-btn">Сгенерировать пароль</button>
    <div id="loading" class="loading">⏳ Генерация...</div>
    <div id="error" class="error-message"></div>

    <!-- 🔽 Кнопка прокрутки к генерации (мобильная версия) -->
    <button id="scrollToGenBtn" class="scroll-to-generate" aria-label="Прокрутить к кнопке генерации">
        <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
    </button>
</div>
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
        
        // Элементы меню
        modeSelectBtn: $('modeSelectBtn'),
        modeDropdown: $('modeDropdown'),
        dropdownItems: document.querySelectorAll('.dropdown-item'),
        
        // Элементы PIN слайдера
        pinLength: $('pinLength'),
        pinSlider: $('pinSlider'),
        pinSliderThumb: $('pinSliderThumb'),
        pinSliderFill: $('pinSliderFill'),
        pinSliderValue: $('pinSliderValue'),
        
        // Элементы WORDS слайдера
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

    // ===== СЧЁТЧИКИ ДЛЯ ЦИФР И СПЕЦСИМВОЛОВ =====
    const counters = {
        digitsCount: 0,
        specialCount: 0
    };

    function getPasswordLength() {
        return parseInt(els.length?.value) || 12;
    }

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
                    const newTotal = currentValue + 1 + otherCounter;
                    if (newTotal <= maxVal) {
                        currentValue++;
                    }
                } else {
                    if (currentValue > 0) currentValue--;
                }
                counters[target] = currentValue;
                
                if (currentValue === 0) {
                    if (target === 'digitsCount') {
                        const cb = $('includeDigits');
                        if (cb) cb.checked = false;
                    } else if (target === 'specialCount') {
                        const cb = $('includeSpecial');
                        if (cb) cb.checked = false;
                    }
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
                        if (checkbox.checked) {
                            if (counters.specialCount === 0) {
                                if (counters.digitsCount + 1 <= maxVal) {
                                    counters.specialCount = 1;
                                } else if (counters.digitsCount > 0) {
                                    counters.digitsCount--;
                                    counters.specialCount = 1;
                                }
                            }
                        } else {
                            counters.specialCount = 0;
                        }
                    }
                    
                    if (id === 'includeDigits') {
                        if (checkbox.checked) {
                            if (counters.digitsCount === 0) {
                                if (counters.specialCount + 1 <= maxVal) {
                                    counters.digitsCount = 1;
                                } else if (counters.specialCount > 0) {
                                    counters.specialCount--;
                                    counters.digitsCount = 1;
                                }
                            }
                        } else {
                            counters.digitsCount = 0;
                        }
                    }
                    
                    if (id === 'includeLowercase' || id === 'includeUppercase') {
                        const total = counters.digitsCount + counters.specialCount;
                        if (total > maxVal) {
                            const excess = total - maxVal;
                            if (counters.digitsCount >= counters.specialCount) {
                                counters.digitsCount = Math.max(0, counters.digitsCount - excess);
                            } else {
                                counters.specialCount = Math.max(0, counters.specialCount - excess);
                            }
                        }
                    }
                    
                    updateCounterDisplay();
                });
            }
        });
        
        updateCounterDisplay();
    }

    initCounters();

    // ===== КАСТОМНЫЙ СЛАЙДЕР (Обычный) =====
    if (els.customSlider) {
        const MIN = 4, MAX = 64;
        let isDragging = false;

        const updateSlider = (value) => {
            value = Math.max(MIN, Math.min(MAX, Math.round(value)));
            els.length.value = value;
            const percentage = ((value - MIN) / (MAX - MIN)) * 100;
            els.sliderThumb.style.left = percentage + '%';
            els.sliderFill.style.width = percentage + '%';
            els.sliderValue.style.left = percentage + '%';
            els.sliderValue.textContent = value;
            els.sliderValue.style.opacity = (value === MIN || value === MAX) ? '0' : '1';
            updateCounterDisplay();
        };

        const getPosition = (clientX) => {
            const rect = els.customSlider.getBoundingClientRect();
            return MIN + ((clientX - rect.left) / rect.width) * (MAX - MIN);
        };

        const handleStart = (e) => {
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(getPosition(clientX));
            els.sliderThumb.classList.add('dragging');
        };
        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(getPosition(clientX));
        };
        const handleEnd = () => { isDragging = false; els.sliderThumb.classList.remove('dragging'); };

        els.customSlider.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        els.customSlider.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
        updateSlider(12);
    }

    // ===== КАСТОМНЫЙ СЛАЙДЕР (PIN) =====
    if (els.pinSlider) {
        const MIN = 4, MAX = 8;
        let isDragging = false;

        const updatePinSlider = (value) => {
            value = Math.max(MIN, Math.min(MAX, Math.round(value)));
            els.pinLength.value = value;
            const percentage = ((value - MIN) / (MAX - MIN)) * 100;
            els.pinSliderThumb.style.left = percentage + '%';
            els.pinSliderFill.style.width = percentage + '%';
            els.pinSliderValue.style.left = percentage + '%';
            els.pinSliderValue.textContent = value;
            els.pinSliderValue.style.opacity = (value === MIN || value === MAX) ? '0' : '1';
        };

        const getPinPosition = (clientX) => {
            const rect = els.pinSlider.getBoundingClientRect();
            return MIN + ((clientX - rect.left) / rect.width) * (MAX - MIN);
        };

        const handlePinStart = (e) => {
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updatePinSlider(getPinPosition(clientX));
            els.pinSliderThumb.classList.add('dragging');
        };
        const handlePinMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updatePinSlider(getPinPosition(clientX));
        };
        const handlePinEnd = () => { isDragging = false; els.pinSliderThumb.classList.remove('dragging'); };

        els.pinSlider.addEventListener('mousedown', handlePinStart);
        document.addEventListener('mousemove', handlePinMove);
        document.addEventListener('mouseup', handlePinEnd);
        els.pinSlider.addEventListener('touchstart', handlePinStart);
        document.addEventListener('touchmove', handlePinMove);
        document.addEventListener('touchend', handlePinEnd);
        updatePinSlider(4);
    }

    // ===== КАСТОМНЫЙ СЛАЙДЕР (СЛОВА) =====
    if (els.wordsSlider) {
        const MIN = 2, MAX = 8;
        let isDragging = false;

        const updateWordsSlider = (value) => {
            value = Math.max(MIN, Math.min(MAX, Math.round(value)));
            els.wordCount.value = value;
            const percentage = ((value - MIN) / (MAX - MIN)) * 100;
            els.wordsSliderThumb.style.left = percentage + '%';
            els.wordsSliderFill.style.width = percentage + '%';
            els.wordsSliderValue.style.left = percentage + '%';
            els.wordsSliderValue.textContent = value;
            els.wordsSliderValue.style.opacity = (value === MIN || value === MAX) ? '0' : '1';
        };

        const getWordsPosition = (clientX) => {
            const rect = els.wordsSlider.getBoundingClientRect();
            return MIN + ((clientX - rect.left) / rect.width) * (MAX - MIN);
        };

        const handleWordsStart = (e) => {
            isDragging = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateWordsSlider(getWordsPosition(clientX));
            els.wordsSliderThumb.classList.add('dragging');
        };
        const handleWordsMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateWordsSlider(getWordsPosition(clientX));
        };
        const handleWordsEnd = () => { isDragging = false; els.wordsSliderThumb.classList.remove('dragging'); };

        els.wordsSlider.addEventListener('mousedown', handleWordsStart);
        document.addEventListener('mousemove', handleWordsMove);
        document.addEventListener('mouseup', handleWordsEnd);
        els.wordsSlider.addEventListener('touchstart', handleWordsStart);
        document.addEventListener('touchmove', handleWordsMove);
        document.addEventListener('touchend', handleWordsEnd);
        updateWordsSlider(3);
    }

    // ===== КОПИРОВАНИЕ (вся строка кликабельна) =====
    async function copyPassword() {
        const text = els.password.textContent;
        if (!text || text === 'Нажмите "генерировать"') return;
        try {
            await navigator.clipboard.writeText(text);
            els.copy.textContent = 'Скопировано';
            els.passwordBlock.classList.add('copied');
            setTimeout(() => {
                els.copy.textContent = 'Копировать';
                els.passwordBlock.classList.remove('copied');
            }, 1500);
        } catch (e) { 
            console.error(e); 
            els.copy.textContent = '❌ Ошибка';
            setTimeout(() => els.copy.textContent = 'Копировать', 1500);
        }
    }

    if (els.copy) {
        els.copy.onclick = (e) => {
            e.stopPropagation();
            copyPassword();
        };
    }

    // Клик по всему блоку пароля тоже копирует
    if (els.passwordBlock) {
        els.passwordBlock.onclick = copyPassword;
        els.passwordBlock.style.cursor = 'pointer';
    }

    // ===== Сбор данных =====
    function getRandData() {
        return {
            length: +els.length.value || 12,
            includeLowercase: $('includeLowercase')?.checked || false,
            includeUppercase: $('includeUppercase')?.checked || false,
            includeDigits: $('includeDigits')?.checked || false,
            includeSpecial: $('includeSpecial')?.checked || false,
            excludeSimilar: $('excludeSimilar')?.checked || false,
            noRepeats: $('noRepeats')?.checked || false,
            digitsCount: counters.digitsCount || 0,
            specialCount: counters.specialCount || 0,
            minDigits: counters.digitsCount || 0,
            minSpecial: counters.specialCount || 0
        };
    }

    function getPinData() {
        return {
            length: +els.pinLength.value || 4,
            includeLowercase: false,
            includeUppercase: false,
            includeDigits: true,
            includeSpecial: false,
            excludeSimilar: false,
            noRepeats: $('pinNoRepeats')?.checked || false,
            digitsCount: +els.pinLength.value || 4,
            specialCount: 0,
            minDigits: +els.pinLength.value || 4,
            minSpecial: 0
        };
    }

    function getWordsData() {
        return {
            WordCount: +els.wordCount.value || 3,
            wordCase: +els.wordCase.value,
            separator: els.separator.value
        };
    }

    // ===== Индикатор надежности (с процентами) =====
    function updateStrengthIndicator(entropy) {
        const container = document.querySelector('.strength-container');
        if (!container || !els.strengthText || !els.strengthPercent) return;
        container.classList.remove('weak', 'medium', 'strong', 'very-strong');
        let level = '', label = '-', percent = 0;
        if (entropy !== undefined) percent = Math.min(100, Math.round((entropy / 80) * 100));
        if (entropy < 28) { level = 'weak'; label = 'Слабый'; }
        else if (entropy < 36) { level = 'medium'; label = 'Средний'; }
        else if (entropy < 60) { level = 'strong'; label = 'Надежный'; }
        else { level = 'very-strong'; label = 'Очень надежный'; }
        container.classList.add(level);
        els.strengthText.textContent = label;
        els.strengthPercent.textContent = `Надежность: ${percent}%`;
    }

    function resetStrengthIndicator() {
        const container = document.querySelector('.strength-container');
        if (container) container.classList.remove('weak', 'medium', 'strong', 'very-strong');
        if (els.strengthText) els.strengthText.textContent = '-';
        if (els.strengthPercent) els.strengthPercent.textContent = 'Надежность: 0%';
    }

    // ===== Генерация пароля =====
    async function generate() {
        resetStrengthIndicator();
        if (els.error) els.error.style.display = 'none';
        if (els.loading) els.loading.style.display = 'block';
        if (els.generate) els.generate.disabled = true;

        try {
            let url, data;
            if (mode === 'random') {
                url = API_RANDOM;
                data = getRandData();
                const { includeLowercase, includeUppercase, includeDigits, includeSpecial } = data;
                if (!includeLowercase && !includeUppercase && !includeDigits && !includeSpecial) {
                    throw new Error('Выберите хотя бы один тип символов');
                }
            } else if (mode === 'pin') {
                url = API_PIN;
                data = getPinData();
            } else if (mode === 'words') {
                url = API_WORDS;
                data = getWordsData();
            }

            const ctrl = new AbortController();
            const timeout = setTimeout(() => ctrl.abort(), 10000);
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                signal: ctrl.signal
            });
            clearTimeout(timeout);

            if (!res.ok) {
                const text = await res.text();
                let errorMsg = text;
                try {
                    const json = JSON.parse(text);
                    if (json && typeof json === 'object') errorMsg = json.message || json.error || json.msg || text;
                } catch (e) {}
                if (errorMsg.startsWith('Ошибка 400:')) {
                    const jsonStart = errorMsg.indexOf('{');
                    if (jsonStart !== -1) {
                        try {
                            const json = JSON.parse(errorMsg.slice(jsonStart));
                            if (json.message) errorMsg = json.message;
                        } catch (e) {}
                    }
                }
                throw new Error(errorMsg);
            }

            const json = await res.json();
            if (els.password) els.password.textContent = json.password || 'Ошибка';
            if (json.entropy !== undefined) updateStrengthIndicator(json.entropy);

        } catch (err) {
            console.error(err);
            let msg = 'Не удалось сгенерировать пароль';
            if (err.name === 'AbortError') msg = 'Таймаут сервера';
            else if (err.message && err.message.includes('fetch')) msg = 'Нет связи с сервером';
            else msg = err.message || msg;
            if (els.error) { els.error.textContent = msg; els.error.style.display = 'block'; }
            resetStrengthIndicator();
        } finally {
            if (els.loading) els.loading.style.display = 'none';
            if (els.generate) els.generate.disabled = false;
        }
    }

    if (els.generate) els.generate.onclick = generate;

    // ===== 🔽 Кнопка прокрутки к генерации =====
    const scrollToGenBtn = $('scrollToGenBtn');
    if (scrollToGenBtn) {
        scrollToGenBtn.onclick = () => {
            const genBtn = $('generateBtn');
            if (genBtn) {
                genBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
    }
}