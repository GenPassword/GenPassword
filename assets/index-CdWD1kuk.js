(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://myproject24.ru/api/password/generate`,t=`https://myproject24.ru/api/password/generate-from-words`,n=`https://myproject24.ru/api/password/generate`,r=e=>document.getElementById(e),i=`
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
`;document.getElementById(`app`).innerHTML=i,document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,a):a();function a(){let i={theme:r(`themeToggle`),copy:r(`copyBtn`),passwordBlock:r(`passwordBlock`),password:r(`password`),length:r(`length`),customSlider:r(`customSlider`),sliderThumb:r(`sliderThumb`),sliderFill:r(`sliderFill`),sliderValue:r(`sliderValue`),strengthText:r(`strengthText`),strengthPercent:r(`strengthPercent`),generate:r(`generateBtn`),loading:r(`loading`),error:r(`error`),randomSec:r(`randomSettings`),pinSec:r(`pinSettings`),wordsSec:r(`wordsSettings`),wordCount:r(`wordCount`),wordCase:r(`wordCase`),separator:r(`separator`),selectAllBtn:r(`selectAllBtn`),modeSelectBtn:r(`modeSelectBtn`),modeDropdown:r(`modeDropdown`),dropdownItems:document.querySelectorAll(`.dropdown-item`),pinLength:r(`pinLength`),pinSlider:r(`pinSlider`),pinSliderThumb:r(`pinSliderThumb`),pinSliderFill:r(`pinSliderFill`),pinSliderValue:r(`pinSliderValue`),wordsSlider:r(`wordsSlider`),wordsSliderThumb:r(`wordsSliderThumb`),wordsSliderFill:r(`wordsSliderFill`),wordsSliderValue:r(`wordsSliderValue`)};if(!i.generate){console.warn(`⚠️ generateBtn not found`);return}let a=`random`;localStorage.getItem(`theme`)===`dark`&&document.documentElement.setAttribute(`data-theme`,`dark`),i.theme&&(i.theme.onclick=()=>{let e=document.documentElement,t=e.getAttribute(`data-theme`)===`dark`?`light`:`dark`;e.setAttribute(`data-theme`,t),localStorage.setItem(`theme`,t)});let o=!1;i.modeSelectBtn&&(i.modeSelectBtn.onclick=e=>{e.stopPropagation(),o=!o,i.modeDropdown.classList.toggle(`show`,o),i.modeSelectBtn.classList.toggle(`active`,o)}),i.dropdownItems.forEach(e=>{e.onclick=()=>{a=e.dataset.mode,o=!1,i.modeDropdown.classList.remove(`show`),i.modeSelectBtn.classList.remove(`active`),i.dropdownItems.forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),i.randomSec.style.display=a===`random`?`block`:`none`,i.pinSec.style.display=a===`pin`?`block`:`none`,i.wordsSec.style.display=a===`words`?`block`:`none`,i.error&&(i.error.style.display=`none`)}}),document.addEventListener(`click`,()=>{o&&(o=!1,i.modeDropdown.classList.remove(`show`),i.modeSelectBtn.classList.remove(`active`))}),i.modeDropdown&&(i.modeDropdown.onclick=e=>e.stopPropagation());let s=[`includeLowercase`,`includeUppercase`,`includeDigits`,`includeSpecial`,`excludeSimilar`,`noRepeats`];i.selectAllBtn&&(i.selectAllBtn.onclick=()=>{s.forEach(e=>{let t=r(e);t&&(t.checked=!0)}),c.digitsCount=1,c.specialCount=1,d()});let c={digitsCount:0,specialCount:0};function l(){return parseInt(i.length?.value)||12}function u(){let e=l(),t=0;return r(`includeLowercase`)?.checked&&t++,r(`includeUppercase`)?.checked&&t++,Math.max(0,e-t)}function d(){let e=document.getElementById(`digitsCountValue`),t=document.getElementById(`specialCountValue`),n=u();e&&(e.textContent=c.digitsCount),t&&(t.textContent=c.specialCount);let i=document.querySelector(`[data-target="digitsCount"].minus`),a=document.querySelector(`[data-target="digitsCount"].plus`),o=document.querySelector(`[data-target="specialCount"].minus`),s=document.querySelector(`[data-target="specialCount"].plus`);i&&(i.disabled=c.digitsCount<=0),o&&(o.disabled=c.specialCount<=0),a&&(a.disabled=c.digitsCount+1+c.specialCount>n||!r(`includeDigits`)?.checked),s&&(s.disabled=c.digitsCount+c.specialCount+1>n||!r(`includeSpecial`)?.checked)}function f(){document.querySelectorAll(`.counter-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.dataset.target,n=e.target.classList.contains(`plus`),i=u(),a=c[t];if(n){let e=t===`digitsCount`?c.specialCount:c.digitsCount;a+1+e<=i&&a++}else a>0&&a--;if(c[t]=a,a===0){if(t===`digitsCount`){let e=r(`includeDigits`);e&&(e.checked=!1)}else if(t===`specialCount`){let e=r(`includeSpecial`);e&&(e.checked=!1)}}d()})}),s.forEach(e=>{let t=r(e);t&&t.addEventListener(`change`,()=>{let n=u();if(e===`includeSpecial`&&(t.checked?c.specialCount===0&&(c.digitsCount+1<=n?c.specialCount=1:c.digitsCount>0&&(c.digitsCount--,c.specialCount=1)):c.specialCount=0),e===`includeDigits`&&(t.checked?c.digitsCount===0&&(c.specialCount+1<=n?c.digitsCount=1:c.specialCount>0&&(c.specialCount--,c.digitsCount=1)):c.digitsCount=0),e===`includeLowercase`||e===`includeUppercase`){let e=c.digitsCount+c.specialCount;if(e>n){let t=e-n;c.digitsCount>=c.specialCount?c.digitsCount=Math.max(0,c.digitsCount-t):c.specialCount=Math.max(0,c.specialCount-t)}}d()})}),d()}if(f(),i.customSlider){let e=!1,t=e=>{e=Math.max(4,Math.min(64,Math.round(e))),i.length.value=e;let t=(e-4)/60*100;i.sliderThumb.style.left=t+`%`,i.sliderFill.style.width=t+`%`,i.sliderValue.style.left=t+`%`,i.sliderValue.textContent=e,i.sliderValue.style.opacity=e===4||e===64?`0`:`1`,d()},n=e=>{let t=i.customSlider.getBoundingClientRect();return 4+(e-t.left)/t.width*60},r=r=>{e=!0,t(n(r.touches?r.touches[0].clientX:r.clientX)),i.sliderThumb.classList.add(`dragging`)},a=r=>{e&&(r.preventDefault(),t(n(r.touches?r.touches[0].clientX:r.clientX)))},o=()=>{e=!1,i.sliderThumb.classList.remove(`dragging`)};i.customSlider.addEventListener(`mousedown`,r),document.addEventListener(`mousemove`,a),document.addEventListener(`mouseup`,o),i.customSlider.addEventListener(`touchstart`,r),document.addEventListener(`touchmove`,a),document.addEventListener(`touchend`,o),t(12)}if(i.pinSlider){let e=!1,t=e=>{e=Math.max(4,Math.min(8,Math.round(e))),i.pinLength.value=e;let t=(e-4)/4*100;i.pinSliderThumb.style.left=t+`%`,i.pinSliderFill.style.width=t+`%`,i.pinSliderValue.style.left=t+`%`,i.pinSliderValue.textContent=e,i.pinSliderValue.style.opacity=e===4||e===8?`0`:`1`},n=e=>{let t=i.pinSlider.getBoundingClientRect();return 4+(e-t.left)/t.width*4},r=r=>{e=!0,t(n(r.touches?r.touches[0].clientX:r.clientX)),i.pinSliderThumb.classList.add(`dragging`)},a=r=>{e&&(r.preventDefault(),t(n(r.touches?r.touches[0].clientX:r.clientX)))},o=()=>{e=!1,i.pinSliderThumb.classList.remove(`dragging`)};i.pinSlider.addEventListener(`mousedown`,r),document.addEventListener(`mousemove`,a),document.addEventListener(`mouseup`,o),i.pinSlider.addEventListener(`touchstart`,r),document.addEventListener(`touchmove`,a),document.addEventListener(`touchend`,o),t(4)}if(i.wordsSlider){let e=!1,t=e=>{e=Math.max(2,Math.min(8,Math.round(e))),i.wordCount.value=e;let t=(e-2)/6*100;i.wordsSliderThumb.style.left=t+`%`,i.wordsSliderFill.style.width=t+`%`,i.wordsSliderValue.style.left=t+`%`,i.wordsSliderValue.textContent=e,i.wordsSliderValue.style.opacity=e===2||e===8?`0`:`1`},n=e=>{let t=i.wordsSlider.getBoundingClientRect();return 2+(e-t.left)/t.width*6},r=r=>{e=!0,t(n(r.touches?r.touches[0].clientX:r.clientX)),i.wordsSliderThumb.classList.add(`dragging`)},a=r=>{e&&(r.preventDefault(),t(n(r.touches?r.touches[0].clientX:r.clientX)))},o=()=>{e=!1,i.wordsSliderThumb.classList.remove(`dragging`)};i.wordsSlider.addEventListener(`mousedown`,r),document.addEventListener(`mousemove`,a),document.addEventListener(`mouseup`,o),i.wordsSlider.addEventListener(`touchstart`,r),document.addEventListener(`touchmove`,a),document.addEventListener(`touchend`,o),t(3)}async function p(){let e=i.password.textContent;if(!(!e||e===`Нажмите "генерировать"`))try{await navigator.clipboard.writeText(e),i.copy.textContent=`Скопировано`,i.passwordBlock.classList.add(`copied`),setTimeout(()=>{i.copy.textContent=`Копировать`,i.passwordBlock.classList.remove(`copied`)},1500)}catch(e){console.error(e),i.copy.textContent=`❌ Ошибка`,setTimeout(()=>i.copy.textContent=`Копировать`,1500)}}i.copy&&(i.copy.onclick=e=>{e.stopPropagation(),p()}),i.passwordBlock&&(i.passwordBlock.onclick=p,i.passwordBlock.style.cursor=`pointer`);function m(){return{length:+i.length.value||12,includeLowercase:r(`includeLowercase`)?.checked||!1,includeUppercase:r(`includeUppercase`)?.checked||!1,includeDigits:r(`includeDigits`)?.checked||!1,includeSpecial:r(`includeSpecial`)?.checked||!1,excludeSimilar:r(`excludeSimilar`)?.checked||!1,noRepeats:r(`noRepeats`)?.checked||!1,digitsCount:c.digitsCount||0,specialCount:c.specialCount||0,minDigits:c.digitsCount||0,minSpecial:c.specialCount||0}}function h(){return{length:+i.pinLength.value||4,includeLowercase:!1,includeUppercase:!1,includeDigits:!0,includeSpecial:!1,excludeSimilar:!1,noRepeats:r(`pinNoRepeats`)?.checked||!1,digitsCount:+i.pinLength.value||4,specialCount:0,minDigits:+i.pinLength.value||4,minSpecial:0}}function g(){return{WordCount:+i.wordCount.value||3,wordCase:+i.wordCase.value,separator:i.separator.value}}function _(e){let t=document.querySelector(`.strength-container`);if(!t||!i.strengthText||!i.strengthPercent)return;t.classList.remove(`weak`,`medium`,`strong`,`very-strong`);let n=``,r=`-`,a=0;e!==void 0&&(a=Math.min(100,Math.round(e/80*100))),e<28?(n=`weak`,r=`Слабый`):e<36?(n=`medium`,r=`Средний`):e<60?(n=`strong`,r=`Надежный`):(n=`very-strong`,r=`Очень надежный`),t.classList.add(n),i.strengthText.textContent=r,i.strengthPercent.textContent=`Надежность: ${a}%`}function v(){let e=document.querySelector(`.strength-container`);e&&e.classList.remove(`weak`,`medium`,`strong`,`very-strong`),i.strengthText&&(i.strengthText.textContent=`-`),i.strengthPercent&&(i.strengthPercent.textContent=`Надежность: 0%`)}async function y(){v(),i.error&&(i.error.style.display=`none`),i.loading&&(i.loading.style.display=`block`),i.generate&&(i.generate.disabled=!0);try{let r,o;if(a===`random`){r=e,o=m();let{includeLowercase:t,includeUppercase:n,includeDigits:i,includeSpecial:a}=o;if(!t&&!n&&!i&&!a)throw Error(`Выберите хотя бы один тип символов`)}else a===`pin`?(r=n,o=h()):a===`words`&&(r=t,o=g());let s=new AbortController,c=setTimeout(()=>s.abort(),1e4),l=await fetch(r,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(o),signal:s.signal});if(clearTimeout(c),!l.ok){let e=await l.text(),t=e;try{let n=JSON.parse(e);n&&typeof n==`object`&&(t=n.message||n.error||n.msg||e)}catch{}if(t.startsWith(`Ошибка 400:`)){let e=t.indexOf(`{`);if(e!==-1)try{let n=JSON.parse(t.slice(e));n.message&&(t=n.message)}catch{}}throw Error(t)}let u=await l.json();i.password&&(i.password.textContent=u.password||`Ошибка`),u.entropy!==void 0&&_(u.entropy)}catch(e){console.error(e);let t=`Не удалось сгенерировать пароль`;t=e.name===`AbortError`?`Таймаут сервера`:e.message&&e.message.includes(`fetch`)?`Нет связи с сервером`:e.message||t,i.error&&(i.error.textContent=t,i.error.style.display=`block`),v()}finally{i.loading&&(i.loading.style.display=`none`),i.generate&&(i.generate.disabled=!1)}}i.generate&&(i.generate.onclick=y);let b=r(`scrollToGenBtn`);b&&(b.onclick=()=>{let e=r(`generateBtn`);e&&e.scrollIntoView({behavior:`smooth`,block:`center`})})}