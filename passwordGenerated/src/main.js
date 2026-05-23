import './style.css'

// ✅ API URLs для сервера УрФУ
const API_RANDOM = '/api/password/generate';
const API_WORDS = '/api/password/generate-from-words';
const API_PIN = '/api/password/generate';
const API_AUTH_REGISTER = '/api/Auth/register';
const API_AUTH_LOGIN = '/api/Auth/login';
const API_SETTINGS_SAVE = '/api/UserSettings/save';
const API_SETTINGS_GET = '/api/UserSettings';
const API_SETTINGS_DELETE = '/api/UserSettings/delete';

// ✅ API URLs
// const API_RANDOM = 'https://myproject24.ru/api/password/generate';
// const API_WORDS = 'https://myproject24.ru/api/password/generate-from-words';
// const API_PIN = 'https://myproject24.ru/api/password/generate';
// const API_AUTH_REGISTER = 'https://myproject24.ru/api/Auth/register';
// const API_AUTH_LOGIN = 'https://myproject24.ru/api/Auth/login';
// const API_SETTINGS_SAVE = 'https://myproject24.ru/api/UserSettings/save';
// const API_SETTINGS_GET = 'https://myproject24.ru/api/UserSettings';
// const API_SETTINGS_DELETE = 'https://myproject24.ru/api/UserSettings/delete';

const $ = (id) => document.getElementById(id);

// ===== СОСТОЯНИЕ ПОЛЬЗОВАТЕЛЯ =====
let currentUser = null;
let authToken = null;
let currentMode = 'random';

// ===== ПРЕСЕТЫ НАСТРОЕК =====
let presetsRandom = [];
let presetsPin = [];
let presetsWords = [];

function getCurrentPresets() {
    switch(currentMode) {
        case 'random': return presetsRandom;
        case 'pin': return presetsPin;
        case 'words': return presetsWords;
        default: return presetsRandom;
    }
}

function getGeneratorTypeName() {
    switch(currentMode) {
        case 'random': return 'Random';
        case 'pin': return 'Pin';
        case 'words': return 'Words';
        default: return 'Random';
    }
}

function getGeneratorTypeNumber() {
    switch(currentMode) {
        case 'random': return 0;
        case 'pin': return 1;
        case 'words': return 2;
        default: return 0;
    }
}

// ✅ HTML-шаблон
const html = `
<div class="container">
    <div class="presets-sidebar">
        <div class="presets-header">
            <h3>💾 Сохранённые настройки</h3>
            <button id="saveCurrentPresetBtn" class="save-preset-btn" title="Сохранить текущие настройки">+</button>
        </div>
        <div id="presetsList" class="presets-list">
            <div class="preset-empty">Авторизуйтесь, чтобы<br>сохранять настройки</div>
        </div>
    </div>

    <div class="main-content">
        <button id="themeToggle" class="theme-toggle" title="Сменить тему">
            <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="98" height="98" viewBox="0 0 98 98" fill="none">
                <path fill="#013374" d="M47.468 20.457q.76-.04 1.532-.04c15.786 0 28.583 12.797 28.583 28.583S64.786 77.583 49 77.583a28.45 28.45 0 0 1-14.802-4.126c15.074-.796 27.052-13.27 27.052-28.543 0-10.368-5.52-19.446-13.782-24.457M5.4 10.2c.101.304.152.456.203.523a.5.5 0 0 0 .794 0c.05-.067.102-.219.203-.523.082-.245.123-.368.176-.479a2 2 0 0 1 .945-.945c.111-.053.234-.094.479-.176.304-.101.456-.152.523-.203a.5.5 0 0 0 0-.794c-.067-.05-.219-.102-.523-.203-.245-.082-.368-.123-.479-.176a2 2 0 0 1-.945-.945A4 4 0 0 1 6.6 5.8c-.101-.304-.152-.456-.203-.522a.5.5 0 0 0-.794 0c-.05.066-.102.218-.203.522a4 4 0 0 1-.176.479 2 2 0 0 1-.945.945A4 4 0 0 1 3.8 7.4c-.304.101-.456.152-.522.203a.5.5 0 0 0 0 .794c.066.05.218.102.522.203.245.082.368.123.479.176a2 2 0 0 1 .945.945c.053.111.094.234.176.479"/>
            </svg>
            <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="98" height="98" viewBox="0 0 97 97" fill="none">
                <circle cx="48.5" cy="48.5" r="15.167" stroke="#fc0" stroke-width="2"/>
                <path stroke="#fc0" stroke-linecap="round" stroke-width="2" d="M48.5 20.208v-8.083M48.5 84.875v-8.083M68.505 28.495l5.716-5.716M22.779 74.221l5.716-5.716M76.792 48.5h8.083M12.125 48.5h8.083M68.505 68.505l5.716 5.716M22.779 22.779l5.716 5.716"/>
            </svg>
        </button>
        
        <div class="profile-menu">
            <button id="profileBtn" class="profile-btn">
                <span>👤</span>
                <span id="profileEmail" class="profile-email">Войти</span>
            </button>
        </div>

        <div class="generation-menu">
            <button id="modeSelectBtn" class="mode-select-btn">
                <span>Способ генерации</span>
                <span class="arrow">▲</span>
            </button>
            <div id="modeDropdown" class="mode-dropdown">
                <div class="dropdown-item selected" data-mode="random">Случайный</div>
                <div class="dropdown-item" data-mode="pin">Пин-код</div>
                <div class="dropdown-item" data-mode="words">Пароль из слов</div>
            </div>
        </div>

        <h1 class="title_Text">Генератор паролей</h1>
        
        <div class="password-block" id="passwordBlock" title="Нажмите для копирования">
            <div id="password" class="password-text">Нажмите "генерировать"</div>
            <button class="copy-btn" id="copyBtn">Копировать</button>
        </div>
        
        <div class="strength-container">
            <div class="strength-bar" id="strengthBar"></div>
            <span class="strength-text" id="strengthText">-</span>
        </div>
        <div class="strength-percent" id="strengthPercent">Надежность: 0%</div>

        <div id="randomSettings" class="settings-section">
            <div class="custom-slider-wrapper">
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

            <button id="selectAllBtn" class="select-all-btn">Выбрать все параметры</button>

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

        <div id="pinSettings" class="settings-section" style="display: none;">
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

        <div id="wordsSettings" class="settings-section" style="display: none;">
            <div class="custom-slider-wrapper">
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

        <button id="scrollToGenBtn" class="scroll-to-generate" aria-label="Прокрутить к кнопке генерации">
            <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </button>
    </div>
</div>

<div id="authModal" class="auth-modal" style="display: none;">
    <div class="auth-modal-content">
        <div class="auth-modal-header">
            <h2>Вход / Регистрация</h2>
            <button id="closeAuthModal" class="close-modal">&times;</button>
        </div>
        <div class="auth-modal-body">
            <div class="auth-tabs">
                <button id="loginTab" class="auth-tab active">Вход</button>
                <button id="registerTab" class="auth-tab">Регистрация</button>
            </div>
            
            <form id="loginForm" class="auth-form">
                <div class="auth-input-group">
                    <label>Email</label>
                    <input type="email" id="loginEmail" placeholder="user@example.com" required>
                </div>
                <div class="auth-input-group">
                    <label>Пароль</label>
                    <input type="password" id="loginPassword" placeholder="••••••••" required>
                </div>
                <div class="auth-error" id="loginError"></div>
                <button type="submit" class="auth-submit-btn">Войти</button>
            </form>
            
            <form id="registerForm" class="auth-form" style="display: none;">
                <div class="auth-input-group">
                    <label>Email</label>
                    <input type="email" id="registerEmail" placeholder="user@example.com" required>
                </div>
                <div class="auth-input-group">
                    <label>Пароль</label>
                    <input type="password" id="registerPassword" placeholder="••••••••" required>
                </div>
                <div class="auth-input-group">
                    <label>Подтверждение пароля</label>
                    <input type="password" id="registerConfirmPassword" placeholder="••••••••" required>
                </div>
                <div class="auth-error" id="registerError"></div>
                <button type="submit" class="auth-submit-btn">Зарегистрироваться</button>
            </form>
            
            <div id="logoutInfo" class="auth-logout-info" style="display: none;">
                <p>Вы вошли как <strong id="loggedUserEmail"></strong></p>
                <button id="logoutBtn" class="auth-submit-btn logout-btn">Выйти</button>
            </div>
        </div>
    </div>
</div>

<div id="presetNameModal" class="preset-modal" style="display: none;">
    <div class="preset-modal-content">
        <div class="preset-modal-header">
            <h3>Сохранить настройки</h3>
            <button id="closePresetModal" class="close-modal">&times;</button>
        </div>
        <div class="preset-modal-body">
            <input type="text" id="presetNameInput" placeholder="Введите название" maxlength="30">
        </div>
        <div class="preset-modal-footer">
            <button id="cancelPresetBtn" class="preset-cancel-btn">Отмена</button>
            <button id="confirmPresetBtn" class="preset-confirm-btn">Сохранить</button>
        </div>
    </div>
</div>
`;

document.getElementById('app').innerHTML = html;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

async function initApp() {
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
        wordsSliderValue: $('wordsSliderValue'),
        profileBtn: $('profileBtn'),
        profileEmail: $('profileEmail'),
        authModal: $('authModal'),
        closeAuthModal: $('closeAuthModal'),
        loginTab: $('loginTab'),
        registerTab: $('registerTab'),
        loginForm: $('loginForm'),
        registerForm: $('registerForm'),
        loginError: $('loginError'),
        registerError: $('registerError'),
        logoutInfo: $('logoutInfo'),
        loggedUserEmail: $('loggedUserEmail'),
        logoutBtn: $('logoutBtn'),
        saveCurrentPresetBtn: $('saveCurrentPresetBtn'),
        presetsList: $('presetsList'),
        presetNameModal: $('presetNameModal'),
        presetNameInput: $('presetNameInput'),
        closePresetModal: $('closePresetModal'),
        cancelPresetBtn: $('cancelPresetBtn'),
        confirmPresetBtn: $('confirmPresetBtn')
    };

    // ===== API ВЫЗОВЫ =====
    async function apiRequest(url, method, body, token = null) {
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        
        try {
            const res = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
            });
            clearTimeout(timeout);
            
            let data = null;
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            }
            
            if (!res.ok) {
                const errorMsg = data?.message || data?.error || data?.msg || `Ошибка ${res.status}`;
                throw new Error(errorMsg);
            }
            
            return data;
        } catch (err) {
            clearTimeout(timeout);
            if (err.name === 'AbortError') throw new Error('Таймаут запроса');
            throw err;
        }
    }

    // ===== АВТОРИЗАЦИЯ =====
    async function register(email, password) {
        return await apiRequest(API_AUTH_REGISTER, 'POST', { email, password });
    }

    async function login(email, password) {
        return await apiRequest(API_AUTH_LOGIN, 'POST', { email, password });
    }

    // ===== ПРЕСЕТЫ =====
    async function loadPresetsByType(generatorType) {
        if (!authToken) return [];
        try {
            const url = `${API_SETTINGS_GET}/${generatorType}`;
            const data = await apiRequest(url, 'GET', null, authToken);
            return data?.settings || [];
        } catch (err) {
            console.error(`Ошибка загрузки ${generatorType}:`, err);
            return [];
        }
    }
    
    async function loadAllPresets() {
        if (!currentUser || !authToken) {
            presetsRandom = [];
            presetsPin = [];
            presetsWords = [];
            renderPresets();
            return;
        }
        
        const [random, pin, words] = await Promise.all([
            loadPresetsByType('Random'),
            loadPresetsByType('Pin'),
            loadPresetsByType('Words')
        ]);
        
        presetsRandom = random;
        presetsPin = pin;
        presetsWords = words;
        renderPresets();
    }
    
    async function savePresetToServer(name, settingsJson) {
        if (!authToken) return false;
        try {
            const body = {
                generatorType: getGeneratorTypeNumber(),
                name: name,
                settingsJson: JSON.stringify(settingsJson)
            };
            await apiRequest(API_SETTINGS_SAVE, 'POST', body, authToken);
            return true;
        } catch (err) {
            console.error('Ошибка сохранения:', err);
            return false;
        }
    }
    
    // ✅ УДАЛЕНИЕ ПРЕСЕТА
    async function deletePresetFromServer(id) {
        if (!authToken) return false;
        try {
            await apiRequest(API_SETTINGS_DELETE, 'POST', { Id: id }, authToken);
            return true;
        } catch (err) {
            console.error('Ошибка удаления:', err);
            return false;
        }
    }
    
    function renderPresets() {
        if (!els.presetsList) return;
        
        if (!currentUser || !authToken) {
            els.presetsList.innerHTML = '<div class="preset-empty">Авторизуйтесь, чтобы<br>сохранять настройки</div>';
            return;
        }
        
        const currentPresets = getCurrentPresets();
        
        if (currentPresets.length === 0) {
            els.presetsList.innerHTML = '<div class="preset-empty">Нет сохранённых настроек<br>Нажмите + чтобы добавить</div>';
            return;
        }
        
        els.presetsList.innerHTML = currentPresets.map(preset => `
            <div class="preset-item" data-id="${preset.id}">
                <div class="preset-info">
                    <div class="preset-name">${escapeHtml(preset.name)}</div>
                    <div class="preset-mode">${currentMode === 'random' ? '🎲 Случайный' : currentMode === 'pin' ? '🔢 PIN' : '📝 Слова'}</div>
                </div>
                <div class="preset-actions">
                    <button class="preset-apply" data-id="${preset.id}" title="Применить">✅</button>
                    <button class="preset-delete" data-id="${preset.id}" title="Удалить">🗑️</button>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.preset-apply').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                await applyPreset(id);
            });
        });
        
        document.querySelectorAll('.preset-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                await deletePreset(id);
            });
        });
    }
    
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    function getCurrentSettingsForPreset() {
        if (currentMode === 'random') {
            return {
                length: parseInt(els.length?.value) || 12,
                includeLowercase: $('includeLowercase')?.checked || false,
                includeUppercase: $('includeUppercase')?.checked || false,
                includeDigits: $('includeDigits')?.checked || false,
                includeSpecial: $('includeSpecial')?.checked || false,
                excludeSimilar: $('excludeSimilar')?.checked || false,
                noRepeats: $('noRepeats')?.checked || false,
                digitsCount: counters.digitsCount || 0,
                specialCount: counters.specialCount || 0
            };
        } else if (currentMode === 'pin') {
            return {
                length: parseInt(els.pinLength?.value) || 4,
                noRepeats: $('pinNoRepeats')?.checked || false
            };
        } else if (currentMode === 'words') {
            return {
                wordCount: parseInt(els.wordCount?.value) || 3,
                wordCase: parseInt(els.wordCase?.value) || 1,
                separator: els.separator?.value || '-'
            };
        }
        return {};
    }
    
    async function applyPreset(id) {
        const currentPresets = getCurrentPresets();
        const preset = currentPresets.find(p => p.id === id);
        if (!preset) return;
        
        let settings;
        try {
            settings = typeof preset.settingsJson === 'string' 
                ? JSON.parse(preset.settingsJson) 
                : preset.settingsJson;
        } catch(e) {
            showToast('❌ Ошибка загрузки настроек');
            return;
        }
        
        if (currentMode === 'random') {
            if (settings.length) updateSliderValue(settings.length);
            if (settings.includeLowercase !== undefined) {
                const cb = $('includeLowercase');
                if (cb) cb.checked = settings.includeLowercase;
            }
            if (settings.includeUppercase !== undefined) {
                const cb = $('includeUppercase');
                if (cb) cb.checked = settings.includeUppercase;
            }
            if (settings.includeDigits !== undefined) {
                const cb = $('includeDigits');
                if (cb) cb.checked = settings.includeDigits;
            }
            if (settings.includeSpecial !== undefined) {
                const cb = $('includeSpecial');
                if (cb) cb.checked = settings.includeSpecial;
            }
            if (settings.excludeSimilar !== undefined) {
                const cb = $('excludeSimilar');
                if (cb) cb.checked = settings.excludeSimilar;
            }
            if (settings.noRepeats !== undefined) {
                const cb = $('noRepeats');
                if (cb) cb.checked = settings.noRepeats;
            }
            if (settings.digitsCount !== undefined) counters.digitsCount = settings.digitsCount;
            if (settings.specialCount !== undefined) counters.specialCount = settings.specialCount;
            updateCounterDisplay();
        } else if (currentMode === 'pin') {
            if (settings.length) updatePinSliderValue(settings.length);
            if (settings.noRepeats !== undefined) {
                const cb = $('pinNoRepeats');
                if (cb) cb.checked = settings.noRepeats;
            }
        } else if (currentMode === 'words') {
            if (settings.wordCount) updateWordsSliderValue(settings.wordCount);
            if (settings.wordCase !== undefined && els.wordCase) els.wordCase.value = settings.wordCase;
            if (settings.separator !== undefined && els.separator) els.separator.value = settings.separator;
        }
        
        showToast(`✅ Применён: ${preset.name}`);
    }
    
    // ✅ УДАЛЕНИЕ ПРЕСЕТА (с вызовом API)
    async function deletePreset(id) {
        if (!confirm('Удалить этот пресет?')) return;
        
        const success = await deletePresetFromServer(id);
        
        if (success) {
            // Обновляем локальные массивы
            const currentPresets = getCurrentPresets();
            const newPresets = currentPresets.filter(p => p.id !== id);
            
            switch(currentMode) {
                case 'random': presetsRandom = newPresets; break;
                case 'pin': presetsPin = newPresets; break;
                case 'words': presetsWords = newPresets; break;
            }
            
            renderPresets();
            showToast('🗑️ Пресет удалён');
        } else {
            showToast('❌ Ошибка при удалении');
        }
    }
    
    async function addCurrentPreset(name) {
        const settings = getCurrentSettingsForPreset();
        const success = await savePresetToServer(name, settings);
        if (success) {
            await loadAllPresets();
            showToast(`💾 Пресет "${name}" сохранён`);
        } else {
            showToast('❌ Ошибка при сохранении');
        }
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #013CFF;
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            z-index: 3000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            animation: fadeInOut 2s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // ===== УПРАВЛЕНИЕ СЕССИЕЙ =====
    function saveSession(user, token) {
        currentUser = user;
        authToken = token;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authToken', token);
        updateProfileUI();
        loadAllPresets();
    }

    function clearSession() {
        currentUser = null;
        authToken = null;
        presetsRandom = [];
        presetsPin = [];
        presetsWords = [];
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        updateProfileUI();
        renderPresets();
    }

    function loadSession() {
        const savedUser = localStorage.getItem('currentUser');
        const savedToken = localStorage.getItem('authToken');
        if (savedUser && savedToken) {
            currentUser = JSON.parse(savedUser);
            authToken = savedToken;
            updateProfileUI();
            return true;
        }
        return false;
    }

    function updateProfileUI() {
        if (currentUser && els.profileEmail) {
            els.profileEmail.textContent = currentUser.email.split('@')[0];
        } else if (els.profileEmail) {
            els.profileEmail.textContent = 'Войти';
        }
    }

    // ===== МОДАЛЬНЫЕ ОКНА =====
    function openAuthModal() {
        els.authModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        if (currentUser) {
            els.loginForm.style.display = 'none';
            els.registerForm.style.display = 'none';
            els.logoutInfo.style.display = 'block';
            if (els.loggedUserEmail) els.loggedUserEmail.textContent = currentUser.email;
        } else {
            els.loginForm.style.display = 'block';
            els.registerForm.style.display = 'none';
            els.logoutInfo.style.display = 'none';
            els.loginTab.classList.add('active');
            els.registerTab.classList.remove('active');
        }
    }

    function closeAuthModal() {
        els.authModal.style.display = 'none';
        document.body.style.overflow = '';
        if (els.loginError) els.loginError.textContent = '';
        if (els.registerError) els.registerError.textContent = '';
    }
    
    function openPresetModal() {
        if (!currentUser) {
            showToast('⚠️ Войдите в аккаунт');
            openAuthModal();
            return;
        }
        els.presetNameModal.style.display = 'flex';
        if (els.presetNameInput) {
            els.presetNameInput.value = '';
            els.presetNameInput.focus();
        }
    }
    
    function closePresetModal() {
        els.presetNameModal.style.display = 'none';
    }

    // ===== ТЕМА =====
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

    // ===== ОБРАБОТЧИКИ АВТОРИЗАЦИИ =====
    if (els.profileBtn) {
        els.profileBtn.onclick = () => openAuthModal();
    }
    
    if (els.closeAuthModal) {
        els.closeAuthModal.onclick = () => closeAuthModal();
    }
    
    if (els.authModal) {
        els.authModal.onclick = (e) => {
            if (e.target === els.authModal) closeAuthModal();
        };
    }
    
    if (els.loginTab) {
        els.loginTab.onclick = () => {
            els.loginTab.classList.add('active');
            els.registerTab.classList.remove('active');
            els.loginForm.style.display = 'block';
            els.registerForm.style.display = 'none';
        };
    }
    
    if (els.registerTab) {
        els.registerTab.onclick = () => {
            els.registerTab.classList.add('active');
            els.loginTab.classList.remove('active');
            els.registerForm.style.display = 'block';
            els.loginForm.style.display = 'none';
        };
    }
    
    // РЕГИСТРАЦИЯ
    if (els.registerForm) {
        els.registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = $('registerEmail')?.value.trim();
            const password = $('registerPassword')?.value;
            const confirm = $('registerConfirmPassword')?.value;
            
            if (!email || !password) {
                if (els.registerError) els.registerError.textContent = 'Заполните все поля';
                return;
            }
            if (password !== confirm) {
                if (els.registerError) els.registerError.textContent = 'Пароли не совпадают';
                return;
            }
            if (password.length < 6) {
                if (els.registerError) els.registerError.textContent = 'Пароль должен быть не менее 6 символов';
                return;
            }
            
            try {
                if (els.registerError) els.registerError.textContent = '';
                await register(email, password);
                const loginData = await login(email, password);
                const token = loginData?.token || loginData?.accessToken;
                if (token) {
                    saveSession({ email }, token);
                    closeAuthModal();
                } else {
                    throw new Error('Ошибка авторизации');
                }
            } catch (err) {
                if (els.registerError) els.registerError.textContent = err.message;
            }
        };
    }
    
    // ЛОГИН
    if (els.loginForm) {
        els.loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = $('loginEmail')?.value.trim();
            const password = $('loginPassword')?.value;
            
            if (!email || !password) {
                if (els.loginError) els.loginError.textContent = 'Заполните все поля';
                return;
            }
            
            try {
                if (els.loginError) els.loginError.textContent = '';
                const data = await login(email, password);
                const token = data?.token || data?.accessToken;
                if (token) {
                    saveSession({ email }, token);
                    closeAuthModal();
                } else {
                    throw new Error('Неверные учетные данные');
                }
            } catch (err) {
                if (els.loginError) els.loginError.textContent = err.message;
            }
        };
    }
    
    // ВЫХОД
    if (els.logoutBtn) {
        els.logoutBtn.onclick = () => {
            clearSession();
            closeAuthModal();
        };
    }

    // ===== МЕНЮ РЕЖИМОВ =====
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
            currentMode = item.dataset.mode;
            isDropdownOpen = false;
            els.modeDropdown.classList.remove('show');
            els.modeSelectBtn.classList.remove('active');
            
            els.dropdownItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            
            els.randomSec.style.display = currentMode === 'random' ? 'block' : 'none';
            els.pinSec.style.display = currentMode === 'pin' ? 'block' : 'none';
            els.wordsSec.style.display = currentMode === 'words' ? 'block' : 'none';
            
            renderPresets();
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

    // ===== СЧЕТЧИКИ =====
    const allCheckboxIds = [
        'includeLowercase', 'includeUppercase', 'includeDigits', 'includeSpecial',
        'excludeSimilar', 'noRepeats'
    ];

    const counters = {
        digitsCount: 1,
        specialCount: 1
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
                    if (newTotal <= maxVal) currentValue++;
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

    // ===== СЛАЙДЕРЫ =====
    let updateSliderValue = () => {};
    let updatePinSliderValue = () => {};
    let updateWordsSliderValue = () => {};

    if (els.customSlider) {
        const MIN = 4, MAX = 64;
        let isDragging = false;

        updateSliderValue = (value) => {
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
            updateSliderValue(getPosition(clientX));
            els.sliderThumb.classList.add('dragging');
        };
        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSliderValue(getPosition(clientX));
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
        updateSliderValue(12);
    }

    if (els.pinSlider) {
        const MIN = 4, MAX = 8;
        let isDragging = false;

        updatePinSliderValue = (value) => {
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
            updatePinSliderValue(getPinPosition(clientX));
            els.pinSliderThumb.classList.add('dragging');
        };
        const handlePinMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updatePinSliderValue(getPinPosition(clientX));
        };
        const handlePinEnd = () => { 
            isDragging = false; 
            els.pinSliderThumb.classList.remove('dragging');
        };

        els.pinSlider.addEventListener('mousedown', handlePinStart);
        document.addEventListener('mousemove', handlePinMove);
        document.addEventListener('mouseup', handlePinEnd);
        els.pinSlider.addEventListener('touchstart', handlePinStart);
        document.addEventListener('touchmove', handlePinMove);
        document.addEventListener('touchend', handlePinEnd);
        updatePinSliderValue(4);
    }

    if (els.wordsSlider) {
        const MIN = 2, MAX = 8;
        let isDragging = false;

        updateWordsSliderValue = (value) => {
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
            updateWordsSliderValue(getWordsPosition(clientX));
            els.wordsSliderThumb.classList.add('dragging');
        };
        const handleWordsMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateWordsSliderValue(getWordsPosition(clientX));
        };
        const handleWordsEnd = () => { 
            isDragging = false; 
            els.wordsSliderThumb.classList.remove('dragging');
        };

        els.wordsSlider.addEventListener('mousedown', handleWordsStart);
        document.addEventListener('mousemove', handleWordsMove);
        document.addEventListener('mouseup', handleWordsEnd);
        els.wordsSlider.addEventListener('touchstart', handleWordsStart);
        document.addEventListener('touchmove', handleWordsMove);
        document.addEventListener('touchend', handleWordsEnd);
        updateWordsSliderValue(3);
    }

    // ===== КОПИРОВАНИЕ =====
    async function copyPassword() {
    const text = document.getElementById('password').textContent;
    if (!text || text === 'Нажмите "генерировать"') return;
    
    function showCopySuccess() {
    const btn = document.querySelector('.copy-btn');
    const original = btn.textContent;
    btn.textContent = 'Скопировано!';
    setTimeout(() => btn.textContent = original, 1500);
    }

    // Пробуем современный API
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            showCopySuccess();
            return;
        } catch(e) {}
    }
    
    // Fallback для HTTP
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopySuccess();
}

    if (els.copy) {
        els.copy.onclick = (e) => {
            e.stopPropagation();
            copyPassword();
        };
    }

    if (els.passwordBlock) {
        els.passwordBlock.onclick = copyPassword;
        els.passwordBlock.style.cursor = 'pointer';
    }

    // ===== ГЕНЕРАЦИЯ =====
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

    async function generate() {
        resetStrengthIndicator();
        if (els.error) els.error.style.display = 'none';
        if (els.loading) els.loading.style.display = 'block';
        if (els.generate) els.generate.disabled = true;

        try {
            let url, data;
            if (currentMode === 'random') {
                url = API_RANDOM;
                data = getRandData();
                const { includeLowercase, includeUppercase, includeDigits, includeSpecial } = data;
                if (!includeLowercase && !includeUppercase && !includeDigits && !includeSpecial) {
                    throw new Error('Выберите хотя бы один тип символов');
                }
            } else if (currentMode === 'pin') {
                url = API_PIN;
                data = getPinData();
            } else if (currentMode === 'words') {
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

    // ===== КНОПКИ =====
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

    const scrollToGenBtn = $('scrollToGenBtn');
    if (scrollToGenBtn) {
        scrollToGenBtn.onclick = () => {
            const genBtn = $('generateBtn');
            if (genBtn) genBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
    }

    if (els.saveCurrentPresetBtn) {
        els.saveCurrentPresetBtn.onclick = () => openPresetModal();
    }
    
    if (els.closePresetModal) {
        els.closePresetModal.onclick = () => closePresetModal();
    }
    
    if (els.cancelPresetBtn) {
        els.cancelPresetBtn.onclick = () => closePresetModal();
    }
    
    if (els.confirmPresetBtn) {
        els.confirmPresetBtn.onclick = () => {
            const name = els.presetNameInput?.value.trim();
            if (name) {
                addCurrentPreset(name);
                closePresetModal();
            } else {
                alert('Введите название');
            }
        };
    }
    
    if (els.presetNameModal) {
        els.presetNameModal.onclick = (e) => {
            if (e.target === els.presetNameModal) closePresetModal();
        };
    }
    
    if (els.presetNameInput) {
        els.presetNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const name = els.presetNameInput.value.trim();
                if (name) {
                    addCurrentPreset(name);
                    closePresetModal();
                }
            }
        });
    }

    // ===== ИНИЦИАЛИЗАЦИЯ =====
    initCounters();
    
    const defaultCheckboxes = ['includeLowercase', 'includeUppercase', 'includeDigits', 'includeSpecial'];
    defaultCheckboxes.forEach(id => {
        const cb = $(id);
        if (cb) cb.checked = true;
    });
    updateCounterDisplay();
    
    const hasSession = loadSession();
    if (hasSession) {
        await loadAllPresets();
    } else {
        renderPresets();
    }
}