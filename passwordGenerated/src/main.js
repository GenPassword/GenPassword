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
        
        <div class="checkbox-list">
            <label class="checkbox-item"><input type="checkbox" id="includeLowercase" checked> Строчные (a-z)</label>
            <label class="checkbox-item"><input type="checkbox" id="includeUppercase" checked> Прописные (A-Z)</label>
            <label class="checkbox-item"><input type="checkbox" id="includeDigits" checked> Цифры (0-9)</label>
            <label class="checkbox-item"><input type="checkbox" id="includeSpecial" checked> Спецсимволы (!@#$%)</label>
        </div>
        <div class="additional-section">
            <label class="checkbox-item"><input type="checkbox" id="excludeSimilar"> Исключить похожие (0Ol1I)</label>
            <label class="checkbox-item"><input type="checkbox" id="noRepeats"> Без повторов</label>
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

    els.tabs.forEach(tab => {
        tab.onclick = () => {
            els.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            mode = tab.dataset.mode;
            els.randomSec.style.display = mode === 'random' ? 'block' : 'none';
            els.wordsSec.style.display = mode === 'words' ? 'block' : 'none';
        };
    });

    // ===== КАСТОМНЫЙ СЛАЙДЕР =====
    if (els.customSlider) {
        const MIN = 4;
        const MAX = 64;
        let isDragging = false;

        const updateSlider = (value) => {
            value = Math.max(MIN, Math.min(MAX, Math.round(value)));
            els.length.value = value;

            const percentage = ((value - MIN) / (MAX - MIN)) * 100;
            
            // Двигаем кружок
            els.sliderThumb.style.left = percentage + '%';
            
            // Заполняем шкалу
            els.sliderFill.style.width = percentage + '%';
            
            // Двигаем цифру
            els.sliderValue.style.left = percentage + '%';
            els.sliderValue.textContent = value;
            
            // 🔥 СКРЫВАЕМ цифру на краях, чтобы не было дублей "4" и "64"
            if (value === MIN || value === MAX) {
                els.sliderValue.style.opacity = '0';
            } else {
                els.sliderValue.style.opacity = '1';
            }
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

        // Мышь
        els.customSlider.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        // Тач
        els.customSlider.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);

        // Инициализация
        updateSlider(12);
    }

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

    function getRandData() {
        return {
            length: +els.length.value || 12,
            includeLowercase: $('includeLowercase')?.checked || false,
            includeUppercase: $('includeUppercase')?.checked || false,
            includeDigits: $('includeDigits')?.checked || false,
            includeSpecial: $('includeSpecial')?.checked || false,
            excludeSimilar: $('excludeSimilar')?.checked || false,
            noRepeats: $('noRepeats')?.checked || false,
            minDigits: 0,
            minSpecial: 0
        };
    }

    function getWordsData() {
        return {
            WordCount: +els.wordCount.value || 3,
            wordCase: +els.wordCase.value || 1,
            separator: els.separator.value
        };
    }

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
}