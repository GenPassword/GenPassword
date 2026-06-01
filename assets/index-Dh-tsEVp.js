(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://myproject24.ru/api/password/generate`,t=`https://myproject24.ru/api/password/generate-from-words`,n=`https://myproject24.ru/api/password/generate`,r=`https://myproject24.ru/api/Auth/register`,i=`https://myproject24.ru/api/Auth/login`,a=`https://myproject24.ru/api/Auth/refresh`,o=`https://myproject24.ru/api/UserSettings/save`,s=`https://myproject24.ru/api/UserSettings`,c=`https://myproject24.ru/api/UserSettings/delete`,l=`https://myproject24.ru/api/UserSavedPassword/save`,u=`https://myproject24.ru/api/UserSavedPassword/getSaves`,d=`https://myproject24.ru/api/UserSavedPassword/delete`,f=e=>document.getElementById(e);function ee(e){return e?e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`).replace(/\\/g,`&#92;`).replace(/\//g,`&#47;`):``}function te(e){return e?e.replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s\-_]/g,``):``}function ne(e){return/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(e)}function re(e){return e&&e.length>=6}function p(e){if(!e)return``;let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function ie(e){if(!e)return``;let t=[`javascript:`,`data:`,`vbscript:`,`file:`],n=e.toLowerCase();for(let e of t)if(n.includes(e))return`#`;return e}var m={lastCall:{},limit(e,t=1e3){let n=Date.now();return this.lastCall[e]&&n-this.lastCall[e]<t?!1:(this.lastCall[e]=n,!0)}};function h(e){console.warn(`⚠️ Подозрительная активность:`,e)}function g(e){return e?[/<script/i,/javascript:/i,/onload=/i,/onerror=/i,/onclick=/i,/onmouseover=/i,/<iframe/i,/<object/i,/<embed/i,/expression\(/i,/alert\(/i,/eval\(/i,/document\./i,/window\./i,/localStorage\./i,/sessionStorage\./i,/fetch\(/i,/XMLHttpRequest/i].some(t=>t.test(e)):!1}function ae(){let e=sessionStorage.getItem(`csrfToken`);if(!e){let e=Math.random().toString(36).substring(2)+Date.now().toString(36);return sessionStorage.setItem(`csrfToken`,e),e}return e}var _=null,v=null,y=`random`,b=[],x=[],S=[],C=[],w=!1,T=[];function E(){switch(y){case`random`:return b;case`pin`:return x;case`words`:return S;default:return b}}function oe(){switch(y){case`random`:return 0;case`pin`:return 1;case`words`:return 2;default:return 0}}var D=`
<div class="container">
    <div class="main-content">
        <div class="generator-logo">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.5" y="2.5" width="59" height="59" rx="3.5" fill="#D9D9D9" stroke="#00D9FF" stroke-width="5"/>
                <rect width="55" height="55" transform="translate(5 5)" fill="#1C1FC2"/>
                <path d="M39.375 25.625L30.2083 34.7917L25.625 30.2083M50.8333 28.2949C50.8333 43.3472 39.4482 50.0956 34.6216 52.2803L34.6155 52.2829C34.1079 52.5127 33.8534 52.6279 33.2766 52.7269C32.9113 52.7896 32.091 52.7896 31.7257 52.7269C31.1466 52.6275 30.8895 52.5119 30.3778 52.2803C25.5512 50.0956 14.1667 43.3471 14.1667 28.2949V19.2088C14.1667 16.6419 14.1667 15.3575 14.6662 14.377C15.1056 13.5146 15.8063 12.814 16.6687 12.3746C17.6491 11.875 18.9335 11.875 21.5005 11.875H43.5005C46.0674 11.875 47.349 11.875 48.3295 12.3746C49.1919 12.814 49.8949 13.5146 50.3343 14.377C50.8333 15.3565 50.8333 16.6394 50.8333 19.2013V28.2949Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h1>GenPass</h1>
        </div>

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
                <svg width="18" height="23" viewBox="0 0 18 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.75 21.25C16.75 16.9008 13.2242 13.375 8.875 13.375C4.52576 13.375 1 16.9008 1 21.25M8.875 10C6.38972 10 4.375 7.98528 4.375 5.5C4.375 3.01472 6.38972 1 8.875 1C11.3603 1 13.375 3.01472 13.375 5.5C13.375 7.98528 11.3603 10 8.875 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
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
        
        <div class="password-actions">
            <button id="savePasswordBtn" class="save-password-btn">Сохранить пароль</button>
            <button id="viewSavedPasswordsBtn" class="view-saved-btn">Мои пароли</button>
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

    <div class="presets-sidebar">
        <div class="presets-header">
            <h3>Сохранённые настройки</h3>
            <button id="saveCurrentPresetBtn" class="save-preset-btn" title="Сохранить текущие настройки">+</button>
        </div>
        <div id="presetsList" class="presets-list">
            <div class="preset-empty">Авторизуйтесь, чтобы<br>сохранять настройки</div>
        </div>
    </div>
</div>

<!-- Модалка для сохранения пароля -->
<div id="savePasswordModal" class="save-password-modal" style="display: none;">
    <div class="save-password-modal-content">
        <div class="save-password-modal-header">
            <h3>Сохранить пароль</h3>
            <button id="closeSavePasswordModal" class="close-modal">
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="31" height="31" fill="transparent"/>
                    <path d="M27.1249 27.1249L15.5 15.5M15.5 15.5L3.875 3.875M15.5 15.5L27.1251 3.875M15.5 15.5L3.875 27.1251" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="save-password-modal-body">
            <div class="form-group">
                <label>Пароль</label>
                <input type="text" id="savePasswordValue" readonly>
            </div>
            <div class="form-group">
                <label>Описание</label>
                <input type="text" id="savePasswordDescription" maxlength="100">
            </div>
        </div>
        <div class="save-password-modal-footer">
            <button id="cancelSavePasswordBtn" class="cancel-save-btn">Отмена</button>
            <button id="confirmSavePasswordBtn" class="confirm-save-btn">Сохранить</button>
        </div>
    </div>
</div>

<!-- Модалка для просмотра сохранённых паролей -->
<div id="savedPasswordsModal" class="saved-passwords-modal" style="display: none;">
    <div class="saved-passwords-modal-content">
        <div class="saved-passwords-modal-header">
            <h3>Мои сохранённые пароли</h3>
            <button id="closeSavedPasswordsModal" class="close-modal">
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="31" height="31" fill="transparent"/>
                    <path d="M27.1249 27.1249L15.5 15.5M15.5 15.5L3.875 3.875M15.5 15.5L27.1251 3.875M15.5 15.5L3.875 27.1251" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="saved-passwords-modal-body">
            <div id="savedPasswordsList" class="saved-passwords-list">
                <div class="saved-passwords-empty">Нет сохранённых паролей</div>
            </div>
        </div>
    </div>
</div>

<!-- Модалка для подтверждения удаления пароля -->
<div id="deletePasswordConfirmModal" class="confirm-modal" style="display: none;">
    <div class="confirm-modal-content">
        <div class="confirm-modal-header">
            <div class="confirm-modal-warning-icon">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="38" fill="transparent"/>
                    <path d="M19 14.25V20.5833M6.93327 24.0664C5.49333 26.5604 4.77357 27.8079 4.88112 28.8312C4.97493 29.7237 5.44337 30.5346 6.16943 31.0621C7.00156 31.6667 8.4406 31.6667 11.3185 31.6667H26.6815C29.5594 31.6667 30.9982 31.6667 31.8303 31.0621C32.5564 30.5346 33.0251 29.7237 33.1189 28.8312C33.2264 27.8079 32.5069 26.5604 31.0669 24.0664L23.3882 10.7664C21.9483 8.27233 21.228 7.02552 20.288 6.60702C19.4681 6.24199 18.5313 6.24199 17.7115 6.60702C16.7719 7.02535 16.0521 8.27216 14.6133 10.7641L6.93327 24.0664ZM19.0804 25.3333V25.4917L18.9211 25.492V25.3333H19.0804Z" stroke="#FFCC00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>Подтверждение удаления</h3>
            <button class="close-modal close-delete-modal" aria-label="Закрыть">
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="31" height="31" fill="transparent"/>
                    <path d="M27.1249 27.1249L15.5 15.5M15.5 15.5L3.875 3.875M15.5 15.5L27.1251 3.875M15.5 15.5L3.875 27.1251" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="confirm-modal-body">
            <p>Вы уверены, что хотите удалить этот пароль?</p>
        </div>
        <div class="confirm-modal-footer">
            <button id="cancelDeleteBtn" class="confirm-cancel-btn">Отмена</button>
            <button id="confirmDeleteBtn" class="confirm-delete-btn">Удалить</button>
        </div>
    </div>
</div>

<!-- Модалка для подтверждения удаления пресета -->
<div id="deletePresetConfirmModal" class="delete-confirm-modal" style="display: none;">
    <div class="delete-confirm-modal-content">
        <div class="delete-confirm-modal-header">
            <div class="confirm-modal-warning-icon">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="38" fill="transparent"/>
                    <path d="M19 14.25V20.5833M6.93327 24.0664C5.49333 26.5604 4.77357 27.8079 4.88112 28.8312C4.97493 29.7237 5.44337 30.5346 6.16943 31.0621C7.00156 31.6667 8.4406 31.6667 11.3185 31.6667H26.6815C29.5594 31.6667 30.9982 31.6667 31.8303 31.0621C32.5564 30.5346 33.0251 29.7237 33.1189 28.8312C33.2264 27.8079 32.5069 26.5604 31.0669 24.0664L23.3882 10.7664C21.9483 8.27233 21.228 7.02552 20.288 6.60702C19.4681 6.24199 18.5313 6.24199 17.7115 6.60702C16.7719 7.02535 16.0521 8.27216 14.6133 10.7641L6.93327 24.0664ZM19.0804 25.3333V25.4917L18.9211 25.492V25.3333H19.0804Z" stroke="#FFCC00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h3>Подтверждение удаления</h3>
            <button id="closeDeletePresetModal" class="close-modal close-delete-modal">
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="31" height="31" fill="transparent"/>
                    <path d="M27.1249 27.1249L15.5 15.5M15.5 15.5L3.875 3.875M15.5 15.5L27.1251 3.875M15.5 15.5L3.875 27.1251" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="delete-confirm-modal-body">
            <p>Вы уверены, что хотите удалить этот пресет?</p>
        </div>
        <div class="delete-confirm-modal-footer">
            <button id="cancelDeletePresetBtn" class="delete-cancel-btn">Отмена</button>
            <button id="confirmDeletePresetBtn" class="delete-confirm-btn">Удалить</button>
        </div>
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

<!-- Модалка для сохранения настроек -->
<div id="presetNameModal" class="preset-modal" style="display: none;">
    <div class="preset-modal-content">
        <div class="preset-modal-header">
            <h3>Сохранить настройки</h3>
            <button id="closePresetModal" class="close-modal">
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="31" height="31" fill="transparent"/>
                    <path d="M27.1249 27.1249L15.5 15.5M15.5 15.5L3.875 3.875M15.5 15.5L27.1251 3.875M15.5 15.5L3.875 27.1251" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
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
`;document.getElementById(`app`).innerHTML=D,document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,O):O();async function O(){let D={theme:f(`themeToggle`),copy:f(`copyBtn`),passwordBlock:f(`passwordBlock`),password:f(`password`),length:f(`length`),customSlider:f(`customSlider`),sliderThumb:f(`sliderThumb`),sliderFill:f(`sliderFill`),sliderValue:f(`sliderValue`),strengthText:f(`strengthText`),strengthPercent:f(`strengthPercent`),generate:f(`generateBtn`),loading:f(`loading`),error:f(`error`),randomSec:f(`randomSettings`),pinSec:f(`pinSettings`),wordsSec:f(`wordsSettings`),wordCount:f(`wordCount`),wordCase:f(`wordCase`),separator:f(`separator`),selectAllBtn:f(`selectAllBtn`),modeSelectBtn:f(`modeSelectBtn`),modeDropdown:f(`modeDropdown`),dropdownItems:document.querySelectorAll(`.dropdown-item`),pinLength:f(`pinLength`),pinSlider:f(`pinSlider`),pinSliderThumb:f(`pinSliderThumb`),pinSliderFill:f(`pinSliderFill`),pinSliderValue:f(`pinSliderValue`),wordsSlider:f(`wordsSlider`),wordsSliderThumb:f(`wordsSliderThumb`),wordsSliderFill:f(`wordsSliderFill`),wordsSliderValue:f(`wordsSliderValue`),profileBtn:f(`profileBtn`),profileEmail:f(`profileEmail`),authModal:f(`authModal`),closeAuthModal:f(`closeAuthModal`),loginTab:f(`loginTab`),registerTab:f(`registerTab`),loginForm:f(`loginForm`),registerForm:f(`registerForm`),loginError:f(`loginError`),registerError:f(`registerError`),logoutInfo:f(`logoutInfo`),loggedUserEmail:f(`loggedUserEmail`),logoutBtn:f(`logoutBtn`),saveCurrentPresetBtn:f(`saveCurrentPresetBtn`),presetsList:f(`presetsList`),presetNameModal:f(`presetNameModal`),presetNameInput:f(`presetNameInput`),closePresetModal:f(`closePresetModal`),cancelPresetBtn:f(`cancelPresetBtn`),confirmPresetBtn:f(`confirmPresetBtn`),savePasswordBtn:f(`savePasswordBtn`),viewSavedPasswordsBtn:f(`viewSavedPasswordsBtn`),savePasswordModal:f(`savePasswordModal`),closeSavePasswordModal:f(`closeSavePasswordModal`),cancelSavePasswordBtn:f(`cancelSavePasswordBtn`),confirmSavePasswordBtn:f(`confirmSavePasswordBtn`),savePasswordValue:f(`savePasswordValue`),savePasswordDescription:f(`savePasswordDescription`),savedPasswordsModal:f(`savedPasswordsModal`),closeSavedPasswordsModal:f(`closeSavedPasswordsModal`),savedPasswordsList:f(`savedPasswordsList`),deletePasswordConfirmModal:f(`deletePasswordConfirmModal`),cancelDeleteBtn:f(`cancelDeleteBtn`),confirmDeleteBtn:f(`confirmDeleteBtn`),deletePresetConfirmModal:f(`deletePresetConfirmModal`),closeDeletePresetModal:f(`closeDeletePresetModal`),cancelDeletePresetBtn:f(`cancelDeletePresetBtn`),confirmDeletePresetBtn:f(`confirmDeletePresetBtn`)},O=null,k=null;async function A(){if(w)return new Promise((e,t)=>{T.push({resolve:e,reject:t})});w=!0;try{console.log(`🔄 Обновляем access token через refresh token...`);let e=await fetch(a,{method:`POST`,credentials:`include`,headers:{"Content-Type":`application/json`,"X-CSRF-Token":ae()}});if(e.ok){let t=(await e.json())?.token;if(t)return v=t,console.log(`✅ Access token обновлён`),T.forEach(({resolve:e})=>e(!0)),T=[],!0}else e.status===401&&console.log(`❌ Refresh token истёк, требуется повторный вход`);return T.forEach(({reject:e})=>e(Error(`Сессия истекла`))),T=[],!1}catch(e){return console.error(`❌ Ошибка при обновлении токена:`,e),T.forEach(({reject:t})=>t(e)),T=[],!1}finally{w=!1}}async function j(e,t,n,r=null,i=!0){if(ie(e)!==e)throw Error(`Некорректный URL`);let a={"Content-Type":`application/json`,"X-CSRF-Token":ae()},o=!e.includes(`/Auth/`);if(o){let e=r||v;if(!e)throw V(),Error(`Необходима авторизация`);a.Authorization=`Bearer ${e}`}let s=`${t}:${e}`;if(!m.limit(s,500))throw h({type:`rate_limit`,key:s}),Error(`Слишком много запросов`);let c=new AbortController,l=setTimeout(()=>c.abort(),15e3);try{let r=n;if(n&&typeof n==`object`){r={};let e=new Set([`settingsJson`]);for(let[t,i]of Object.entries(n))if(typeof i==`string`){if(e.has(t)){r[t]=i;continue}if(g(i))throw h({type:`dangerous_pattern`,key:t,value:i}),Error(`Обнаружены подозрительные символы`);r[t]=ee(i)}else r[t]=i}let s=await fetch(e,{method:t,headers:a,credentials:`include`,body:r?JSON.stringify(r):void 0,signal:c.signal});if(clearTimeout(l),s.status===401&&o&&i)if(console.log(`🔄 Получен 401, пробуем обновить токен...`),await A()&&v)a.Authorization=`Bearer ${v}`,s=await fetch(e,{method:t,headers:a,credentials:`include`,body:r?JSON.stringify(r):void 0,signal:c.signal});else throw z(),V(),Error(`Сессия истекла, войдите заново`);let u=null,d=s.headers.get(`content-type`);if(d&&d.includes(`application/json`)&&(u=await s.json()),!s.ok){let e=u?.message||u?.error||u?.msg||`Ошибка ${s.status}`;throw Error(e)}return u}catch(e){throw clearTimeout(l),e.name===`AbortError`?Error(`Таймаут запроса`):e}}async function se(e,t){return await j(r,`POST`,{email:e,password:t},null,!1)}async function M(e,t){return await j(i,`POST`,{email:e,password:t},null,!1)}async function N(e){try{return(await j(`${s}/${e}`,`GET`,null,v))?.settings||[]}catch(t){return console.error(`Ошибка загрузки ${e}:`,t),[]}}async function P(){if(!_||!v){b=[],x=[],S=[],I();return}let[e,t,n]=await Promise.all([N(`Random`),N(`Pin`),N(`Words`)]);b=e,x=t,S=n,I()}async function ce(e,t){if(!v)return!1;try{let n=te(e);return await j(o,`POST`,{generatorType:oe(),name:n,settingsJson:JSON.stringify(t)},v),!0}catch(e){return console.error(`Ошибка сохранения:`,e),!1}}async function le(e){if(!v)return!1;try{return await j(c,`DELETE`,{Id:e},v),!0}catch(e){return console.error(`Ошибка удаления:`,e),!1}}async function ue(e,t){try{return await j(l,`POST`,{Id:0,Password:e,Description:te(t)},v),!0}catch(e){return console.error(`Ошибка сохранения пароля:`,e),R(`❌ `+e.message),!1}}async function de(){try{return(await j(u,`GET`,null,v))?.saves||[]}catch(e){return console.error(`Ошибка загрузки сохранённых паролей:`,e),[]}}async function fe(e){if(!v)return!1;try{return await j(d,`DELETE`,{Id:e},v),!0}catch(e){return console.error(`Ошибка удаления пароля:`,e),!1}}async function F(){C=await de(),pe()}function pe(){if(D.savedPasswordsList){if(C.length===0){D.savedPasswordsList.innerHTML=`<div class="saved-passwords-empty">Нет сохранённых паролей</div>`;return}D.savedPasswordsList.innerHTML=C.map(e=>`
            <div class="saved-password-item" data-id="${e.id}">
                <div class="saved-password-info">
                    ${e.description?`<div class="saved-password-description">${p(e.description)}</div>`:``}
                    <div class="saved-password-value">${p(e.password)}</div>
                </div>
                <div class="saved-password-actions">
                    <button class="saved-password-copy" data-password="${p(e.password)}" title="Копировать"></button>
                    <button class="saved-password-delete" data-id="${e.id}" title="Удалить">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 7.61828V14.2366M7 7.61828V14.2366M3 3.83641V14.9929C3 16.052 3 16.5811 3.21799 16.9856C3.40973 17.3414 3.71547 17.6312 4.0918 17.8125C4.5192 18.0184 5.07899 18.0184 6.19691 18.0184H11.8031C12.921 18.0184 13.48 18.0184 13.9074 17.8125C14.2837 17.6312 14.5905 17.3414 14.7822 16.9856C15 16.5815 15 16.0528 15 14.9959V3.83641M3 3.83641H5M3 3.83641H1M5 3.83641H13M5 3.83641C5 2.95534 5 2.51502 5.15224 2.16752C5.35523 1.70419 5.74432 1.33586 6.23438 1.14394C6.60192 1 7.06812 1 8 1H10C10.9319 1 11.3978 1 11.7654 1.14394C12.2554 1.33586 12.6447 1.70419 12.8477 2.16752C12.9999 2.51502 13 2.95534 13 3.83641M13 3.83641H15M15 3.83641H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join(``),document.querySelectorAll(`.saved-password-copy`).forEach(e=>{e.addEventListener(`click`,async t=>{t.stopPropagation();let n=e.dataset.password;await me(n),e.classList.add(`copied`),setTimeout(()=>{e.classList.remove(`copied`)},500),R(`✓ Пароль скопирован`)})}),document.querySelectorAll(`.saved-password-delete`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),O=parseInt(e.dataset.id),D.deletePasswordConfirmModal.style.display=`flex`})})}}async function me(e){if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(e);else{let t=document.createElement(`textarea`);t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select(),document.execCommand(`copy`),document.body.removeChild(t)}}function I(){if(!D.presetsList)return;if(!_||!v){D.presetsList.innerHTML=`<div class="preset-empty">Авторизуйтесь, чтобы<br>сохранять настройки</div>`;return}let e=E();if(e.length===0){D.presetsList.innerHTML=`<div class="preset-empty">Нет сохранённых настроек<br>Нажмите + чтобы добавить</div>`;return}D.presetsList.innerHTML=e.map(e=>`
            <div class="preset-item" data-id="${e.id}">
                <div class="preset-info">
                    <div class="preset-name">${p(e.name)}</div>
                    <div class="preset-mode">${y===`random`?`Случайный`:y===`pin`?`PIN`:`Слова`}</div>
                </div>
                <div class="preset-actions">
                    <button class="preset-apply" data-id="${e.id}" title="Применить"></button>
                    <button class="preset-delete" data-id="${e.id}" title="Удалить">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 7.61828V14.2366M7 7.61828V14.2366M3 3.83641V14.9929C3 16.052 3 16.5811 3.21799 16.9856C3.40973 17.3414 3.71547 17.6312 4.0918 17.8125C4.5192 18.0184 5.07899 18.0184 6.19691 18.0184H11.8031C12.921 18.0184 13.48 18.0184 13.9074 17.8125C14.2837 17.6312 14.5905 17.3414 14.7822 16.9856C15 16.5815 15 16.0528 15 14.9959V3.83641M3 3.83641H5M3 3.83641H1M5 3.83641H13M5 3.83641C5 2.95534 5 2.51502 5.15224 2.16752C5.35523 1.70419 5.74432 1.33586 6.23438 1.14394C6.60192 1 7.06812 1 8 1H10C10.9319 1 11.3978 1 11.7654 1.14394C12.2554 1.33586 12.6447 1.70419 12.8477 2.16752C12.9999 2.51502 13 2.95534 13 3.83641M13 3.83641H15M15 3.83641H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join(``),document.querySelectorAll(`.preset-apply`).forEach(e=>{e.addEventListener(`click`,async t=>{t.stopPropagation(),await ge(parseInt(e.dataset.id)),e.classList.add(`applied`),setTimeout(()=>{e.classList.remove(`applied`)},300)})}),document.querySelectorAll(`.preset-delete`).forEach(e=>{e.addEventListener(`click`,async t=>{t.stopPropagation(),k=parseInt(e.dataset.id),D.deletePresetConfirmModal.style.display=`flex`})})}function he(){return y===`random`?{length:parseInt(D.length?.value)||12,includeLowercase:f(`includeLowercase`)?.checked||!1,includeUppercase:f(`includeUppercase`)?.checked||!1,includeDigits:f(`includeDigits`)?.checked||!1,includeSpecial:f(`includeSpecial`)?.checked||!1,excludeSimilar:f(`excludeSimilar`)?.checked||!1,noRepeats:f(`noRepeats`)?.checked||!1,digitsCount:q.digitsCount||0,specialCount:q.specialCount||0}:y===`pin`?{length:parseInt(D.pinLength?.value)||4,noRepeats:f(`pinNoRepeats`)?.checked||!1}:y===`words`?{wordCount:parseInt(D.wordCount?.value)||3,wordCase:parseInt(D.wordCase?.value)||1,separator:D.separator?.value||`-`}:{}}async function ge(e){let t=E().find(t=>t.id===e);if(!t)return;let n;try{n=typeof t.settingsJson==`string`?JSON.parse(t.settingsJson):t.settingsJson}catch{R(`❌ Ошибка загрузки настроек`);return}if(y===`random`){if(n.length&&X(n.length),n.includeLowercase!==void 0){let e=f(`includeLowercase`);e&&(e.checked=n.includeLowercase)}if(n.includeUppercase!==void 0){let e=f(`includeUppercase`);e&&(e.checked=n.includeUppercase)}if(n.includeDigits!==void 0){let e=f(`includeDigits`);e&&(e.checked=n.includeDigits)}if(n.includeSpecial!==void 0){let e=f(`includeSpecial`);e&&(e.checked=n.includeSpecial)}if(n.excludeSimilar!==void 0){let e=f(`excludeSimilar`);e&&(e.checked=n.excludeSimilar)}if(n.noRepeats!==void 0){let e=f(`noRepeats`);e&&(e.checked=n.noRepeats)}n.digitsCount!==void 0&&(q.digitsCount=n.digitsCount),n.specialCount!==void 0&&(q.specialCount=n.specialCount),Y()}else if(y===`pin`){if(n.length&&Z(n.length),n.noRepeats!==void 0){let e=f(`pinNoRepeats`);e&&(e.checked=n.noRepeats)}}else y===`words`&&(n.wordCount&&Q(n.wordCount),n.wordCase!==void 0&&D.wordCase&&(D.wordCase.value=n.wordCase),n.separator!==void 0&&D.separator&&(D.separator.value=n.separator));R(`✅ Применён: ${t.name}`)}async function L(e){await ce(e,he())?(await P(),R(`💾 Пресет "${e}" сохранён`)):R(`❌ Ошибка при сохранении`)}function R(e){let t=document.createElement(`div`);t.textContent=e,t.style.cssText=`
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
        `,document.body.appendChild(t),setTimeout(()=>t.remove(),2e3)}function _e(e,t){console.log(`💾 Сохраняем сессию`),_=e,v=t,localStorage.setItem(`currentUser`,JSON.stringify(e)),localStorage.setItem(`accessToken`,t),B(),P(),F()}function z(){console.log(`🧹 Очищаем сессию`),_=null,v=null,b=[],x=[],S=[],C=[],localStorage.removeItem(`currentUser`),localStorage.removeItem(`accessToken`),B(),I()}function B(){_&&D.profileEmail?D.profileEmail.textContent=_.email.split(`@`)[0]:D.profileEmail&&(D.profileEmail.textContent=`Войти`)}function V(){D.authModal.style.display=`flex`,document.body.style.overflow=`hidden`,_?(D.loginForm.style.display=`none`,D.registerForm.style.display=`none`,D.logoutInfo.style.display=`block`,D.loggedUserEmail&&(D.loggedUserEmail.textContent=_.email)):(D.loginForm.style.display=`block`,D.registerForm.style.display=`none`,D.logoutInfo.style.display=`none`,D.loginTab.classList.add(`active`),D.registerTab.classList.remove(`active`))}function H(){D.authModal.style.display=`none`,document.body.style.overflow=``,D.loginError&&(D.loginError.textContent=``),D.registerError&&(D.registerError.textContent=``)}function ve(){if(!_){R(`⚠️ Войдите в аккаунт`),V();return}D.presetNameModal.style.display=`flex`,D.presetNameInput&&(D.presetNameInput.value=``,D.presetNameInput.focus())}function U(){D.presetNameModal.style.display=`none`}function ye(){if(!_){R(`⚠️ Войдите в аккаунт`),V();return}let e=D.password.textContent;if(!e||e===`Нажмите "генерировать"`){R(`⚠️ Сначала сгенерируйте пароль`);return}D.savePasswordValue.value=e,D.savePasswordDescription.value=``,D.savePasswordModal.style.display=`flex`}function W(){D.savePasswordModal.style.display=`none`}async function be(){let e=D.savePasswordValue.value;await ue(e,D.savePasswordDescription.value.trim()||``)?(W(),await F(),R(`💾 Пароль сохранён`)):R(`❌ Ошибка при сохранении`)}async function xe(){if(!_){R(`⚠️ Войдите в аккаунт`),V();return}await F(),D.savedPasswordsModal.style.display=`flex`}function Se(){D.savedPasswordsModal.style.display=`none`}function G(){D.deletePasswordConfirmModal.style.display=`none`,O=null}async function Ce(){O&&(await fe(O)?(await F(),R(`🗑️ Пароль удалён`)):R(`❌ Ошибка при удалении`)),G()}D.closeDeletePresetModal&&(D.closeDeletePresetModal.onclick=()=>{D.deletePresetConfirmModal.style.display=`none`,k=null}),D.cancelDeletePresetBtn&&(D.cancelDeletePresetBtn.onclick=()=>{D.deletePresetConfirmModal.style.display=`none`,k=null}),D.confirmDeletePresetBtn&&(D.confirmDeletePresetBtn.onclick=async()=>{if(k)if(await le(k)){let e=E().filter(e=>e.id!==k);switch(y){case`random`:b=e;break;case`pin`:x=e;break;case`words`:S=e;break}I(),R(`🗑️ Пресет удалён`)}else R(`❌ Ошибка при удалении`);D.deletePresetConfirmModal.style.display=`none`,k=null}),D.deletePresetConfirmModal&&(D.deletePresetConfirmModal.onclick=e=>{e.target===D.deletePresetConfirmModal&&(D.deletePresetConfirmModal.style.display=`none`,k=null)}),localStorage.getItem(`theme`)===`dark`&&document.documentElement.setAttribute(`data-theme`,`dark`),D.theme&&(D.theme.onclick=()=>{let e=document.documentElement,t=e.getAttribute(`data-theme`)===`dark`?`light`:`dark`;e.setAttribute(`data-theme`,t),localStorage.setItem(`theme`,t)}),D.profileBtn&&(D.profileBtn.onclick=()=>V()),D.closeAuthModal&&(D.closeAuthModal.onclick=()=>H()),D.authModal&&(D.authModal.onclick=e=>{e.target===D.authModal&&H()}),D.loginTab&&(D.loginTab.onclick=()=>{D.loginTab.classList.add(`active`),D.registerTab.classList.remove(`active`),D.loginForm.style.display=`block`,D.registerForm.style.display=`none`}),D.registerTab&&(D.registerTab.onclick=()=>{D.registerTab.classList.add(`active`),D.loginTab.classList.remove(`active`),D.registerForm.style.display=`block`,D.loginForm.style.display=`none`}),D.registerForm&&(D.registerForm.onsubmit=async e=>{e.preventDefault();let t=f(`registerEmail`)?.value.trim(),n=f(`registerPassword`)?.value,r=f(`registerConfirmPassword`)?.value;if(!ne(t)){D.registerError&&(D.registerError.textContent=`Введите корректный email`);return}if(!re(n)){D.registerError&&(D.registerError.textContent=`Пароль должен быть не менее 6 символов`);return}if(n!==r){D.registerError&&(D.registerError.textContent=`Пароли не совпадают`);return}if(g(t)||g(n)){h({type:`dangerous_input`,email:t}),D.registerError&&(D.registerError.textContent=`Обнаружены недопустимые символы`);return}if(!m.limit(`register`,2e3)){D.registerError&&(D.registerError.textContent=`Подождите перед повторной попыткой`);return}try{D.registerError&&(D.registerError.textContent=``),await se(t,n);let e=(await M(t,n))?.token;if(e)_e({email:t},e),H();else throw Error(`Ошибка авторизации`)}catch(e){D.registerError&&(D.registerError.textContent=e.message)}}),D.loginForm&&(D.loginForm.onsubmit=async e=>{e.preventDefault();let t=f(`loginEmail`)?.value.trim(),n=f(`loginPassword`)?.value;if(!ne(t)){D.loginError&&(D.loginError.textContent=`Введите корректный email`);return}if(!re(n)){D.loginError&&(D.loginError.textContent=`Пароль должен быть не менее 6 символов`);return}if(!m.limit(`login`,1e3)){D.loginError&&(D.loginError.textContent=`Подождите перед повторной попыткой`);return}try{D.loginError&&(D.loginError.textContent=``);let e=(await M(t,n))?.token;if(e)_e({email:t},e),H();else throw Error(`Неверные учетные данные`)}catch(e){D.loginError&&(D.loginError.textContent=e.message)}}),D.logoutBtn&&(D.logoutBtn.onclick=()=>{z(),H()}),D.savePasswordBtn&&(D.savePasswordBtn.onclick=()=>ye()),D.viewSavedPasswordsBtn&&(D.viewSavedPasswordsBtn.onclick=()=>xe()),D.closeSavePasswordModal&&(D.closeSavePasswordModal.onclick=()=>W()),D.cancelSavePasswordBtn&&(D.cancelSavePasswordBtn.onclick=()=>W()),D.confirmSavePasswordBtn&&(D.confirmSavePasswordBtn.onclick=()=>be()),D.closeSavedPasswordsModal&&(D.closeSavedPasswordsModal.onclick=()=>Se()),D.savedPasswordsModal&&(D.savedPasswordsModal.onclick=e=>{e.target===D.savedPasswordsModal&&Se()}),D.cancelDeleteBtn&&(D.cancelDeleteBtn.onclick=()=>G()),D.confirmDeleteBtn&&(D.confirmDeleteBtn.onclick=()=>Ce()),D.deletePasswordConfirmModal&&(D.deletePasswordConfirmModal.onclick=e=>{e.target===D.deletePasswordConfirmModal&&G()});let K=!1;D.modeSelectBtn&&(D.modeSelectBtn.onclick=e=>{e.stopPropagation(),K=!K,D.modeDropdown.classList.toggle(`show`,K),D.modeSelectBtn.classList.toggle(`active`,K)}),D.dropdownItems.forEach(e=>{e.onclick=()=>{y=e.dataset.mode,K=!1,D.modeDropdown.classList.remove(`show`),D.modeSelectBtn.classList.remove(`active`),D.dropdownItems.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),D.randomSec.style.display=y===`random`?`block`:`none`,D.pinSec.style.display=y===`pin`?`block`:`none`,D.wordsSec.style.display=y===`words`?`block`:`none`,I(),D.error&&(D.error.style.display=`none`)}}),document.addEventListener(`click`,()=>{K&&(K=!1,D.modeDropdown.classList.remove(`show`),D.modeSelectBtn.classList.remove(`active`))}),D.modeDropdown&&(D.modeDropdown.onclick=e=>e.stopPropagation());let we=[`includeLowercase`,`includeUppercase`,`includeDigits`,`includeSpecial`,`excludeSimilar`,`noRepeats`],q={digitsCount:1,specialCount:1};function Te(){return parseInt(D.length?.value)||12}function J(){let e=Te(),t=0;return f(`includeLowercase`)?.checked&&t++,f(`includeUppercase`)?.checked&&t++,Math.max(0,e-t)}function Y(){let e=document.getElementById(`digitsCountValue`),t=document.getElementById(`specialCountValue`),n=J();e&&(e.textContent=q.digitsCount),t&&(t.textContent=q.specialCount);let r=document.querySelector(`[data-target="digitsCount"].minus`),i=document.querySelector(`[data-target="digitsCount"].plus`),a=document.querySelector(`[data-target="specialCount"].minus`),o=document.querySelector(`[data-target="specialCount"].plus`);r&&(r.disabled=q.digitsCount<=0),a&&(a.disabled=q.specialCount<=0),i&&(i.disabled=q.digitsCount+1+q.specialCount>n||!f(`includeDigits`)?.checked),o&&(o.disabled=q.digitsCount+q.specialCount+1>n||!f(`includeSpecial`)?.checked)}function Ee(){document.querySelectorAll(`.counter-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.dataset.target,n=e.target.classList.contains(`plus`),r=J(),i=q[t];if(n){let e=t===`digitsCount`?q.specialCount:q.digitsCount;i+1+e<=r&&i++}else i>0&&i--;if(q[t]=i,i===0){if(t===`digitsCount`){let e=f(`includeDigits`);e&&(e.checked=!1)}else if(t===`specialCount`){let e=f(`includeSpecial`);e&&(e.checked=!1)}}Y()})}),we.forEach(e=>{let t=f(e);t&&t.addEventListener(`change`,()=>{let n=J();if(e===`includeSpecial`&&(t.checked?q.specialCount===0&&(q.digitsCount+1<=n?q.specialCount=1:q.digitsCount>0&&(q.digitsCount--,q.specialCount=1)):q.specialCount=0),e===`includeDigits`&&(t.checked?q.digitsCount===0&&(q.specialCount+1<=n?q.digitsCount=1:q.specialCount>0&&(q.specialCount--,q.digitsCount=1)):q.digitsCount=0),e===`includeLowercase`||e===`includeUppercase`){let e=q.digitsCount+q.specialCount;if(e>n){let t=e-n;q.digitsCount>=q.specialCount?q.digitsCount=Math.max(0,q.digitsCount-t):q.specialCount=Math.max(0,q.specialCount-t)}}Y()})}),Y()}let X=()=>{},Z=()=>{},Q=()=>{};if(D.customSlider){let e=!1;X=e=>{e=Math.max(4,Math.min(64,Math.round(e))),D.length.value=e;let t=(e-4)/60*100;D.sliderThumb.style.left=t+`%`,D.sliderFill.style.width=t+`%`,D.sliderValue.style.left=t+`%`,D.sliderValue.textContent=e,D.sliderValue.style.opacity=e===4||e===64?`0`:`1`,Y()};let t=e=>{let t=D.customSlider.getBoundingClientRect();return 4+(e-t.left)/t.width*60},n=n=>{e=!0;let r=n.touches?n.touches[0].clientX:n.clientX;X(t(r)),D.sliderThumb.classList.add(`dragging`)},r=n=>{if(!e)return;n.preventDefault();let r=n.touches?n.touches[0].clientX:n.clientX;X(t(r))},i=()=>{e=!1,D.sliderThumb.classList.remove(`dragging`)};D.customSlider.addEventListener(`mousedown`,n),document.addEventListener(`mousemove`,r),document.addEventListener(`mouseup`,i),D.customSlider.addEventListener(`touchstart`,n),document.addEventListener(`touchmove`,r),document.addEventListener(`touchend`,i),X(12)}if(D.pinSlider){let e=!1;Z=e=>{e=Math.max(4,Math.min(8,Math.round(e))),D.pinLength.value=e;let t=(e-4)/4*100;D.pinSliderThumb.style.left=t+`%`,D.pinSliderFill.style.width=t+`%`,D.pinSliderValue.style.left=t+`%`,D.pinSliderValue.textContent=e,D.pinSliderValue.style.opacity=e===4||e===8?`0`:`1`};let t=e=>{let t=D.pinSlider.getBoundingClientRect();return 4+(e-t.left)/t.width*4},n=n=>{e=!0;let r=n.touches?n.touches[0].clientX:n.clientX;Z(t(r)),D.pinSliderThumb.classList.add(`dragging`)},r=n=>{if(!e)return;n.preventDefault();let r=n.touches?n.touches[0].clientX:n.clientX;Z(t(r))},i=()=>{e=!1,D.pinSliderThumb.classList.remove(`dragging`)};D.pinSlider.addEventListener(`mousedown`,n),document.addEventListener(`mousemove`,r),document.addEventListener(`mouseup`,i),D.pinSlider.addEventListener(`touchstart`,n),document.addEventListener(`touchmove`,r),document.addEventListener(`touchend`,i),Z(4)}if(D.wordsSlider){let e=!1;Q=e=>{e=Math.max(2,Math.min(8,Math.round(e))),D.wordCount.value=e;let t=(e-2)/6*100;D.wordsSliderThumb.style.left=t+`%`,D.wordsSliderFill.style.width=t+`%`,D.wordsSliderValue.style.left=t+`%`,D.wordsSliderValue.textContent=e,D.wordsSliderValue.style.opacity=e===2||e===8?`0`:`1`};let t=e=>{let t=D.wordsSlider.getBoundingClientRect();return 2+(e-t.left)/t.width*6},n=n=>{e=!0;let r=n.touches?n.touches[0].clientX:n.clientX;Q(t(r)),D.wordsSliderThumb.classList.add(`dragging`)},r=n=>{if(!e)return;n.preventDefault();let r=n.touches?n.touches[0].clientX:n.clientX;Q(t(r))},i=()=>{e=!1,D.wordsSliderThumb.classList.remove(`dragging`)};D.wordsSlider.addEventListener(`mousedown`,n),document.addEventListener(`mousemove`,r),document.addEventListener(`mouseup`,i),D.wordsSlider.addEventListener(`touchstart`,n),document.addEventListener(`touchmove`,r),document.addEventListener(`touchend`,i),Q(3)}async function De(){let e=D.password.textContent;!e||e===`Нажмите "генерировать"`||(await me(e),R(`📋 Пароль скопирован`))}D.copy&&(D.copy.onclick=e=>{e.stopPropagation(),De()}),D.passwordBlock&&(D.passwordBlock.onclick=De,D.passwordBlock.style.cursor=`pointer`);function Oe(){return{length:+D.length.value||12,includeLowercase:f(`includeLowercase`)?.checked||!1,includeUppercase:f(`includeUppercase`)?.checked||!1,includeDigits:f(`includeDigits`)?.checked||!1,includeSpecial:f(`includeSpecial`)?.checked||!1,excludeSimilar:f(`excludeSimilar`)?.checked||!1,noRepeats:f(`noRepeats`)?.checked||!1,digitsCount:q.digitsCount||0,specialCount:q.specialCount||0,minDigits:q.digitsCount||0,minSpecial:q.specialCount||0}}function ke(){return{length:+D.pinLength.value||4,includeLowercase:!1,includeUppercase:!1,includeDigits:!0,includeSpecial:!1,excludeSimilar:!1,noRepeats:f(`pinNoRepeats`)?.checked||!1,digitsCount:+D.pinLength.value||4,specialCount:0,minDigits:+D.pinLength.value||4,minSpecial:0}}function Ae(){return{WordCount:+D.wordCount.value||3,wordCase:+D.wordCase.value,separator:D.separator.value}}function je(e){let t=document.querySelector(`.strength-container`);if(!t||!D.strengthText||!D.strengthPercent)return;t.classList.remove(`weak`,`medium`,`strong`,`very-strong`);let n=``,r=`-`,i=0;e!==void 0&&(i=Math.min(100,Math.round(e/80*100))),e<28?(n=`weak`,r=`Слабый`):e<36?(n=`medium`,r=`Средний`):e<60?(n=`strong`,r=`Надежный`):(n=`very-strong`,r=`Очень надежный`),t.classList.add(n),D.strengthText.textContent=r,D.strengthPercent.textContent=`Надежность: ${i}%`}function Me(){let e=document.querySelector(`.strength-container`);e&&e.classList.remove(`weak`,`medium`,`strong`,`very-strong`),D.strengthText&&(D.strengthText.textContent=`-`),D.strengthPercent&&(D.strengthPercent.textContent=`Надежность: 0%`)}async function Ne(){Me(),D.error&&(D.error.style.display=`none`),D.loading&&(D.loading.style.display=`block`),D.generate&&(D.generate.disabled=!0);try{let r,i;if(y===`random`){r=e,i=Oe();let{includeLowercase:t,includeUppercase:n,includeDigits:a,includeSpecial:o}=i;if(!t&&!n&&!a&&!o)throw Error(`Выберите хотя бы один тип символов`)}else y===`pin`?(r=n,i=ke()):y===`words`&&(r=t,i=Ae());let a=new AbortController,o=setTimeout(()=>a.abort(),1e4),s=await fetch(r,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(i),signal:a.signal});if(clearTimeout(o),!s.ok){let e=await s.text(),t=e;try{let n=JSON.parse(e);n&&typeof n==`object`&&(t=n.message||n.error||n.msg||e)}catch{}throw Error(t)}let c=await s.json();D.password&&(D.password.textContent=c.password||`Ошибка`),c.entropy!==void 0&&je(c.entropy)}catch(e){console.error(e);let t=`Не удалось сгенерировать пароль`;t=e.name===`AbortError`?`Таймаут сервера`:e.message&&e.message.includes(`fetch`)?`Нет связи с сервером`:e.message||t,D.error&&(D.error.textContent=t,D.error.style.display=`block`),Me()}finally{D.loading&&(D.loading.style.display=`none`),D.generate&&(D.generate.disabled=!1)}}D.generate&&(D.generate.onclick=Ne),D.selectAllBtn&&(D.selectAllBtn.onclick=()=>{we.forEach(e=>{let t=f(e);t&&(t.checked=!0)}),q.digitsCount=1,q.specialCount=1,Y()});let $=f(`scrollToGenBtn`);$&&($.onclick=()=>{let e=f(`generateBtn`);e&&e.scrollIntoView({behavior:`smooth`,block:`center`})}),D.saveCurrentPresetBtn&&(D.saveCurrentPresetBtn.onclick=()=>ve()),D.closePresetModal&&(D.closePresetModal.onclick=()=>U()),D.cancelPresetBtn&&(D.cancelPresetBtn.onclick=()=>U()),D.confirmPresetBtn&&(D.confirmPresetBtn.onclick=()=>{let e=D.presetNameInput?.value.trim();e&&!g(e)?(L(e),U()):alert(`Введите корректное название`)}),D.presetNameModal&&(D.presetNameModal.onclick=e=>{e.target===D.presetNameModal&&U()}),D.presetNameInput&&D.presetNameInput.addEventListener(`keypress`,e=>{if(e.key===`Enter`){let e=D.presetNameInput.value.trim();e&&!g(e)&&(L(e),U())}});async function Pe(){let e=localStorage.getItem(`currentUser`),t=localStorage.getItem(`accessToken`);if(!e)return console.log(`❌ Нет сохранённого пользователя`),I(),!1;try{return _=JSON.parse(e),t&&(v=t),B(),console.log(`👤 Пользователь:`,_.email),v?(console.log(`✅ Сессия восстановлена (по access token)`),A().catch(()=>{}),await P(),await F(),!0):await A()&&v?(console.log(`✅ Сессия восстановлена (через refresh)`),await P(),await F(),!0):(console.log(`❌ Не удалось восстановить сессию`),z(),I(),!1)}catch(e){return console.error(`Ошибка восстановления сессии:`,e),z(),I(),!1}}Ee(),[`includeLowercase`,`includeUppercase`,`includeDigits`,`includeSpecial`].forEach(e=>{let t=f(e);t&&(t.checked=!0)}),Y(),await Pe()}