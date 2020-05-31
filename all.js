window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());

gtag('config', 'G-VW75F1ZFE7');

const config = {
  maxCharactersPerTranslation: 1500,
  txtTranslator: {
    defaultSrcLang: { code: 'en' },
    defaultDestLang: { code: 'ml' }
  },
  speechTranslator: {
    defaultSrcLang: { code: 'ml-IN' },
    defaultDestLang: { code: 'en' }
  },
  translatorServiceURL:
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl={sl}&tl={tl}&dt=t&ie=UTF-8&oe=UTF-8&',
  translatorSerivceProvider: 'https://translate.googleapis.com',
  // corsApiHost: 'cors-anywhere.herokuapp.com/',
  corsProxyURL: 'https://corslb-861327797.us-east-1.elb.amazonaws.com/',
  shouldRouteThroughCorsProxy: false
};

function translator(yourText, destination, url, callback, idBtnTranslate) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  const targetOrigin = /^https?:\/\/([^\/]+)/i.exec(url);
  if (targetOrigin[0] !== config.translatorSerivceProvider) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }

  xhr.onreadystatechange = function onreadystatechange() {
    if (xhr.readyState === 4) {
      let result = '';
      try {
        const translation = JSON.parse(xhr.responseText);
        const numOfSentences = translation[0].length;
        for (let iteration = 0; iteration < numOfSentences; iteration++) {
          result += translation[0][iteration][0];
        }
        callback(result, destination, idBtnTranslate);
      } catch (e) {
        console.error(e);
        if (!config.shouldRouteThroughCorsProxy) {
          config.shouldRouteThroughCorsProxy = true;
          translator(yourText, destination, url, callback, idBtnTranslate);
        } else {
          callback('Sorry, there is an error. Please try later', destination, idBtnTranslate);
        }
      }
    }
  };
  xhr.send(null);
}

(function corsProxy() {
  const { open } = XMLHttpRequest.prototype;
  XMLHttpRequest.prototype.open = function customOpen(...args) {
    const targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
    if (
      targetOrigin[0] === config.translatorSerivceProvider &&
      config.shouldRouteThroughCorsProxy
    ) {
      args[1] = config.corsProxyURL + args[1];
    }
    return open.apply(this, args);
  };
})();

function Speech() {
  if ('webkitSpeechRecognition' in window) {
    // console.assert(this.constructor.name, 'Speech', 'Error: this is not Speech');
    console.dir(this);
    this.recognition = new webkitSpeechRecognition();
    console.log('webkitSpeechRecognition is available.');

    // custom settings
    this.recognizing = false;
    this.finalTranscript = '';
    this.interimTranscript = '';
    // speech recognition settings
    this.recognition.continuous = true;
    this.language = config.speechTranslator.defaultSrcLang.code;

    this.startSpeechCapture = () => {
      // console.assert(
      //   this.constructor.name === 'Speech',
      //   'Expected Speech object but "this" failed '
      // );
      console.log('startSpeechCapture');
      if (this.recognizing) {
        this.recognition.stop();
        this.recognizing = false;
      }
      console.log(`initiate language change from - ${this.recognition.lang} to ${this.language}`);
      this.recognition.lang = this.language;
      this.recognition.start();
      this.recognizing = true;
    };

    this.stopSpeechCapture = () => {
      // console.assert(
      //   this.constructor.name === 'Speech',
      //   'Expected Speech object but "this" failed '
      // );
      console.dir(this);
      console.log('stopSpeechCapture');
      this.recognizing = false;
      this.recognition.stop();
    };

    this.recognition.onstart = () => {
      // console.assert(
      //   this.constructor.name === 'Speech',
      //   'Expected Speech object but "this" failed '
      // );
      console.dir(this);
      console.log('Started...');
    };

    this.recognition.onend = event => {
      // console.assert(
      //   this.constructor.name === 'Speech',
      //   'Expected Speech object but "this" failed '
      // );
      console.dir(this);
      // if recognition is ended because of idle time, resume recognition. We want to end recognition only if it is explicitly stopped by user.
      console.log('end...');
      console.log(`this.recognizing - ${this.recognizing}`);
      if (this.recognizing) {
        this.recognition.start();
      }
    };

    this.recognition.onresult = event => {
      // console.assert(
      //   this.constructor.name === 'Speech',
      //   'Expected Speech object but "this" failed '
      // );
      console.log('result');
      if (typeof event.results === undefined) {
        console.log('Undefined results');
        // this.stopSpeechCapture();
        return;
      }

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.finalTranscript = event.results[i][0].transcript;
        }
      }

      this.finalTranscript = (transcript => {
        if (transcript === undefined || transcript === '') {
          return '';
        }
        const firstChar = /\S/;
        return transcript.replace(firstChar, function capitalize(match) {
          return match.toUpperCase();
        });
      })(this.finalTranscript);

      document.dispatchEvent(
        new CustomEvent('speechRecognitionResult', {
          bubbles: true,
          detail: { finalTranscript: this.finalTranscript }
        })
      );
    };

    this.recognition.onerror = event => {
      console.log(event.error);
    };
  } else {
    console.log('webkitSpeechRecognition is not available.');
    document.querySelector('[data-section="translateSpeech"] article').remove();
    document.querySelector('[data-section="translateSpeech"] .micContainer').remove();
    document.querySelector('[data-section="translateSpeech"] .message').textContent =
      'Please use latest Chrome browser to use speech recognition feature';
  }
}

const speechCodeToTranslateCode = {
  am: 'am',
  az: 'az',
  'bg-BG': 'bg',
  bn: 'bn',
  'ca-ES': 'ca',
  cmn: 'cmn',
  'cs-CZ': 'cs',
  'da-DK': 'da',
  'de-DE': 'de',
  'el-GR': 'el',
  en: 'en',
  es: 'es',
  'eu-ES': 'eu',
  'fi-FI': 'fi',
  'fil-PH': 'fil-PH',
  'fr-FR': 'fr',
  'gl-ES': 'gl',
  'gu-IN': 'gu',
  'hi-IN': 'hi',
  'hr-HR': 'hr',
  'hu-HU': 'hu',
  'hy-AM': 'hy',
  'id-ID': 'id',
  'is-IS': 'is',
  it: 'it',
  'ja-JP': 'ja',
  'jv-ID': 'jw',
  'ka-GE': 'ka',
  'km-KH': 'km',
  'kn-IN': 'kn',
  'ko-KR': 'ko',
  'lo-LA': 'lo',
  'lt-LT': 'lt',
  'lv-LV': 'lv',
  'ml-IN': 'ml',
  'mr-IN': 'mr',
  'ms-MY': 'ms',
  'nb-NO': 'nb-NO',
  'ne-NP': 'ne',
  'nl-NL': 'nl',
  'pl-PL': 'pl',
  pt: 'pt',
  'ro-RO': 'ro',
  'ru-RU': 'ru',
  'si-LK': 'si',
  'sk-SK': 'sk',
  'sl-SI': 'sl',
  'sr-RS': 'sr',
  'su-ID': 'su',
  'sv-SE': 'sv',
  sw: 'sw',
  ta: 'ta',
  'te-IN': 'te',
  'th-TH': 'th',
  'tr-TR': 'tr',
  'uk-UA': 'uk',
  ur: 'ur',
  'vi-VN': 'vi',
  'zu-ZA': 'zu'
};
const mapperSpeechCodeToTranslateCode = from =>
  speechCodeToTranslateCode[from] ? speechCodeToTranslateCode[from] : from;

// purpose
bindMenuClickAction();

// definition
function bindMenuClickAction() {
  const menuItems = document.querySelectorAll('.nav a');
  Array.from(menuItems).forEach(item => {
    item.addEventListener('click', () => {
      Array.from(menuItems).forEach(menu => {
        menu.classList.remove('activeMenu');
      });
      item.classList.add('activeMenu');
      navigate(item.dataset.nav);
    });
  });
}

function navigate(section) {
  hideAllSections();
  unhideSection(section);
}

function hideAllSections() {
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('hide');
  });
}

function unhideSection(section) {
  const activeSection = document.querySelector(`[data-section="${section}"]`);
  activeSection.classList.remove('hide');
}

document.querySelector('.menu-toggle').addEventListener('click', e => {
  e.currentTarget.classList.toggle('open');
  document.querySelector('ul.nav').classList.toggle('opening');
});

// purpose
fillLanguagesDropdown();
setDefaultLanguageInDropdown();
bindDropdownChange();

// definition
function fillLanguagesDropdown() {
  const [sourceDropdown, destinationDropdown] = getTextLanguagesDropdowns();
  const languagesList = `
<optgroup>
    <option value="af">Afrikaans</option>
    <option value="sq">Albanian</option>
    <option value="am">አማርኛ</option>
    <option value="ar">Arabic</option>
    <option value="hy">Հայերեն</option>
    <option value="az">Azerbaijani</option>
    <option value="eu">Basque</option>
    <option value="be">Belarusian</option>
    <option value="bn">বাংলা</option>
    <option value="bs">Bosnian</option>
    <option value="bg">български</option>
    <option value="ca">Català</option>
    <option value="ceb">Cebuano</option>
    <option value="ny">Chichewa</option>
    <option value="zh-CN">Chinese (Simplified)</option>
    <option value="zh-TW">Chinese (Traditional)</option>
    <option value="co">Corsican</option>
    <option value="hr">Croatian</option>
    <option value="cs">Čeština</option>
    <option value="da">Dansk</option>
    <option value="nl">Dutch</option>
    <option value="en">English</option>
    <option value="eo">Esperanto</option>
    <option value="et">Estonian</option>
    <option value="tl">Filipino</option>
    <option value="fi">Finnish</option>
    <option value="fr">French</option>
    <option value="fy">Frisian</option>
    <option value="gl">Galician</option>
    <option value="ka">ქართული</option>
    <option value="de">German</option>
    <option value="el">Greek</option>
    <option value="gu">ગુજરાતી</option>
    <option value="ht">Haitian Creole</option>
    <option value="ha">Hausa</option>
    <option value="haw">Hawaiian</option>
    <option value="iw">Hebrew</option>
    <option value="hi">हिन्दी</option>
    <option value="hmn">Hmong</option>
    <option value="hu">Hungarian</option>
    <option value="is">Íslenska</option>
    <option value="ig">Igbo</option>
    <option value="id">Indonesian</option>
    <option value="ga">Irish</option>
    <option value="it">Italiano</option>
    <option value="ja">日本語</option>
    <option value="jw">Javanese</option>
    <option value="kn">ಕನ್ನಡ</option>
    <option value="kk">Kazakh</option>
    <option value="km">ភាសាខ្មែរ</option>
    <option value="ko">한국어</option>
    <option value="ku">Kurdish (Kurmanji)</option>
    <option value="ky">Kyrgyz</option>
    <option value="lo">ລາວ</option>
    <option value="la">Latin</option>
    <option value="lv">Latviešu</option>
    <option value="lt">Lietuvių</option>
    <option value="lb">Luxembourgish</option>
    <option value="mk">Macedonian</option>
    <option value="mg">Malagasy</option>
    <option value="ms">Bahasa Melayu</option>
    <option value="ml">മലയാളം</option>
    <option value="mt">Maltese</option>
    <option value="mi">Maori</option>
    <option value="mr">मराठी</option>
    <option value="mn">Mongolian</option>
    <option value="my">Myanmar (Burmese)</option>
    <option value="ne">नेपाली भाषा</option>
    <option value="no">Norwegian</option>
    <option value="ps">Pashto</option>
    <option value="fa">Persian</option>
    <option value="pl">Polski</option>
    <option value="pt">Português</option>
    <option value="pa">Punjabi</option>
    <option value="ro">Română</option>
    <option value="ru">Pусский</option>
    <option value="sm">Samoan</option>
    <option value="gd">Scots Gaelic</option>
    <option value="sr">Serbian</option>
    <option value="st">Sesotho</option>
    <option value="sn">Shona</option>
    <option value="sd">Sindhi</option>
    <option value="si">සිංහල</option>
    <option value="sk">Slovenčina</option>
    <option value="sl">Slovenščina</option>
    <option value="so">Somali</option>
    <option value="es">Español</option>
    <option value="su">Basa Sunda</option>
    <option value="sw">Kiswahili</option>
    <option value="sv">Svenska</option>
    <option value="tg">Tajik</option>
    <option value="ta">தமிழ்</option>
    <option value="te">తెలుగు</option>
    <option value="th">ภาษาไทย</option>
    <option value="tr">Türkçe</option>
    <option value="uk">Українська</option>
    <option value="ur">پاکستان</option>
    <option value="uz">Uzbek</option>
    <option value="vi">Tiếng Việt</option>
    <option value="cy">Welsh</option>
    <option value="xh">Xhosa</option>
    <option value="yi">Yiddish</option>
    <option value="yo">Yoruba</option>
    <option value="zu">IsiZulu</option>
    </optgroup>
`;

  sourceDropdown.innerHTML = languagesList;
  destinationDropdown.innerHTML = languagesList;
}

function getTextLanguagesDropdowns() {
  return [
    document.querySelector('#translateTxtSrcLanguagesList'),
    document.querySelector('#translateTxtDestLanguagesList')
  ];
}

function setDefaultLanguageInDropdown() {
  const [sourceDropdown, destinationDropdown] = getTextLanguagesDropdowns();

  sourceDropdown.value = config.txtTranslator.defaultSrcLang.code;
  resizeElement(sourceDropdown, sourceDropdown.options[sourceDropdown.selectedIndex].text.length);

  destinationDropdown.value = config.txtTranslator.defaultDestLang.code;
  resizeElement(
    destinationDropdown,
    destinationDropdown.options[destinationDropdown.selectedIndex].text.length
  );
}

function resizeElement(dropdown, length) {
  length += 1;
  dropdown.style.width = `${length}rem`;
}

function bindDropdownChange() {
  const resizeDropdownHandler = event => {
    const language = event.target.options[event.target.selectedIndex].text;
    resizeElement(event.target, language.length);
  };

  const updateHeaderMessageHandler = event => {
    const language = event.target.options[event.target.selectedIndex].text;
    const originOfDropdown = event.target.dataset.origin;
    event.target.closest('section').querySelector(`.${originOfDropdown}`).textContent = language;
  };

  const [sourceDropdown, destinationDropdown] = getTextLanguagesDropdowns();
  sourceDropdown.addEventListener('change', resizeDropdownHandler);
  destinationDropdown.addEventListener('change', resizeDropdownHandler);
  sourceDropdown.addEventListener('change', updateHeaderMessageHandler);
  destinationDropdown.addEventListener('change', updateHeaderMessageHandler);
}

// purpose
fillSpeechRecognitionLanguagesDropdown();
setDefaultSpeechRecognitionLanguageInDropdown();
bindResizeOnSpeechRecognitionLanguageDropwdownChange();
bindSpeechRecognitionLanguageDropwdownChange();
bindHeaderMessageonLanguageDropwdownChange();

// definition
function fillSpeechRecognitionLanguagesDropdown() {
  const [sourceDropdown, destinationDropdown] = getSpeechRecognitionLanguagesDropdowns();
  const speechRecognitionLanguages = [
    ['Afrikaans', 'af-ZA'],
    ['አማርኛ', 'am-ET'],
    ['Azərbaycanca', 'az-AZ'],
    // ['বাংলা - বাংলাদেশ', 'bn-BD'],
    // ['বাংলা - ভারত', 'bn-IN'],
    ['বাংলা', 'bn'],
    ['Bahasa Indonesia', 'id-ID'],
    ['Bahasa Melayu', 'ms-MY'],
    ['Català', 'ca-ES'],
    ['Čeština', 'cs-CZ'],
    ['Dansk', 'da-DK'],
    ['Deutsch', 'de-DE'],
    // ['English - Australia', 'en-AU'],
    // ['English - Canada', 'en-CA'],
    // ['English - India', 'en-IN'],
    // ['English - Kenya', 'en-KE'],
    // ['English - Tanzania', 'en-TZ'],
    // ['English - Ghana', 'en-GH'],
    // ['English - New Zealand', 'en-NZ'],
    // ['English - Nigeria', 'en-NG'],
    // ['English - South Africa', 'en-ZA'],
    // ['English - Philippines', 'en-PH'],
    // ['English - United Kingdom', 'en-GB'],
    // ['English - United States', 'en-US'],
    ['English', 'en'],
    // ['Español - Argentina', 'es-AR'],
    // ['Español - Bolivia', 'es-BO'],
    // ['Español - Chile', 'es-CL'],
    // ['Español - Colombia', 'es-CO'],
    // ['Español - Costa Rica', 'es-CR'],
    // ['Español - Ecuador', 'es-EC'],
    // ['Español - El Salvador', 'es-SV'],
    // ['Español - España', 'es-ES'],
    // ['Español - Estados Unidos', 'es-US'],
    // ['Español - Guatemala', 'es-GT'],
    // ['Español - Honduras', 'es-HN'],
    // ['Español - México', 'es-MX'],
    // ['Español - Nicaragua', 'es-NI'],
    // ['Español - Panamá', 'es-PA'],
    // ['Español - Paraguay', 'es-PY'],
    // ['Español - Perú', 'es-PE'],
    // ['Español - Puerto Rico', 'es-PR'],
    // ['Español - República Dominicana', 'es-DO'],
    // ['Español - Uruguay', 'es-UY'],
    // ['Español - Venezuela', 'es-VE'],
    ['Español', 'es'],
    ['Euskara', 'eu-ES'],
    ['Filipino', 'fil-PH'],
    ['Français', 'fr-FR'],
    ['Basa Jawa', 'jv-ID'],
    ['Galego', 'gl-ES'],
    ['ગુજરાતી', 'gu-IN'],
    ['Hrvatski', 'hr-HR'],
    ['IsiZulu', 'zu-ZA'],
    ['Íslenska', 'is-IS'],
    // ['Italiano - Italia', 'it-IT'],
    // ['Italiano - Svizzera', 'it-CH'],
    ['Italiano', 'it'],
    ['ಕನ್ನಡ', 'kn-IN'],
    ['ភាសាខ្មែរ', 'km-KH'],
    ['Latviešu', 'lv-LV'],
    ['Lietuvių', 'lt-LT'],
    ['മലയാളം', 'ml-IN'],
    ['मराठी', 'mr-IN'],
    ['Magyar', 'hu-HU'],
    ['ລາວ', 'lo-LA'],
    ['Nederlands', 'nl-NL'],
    ['नेपाली भाषा', 'ne-NP'],
    ['Norsk bokmål', 'nb-NO'],
    ['Polski', 'pl-PL'],
    // ['Português-Brasil', 'pt-BR'],
    // ['Português-Portugal', 'pt-PT'],
    ['Português', 'pt'],
    ['Română', 'ro-RO'],
    ['සිංහල', 'si-LK'],
    ['Slovenščina', 'sl-SI'],
    ['Basa Sunda', 'su-ID'],
    ['Slovenčina', 'sk-SK'],
    ['Suomi', 'fi-FI'],
    ['Svenska', 'sv-SE'],
    // ['Kiswahili - Tanzania', 'sw-TZ'],
    // ['Kiswahili - Kenya', 'sw-KE'],
    ['Kiswahili', 'sw'],
    ['ქართული', 'ka-GE'],
    ['Հայերեն', 'hy-AM'],
    // ['தமிழ் - இந்தியா', 'ta-IN'],
    // ['தமிழ் - சிங்கப்பூர்', 'ta-SG'],
    // ['தமிழ் - இலங்கை', 'ta-LK'],
    // ['தமிழ் - மலேசியா', 'ta-MY'],
    ['தமிழ்', 'ta'],
    ['తెలుగు', 'te-IN'],
    ['Tiếng Việt', 'vi-VN'],
    ['Türkçe', 'tr-TR'],
    // ['اُردُو - پاکستان', 'ur - PK'],
    // ['بھارت - پاکستان', 'ur - IN'],
    ['پاکستان', 'ur'],
    ['Ελληνικά', 'el-GR'],
    ['български', 'bg-BG'],
    ['Pусский', 'ru-RU'],
    ['Српски', 'sr-RS'],
    ['Українська', 'uk-UA'],
    ['한국어', 'ko-KR'],
    // ['中文 - 普通话 (中国大陆)', 'cmn-Hans-CN'],
    // ['中文 - 普通话 (香港)', 'cmn-Hans-HK'],
    // ['中文 - 中文 (台灣)', 'cmn-Hant-TW'],
    // ['中文 - 粵語 (香港)', 'yue-Hant-HK'],
    ['中文', 'cmn'],
    ['日本語', 'ja-JP'],
    ['हिन्दी', 'hi-IN'],
    ['ภาษาไทย', 'th-TH']
  ];

  for (let i = 0; i < speechRecognitionLanguages.length; i++) {
    sourceDropdown.options[i] = new Option(
      speechRecognitionLanguages[i][0],
      speechRecognitionLanguages[i][1]
    );
    destinationDropdown.options[i] = new Option(
      speechRecognitionLanguages[i][0],
      speechRecognitionLanguages[i][1]
    );
  }
}

function getSpeechRecognitionLanguagesDropdowns() {
  return [
    document.querySelector('#translateSpeechSrcLanguagesList'),
    document.querySelector('#translateSpeechDestLanguagesList')
  ];
}

function setDefaultSpeechRecognitionLanguageInDropdown() {
  const [sourceDropdown, destinationDropdown] = getSpeechRecognitionLanguagesDropdowns();
  sourceDropdown.value = config.speechTranslator.defaultSrcLang.code;
  resizeElement(sourceDropdown, sourceDropdown.options[sourceDropdown.selectedIndex].text.length);
  destinationDropdown.value = config.speechTranslator.defaultDestLang.code;
  resizeElement(
    destinationDropdown,
    destinationDropdown.options[destinationDropdown.selectedIndex].text.length
  );
}

function bindResizeOnSpeechRecognitionLanguageDropwdownChange() {
  const [sourceDropdown, destinationDropdown] = getSpeechRecognitionLanguagesDropdowns();
  const handler = event => {
    const language = event.target.options[event.target.selectedIndex].text;
    resizeElement(event.target, language.length);
  };
  sourceDropdown.addEventListener('change', handler);
  destinationDropdown.addEventListener('change', handler);
}

function bindSpeechRecognitionLanguageDropwdownChange() {
  const [sourceDropdown] = getSpeechRecognitionLanguagesDropdowns();
  sourceDropdown.addEventListener('change', event => {
    const languageCode = event.target.value;
    document.dispatchEvent(
      new CustomEvent('speechRecognitionLanguageChanged', {
        bubbles: true,
        detail: { languageCode }
      })
    );
  });
}

function bindHeaderMessageonLanguageDropwdownChange() {
  const updateHeaderMessageHandler = event => {
    const language = event.target.options[event.target.selectedIndex].text;
    const originOfDropdown = event.target.dataset.origin;
    event.target.closest('section').querySelector(`.${originOfDropdown}`).textContent = language;
  };

  const [sourceDropdown, destinationDropdown] = getSpeechRecognitionLanguagesDropdowns();
  sourceDropdown.addEventListener('change', updateHeaderMessageHandler);
  destinationDropdown.addEventListener('change', updateHeaderMessageHandler);
}

window.addEventListener('load', function speechInitializer() {
  const speech = new Speech();
  const mic = document.getElementById('mic');

  mic.addEventListener('click', function micClick(event) {
    if (speech.recognizing) {
      speech.stopSpeechCapture();
      mic.classList.remove('onSpeechCapture');
    } else {
      speech.startSpeechCapture();
      mic.classList.add('onSpeechCapture');
    }
  });

  document.addEventListener('speechRecognitionResult', event => {
    const speech = `${event.detail.finalTranscript}.`;
    const speechTextarea = document.getElementById('translateSpeechSrc');
    const textNode = document.createTextNode(speech);
    speechTextarea.appendChild(textNode);
  });

  document.addEventListener('speechRecognitionLanguageChanged', event => {
    speech.stopSpeechCapture();
    const speechTextarea = document.getElementById('translateSpeechSrc');
    speechTextarea.innerHTML = '';
    speech.language = event.detail.languageCode;
    mic.classList.remove('onSpeechCapture');
  });
});

// purpose
bindTranslateButtonClickAction();
restrictMaxCharactersinTextarea();
bindClearButton();

// definition
function bindTranslateButtonClickAction() {
  document.querySelectorAll('.btnTranslate').forEach(btnTranslate => {
    btnTranslate.addEventListener('click', e => {
      if (e.target.nodeName !== 'BUTTON') return;
      invokeTranslate(`${e.target.id}`);
    });
  });
}

function invokeTranslate(idBtnTranslate) {
  console.log(`btnTranslate id - ${idBtnTranslate}`);
  const source = document
    .getElementById(idBtnTranslate)
    .previousElementSibling.querySelector('.content');
  const yourText = source.textContent.trim();
  if (yourText === '') {
    return;
  }
  spinningWheel(idBtnTranslate, true);
  const destination = document
    .getElementById(idBtnTranslate)
    .nextElementSibling.querySelector('.content');
  const [srcLanguage, destLanguage] = document
    .getElementById(idBtnTranslate)
    .closest('section')
    .querySelectorAll('select');
  const translateServiceURL = generateTranslateServiceURL(yourText, srcLanguage, destLanguage);
  invokeTranslateService(yourText, translateServiceURL, destination, idBtnTranslate);
}

function generateTranslateServiceURL(yourText, srcLanguage, destLanguage) {
  let url = config.translatorServiceURL;
  url = url.replace('{sl}', mapperSpeechCodeToTranslateCode(srcLanguage.value));
  url = url.replace('{tl}', mapperSpeechCodeToTranslateCode(destLanguage.value));
  url = `${url}&q=${encodeURI(yourText)}`;
  return url;
}

function invokeTranslateService(yourText, url, destination, idBtnTranslate) {
  destination.textContent = '';
  destination.textContent = 'Translation in progress...';
  try {
    translator(yourText, destination, url, writeTranslationResult, idBtnTranslate);
  } catch (error) {
    destination.textContent = 'Error';
  }
}

function restrictMaxCharactersinTextarea() {
  document.querySelectorAll('.content.source').forEach(textarea => {
    textarea.addEventListener('input', e => {
      let yourText = e.target.textContent;
      if (yourText.length > config.maxCharactersPerTranslation) {
        yourText = yourText.substring(0, config.maxCharactersPerTranslation);
        const positionOfLastFullStop = yourText.lastIndexOf('.');
        yourText = yourText.substring(0, positionOfLastFullStop + 1);
        e.target.textContent = yourText;
      }
    });
  });
}

function writeTranslationResult(result, destination, idBtnTranslate) {
  destination.textContent = result;
  spinningWheel(idBtnTranslate, false);
}

function spinningWheel(idBtnTranslate, show) {
  const wheel = document.getElementById('spinningWheel');
  const btnTranslate = document.getElementById(idBtnTranslate);
  if (show) {
    wheel.classList.remove('hide');
    btnTranslate.disabled = true;
  } else {
    wheel.classList.add('hide');
    btnTranslate.disabled = false;
  }
}

document.querySelectorAll('[contenteditable]').forEach(textarea => {
  textarea.addEventListener('paste', e => {
    let clipboardData;
    let pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    textarea.textContent += pastedData;
  });
});

function bindClearButton() {
  document.querySelectorAll('.clearButton').forEach(clearButton => {
    clearButton.addEventListener('click', e => {
      e.target.closest('.pattern').querySelector('.content').textContent = '';
    });
  });
}

(function transliterate() {
  google.load('elements', '1', {
    packages: 'transliteration'
  });

  function onLoad() {
    const options = {
      sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
      destinationLanguage: [google.elements.transliteration.LanguageCode.MALAYALAM],
      transliterationEnabled: true
    };
    const control = new google.elements.transliteration.TransliterationControl(options);
    control.makeTransliteratable(['transliterate']);
  }

  google.setOnLoadCallback(onLoad);
})(google);

const isMobile = {
  Android() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any() {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  }
};

if (isMobile.any()) {
  document.querySelector('[data-section="transliterate"] .message').textContent =
    'Transliterate feature is currently available only on Desktop browsers. Let me know if you would like this feature on your mobile device.';
  document.querySelector('[data-section="transliterate"] article').remove();
}
