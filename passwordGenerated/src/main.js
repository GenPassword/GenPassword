import './style.css'

const API_RANDOM = 'https://myproject24.ru/api/password/generate';
const API_WORDS = 'https://myproject24.ru/api/password/generate-from-words';

const $ = (id) => document.getElementById(id);

const html = `
<div class="container">
    <button id="themeToggle" class="theme-toggle" title="Сменить тему">🌓</button>
    <h1 class="title_Text">Генератор паролей</h1>
    
    <div class="password-block">
        <div id="password" class="password-text">Нажмите "генерировать"</div>
        <button class="copy-btn-small" id="copyBtn" title="Копировать">📋</button>
    </div>
    
    <div class="strength-container">
        <div class="strength-bar" id="strengthBar"></div>
        <span class="strength-text" id="strengthText">-</span>
    </div>

    <div class="mode-tabs">
        <button class="mode-tab active" data-mode="random">🎲 Случайный</button>
        <button class="mode-tab" data-mode="words">📝 Из слов</button>
    </div>

    <div id="randomSettings" class="settings-section">
        <!-- КАСТОМНЫЙ СЛАЙДЕР -->
        <div class="custom-slider-wrapper">
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

    <div id="wordsSettings" class="settings-section" style="display: none;">
        <div class="form-row">
            <label>Слов:</label>
            <input type="number" id="wordCount" min="2" max="10" value="3">
        </div>
        <div class="form-row">
            <label>Регистр:</label>
            <select id="wordCase">
                <option value="0">нижний</option>
                <option value="1" selected>Заглавный</option>
                <option value="2">ВЕРХНИЙ</option>
            </select>
        </div>
        <div class="form-row">
            <label>Разделитель:</label>
            <select id="separator">
                <option value="-">дефис (-)</option>
                <option value="_">подчёркивание (_)</option>
                <option value="">нет</option>
            </select>
        </div>
    </div>

    <button id="generateBtn" class="generate-btn">Сгенерировать пароль</button>
    <div id="loading" class="loading">⏳ Генерация...</div>
    <div id="error" class="error-message"></div>
</div>
`;

document.getElementById('app').innerHTML = html;

document.addEventListener('DOMContentLoaded', initApp);
initApp();

function initApp() {
    const els = {
        theme: $('themeToggle'),
        copy: $('copyBtn'),
        length: $('length'),
        customSlider: $('customSlider'),
        sliderThumb: $('sliderThumb'),
        sliderFill: $('sliderFill'),
        sliderValue: $('sliderValue'),
        password: $('password'),
        strengthText: $('strengthText'),
        generate: $('generateBtn'),
        loading: $('loading'),
        error: $('error'),
        tabs: document.querySelectorAll('.mode-tab'),
        randomSec: $('randomSettings'),
        wordsSec: $('wordsSettings'),
        wordCount: $('wordCount'),
        wordCase: $('wordCase'),
        separator: $('separator')
    };

    if (!els.generate) return;
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

    // ===== Переключение режимов =====
    els.tabs.forEach(tab => {
        tab.onclick = () => {
            els.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            mode = tab.dataset.mode;
            els.randomSec.style.display = mode === 'random' ? 'block' : 'none';
            els.wordsSec.style.display = mode === 'words' ? 'block' : 'none';
        };
    });

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
        // Обработчики кнопок +/-
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
                updateCounterDisplay();
            });
        });
        
        // Обработчики чекбоксов
        ['includeLowercase', 'includeUppercase', 'includeDigits', 'includeSpecial'].forEach(id => {
            const checkbox = $(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    const maxVal = getMaxCounterValue();
                    
                    // Логика для спецсимволов: при включении ставим 1
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
                    
                    // Логика для цифр: при включении ставим 1
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
                    
                    // Для букв: если сумма цифр+спец > нового лимита — вычитаем из БОЛЬШЕГО
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

    // ===== КАСТОМНЫЙ СЛАЙДЕР =====
    if (els.customSlider) {
        const MIN = 4;
        const MAX = 64;
        let isDragging = false;

        const updateSlider = (value) => {
            value = Math.max(MIN, Math.min(MAX, Math.round(value)));
            els.length.value = value;

            const percentage = ((value - MIN) / (MAX - MIN)) * 100;
            
            els.sliderThumb.style.left = percentage + '%';
            els.sliderFill.style.width = percentage + '%';
            els.sliderValue.style.left = percentage + '%';
            els.sliderValue.textContent = value;
            
            if (value === MIN || value === MAX) {
                els.sliderValue.style.opacity = '0';
            } else {
                els.sliderValue.style.opacity = '1';
            }
            
            updateCounterDisplay();
        };

        const getPosition = (clientX) => {
            const rect = els.customSlider.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = x / rect.width;
            return MIN + percentage * (MAX - MIN);
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

        const handleEnd = () => {
            isDragging = false;
            els.sliderThumb.classList.remove('dragging');
        };

        els.customSlider.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        els.customSlider.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);

        updateSlider(12);
    }

    // ===== Копирование =====
    if (els.copy) {
        els.copy.onclick = async () => {
            const text = els.password.textContent;
            if (!text) return;
            try {
                await navigator.clipboard.writeText(text);
                els.copy.textContent = '✅';
                setTimeout(() => els.copy.textContent = '📋', 1500);
            } catch (e) { console.error(e); }
        };
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

    function getWordsData() {
        return {
            WordCount: +els.wordCount.value || 3,
            wordCase: +els.wordCase.value || 1,
            separator: els.separator.value
        };
    }

    // ===== Индикатор надежности =====
    function updateStrengthIndicator(entropy) {
        const container = document.querySelector('.strength-container');
        if (!container || !els.strengthText) return;
        container.classList.remove('weak', 'medium', 'strong', 'very-strong');
        
        let level = '', label = '-';
        if (entropy < 28) { level = 'weak'; label = 'Слабый'; }
        else if (entropy < 36) { level = 'medium'; label = 'Средний'; }
        else if (entropy < 60) { level = 'strong'; label = 'Надежный'; }
        else { level = 'very-strong'; label = 'Очень надежный'; }
        
        container.classList.add(level);
        els.strengthText.textContent = label;
    }

    function resetStrengthIndicator() {
        const container = document.querySelector('.strength-container');
        if (container) container.classList.remove('weak', 'medium', 'strong', 'very-strong');
        if (els.strengthText) els.strengthText.textContent = '-';
    }

    // ===== Генерация пароля =====
    async function generate() {
        resetStrengthIndicator();
        if (els.error) els.error.style.display = 'none';
        if (els.loading) els.loading.style.display = 'block';
        if (els.generate) els.generate.disabled = true;

        try {
            const url = mode === 'random' ? API_RANDOM : API_WORDS;
            const data = mode === 'random' ? getRandData() : getWordsData();

            if (mode === 'random') {
                const { includeLowercase, includeUppercase, includeDigits, includeSpecial } = data;
                if (!includeLowercase && !includeUppercase && !includeDigits && !includeSpecial) {
                    throw new Error('Выберите хотя бы один тип символов');
                }
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
                const txt = await res.text().catch(() => '');
                throw new Error('Ошибка ' + res.status + ': ' + (txt || res.statusText));
            }

            const json = await res.json();
            if (els.password) els.password.textContent = json.password || 'Ошибка';
            if (json.entropy !== undefined) updateStrengthIndicator(json.entropy);

        } catch (err) {
            console.error(err);
            let msg = 'Не удалось сгенерировать пароль';
            if (err.name === 'AbortError') msg = 'Таймаут сервера';
            else if (err.message.includes('fetch')) msg = 'Нет связи с сервером. Проверьте CORS';
            else msg = 'Ошибка: ' + err.message;
            if (els.error) { els.error.textContent = msg; els.error.style.display = 'block'; }
            resetStrengthIndicator();
        } finally {
            if (els.loading) els.loading.style.display = 'none';
            if (els.generate) els.generate.disabled = false;
        }
    }

    if (els.generate) els.generate.onclick = generate;
}// deploy trigger
// trigger deploy2
