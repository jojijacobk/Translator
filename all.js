"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'UA-145827690-1');
var config = {
  txtTranslator: {
    defaultSrcLang: {
      code: 'en'
    },
    defaultDestLang: {
      code: 'ml'
    }
  },
  speechTranslator: {
    defaultSrcLang: {
      code: 'ml-IN'
    },
    defaultDestLang: {
      code: 'en'
    }
  },
  translatorServiceURL: 'https://translate.googleapis.com/translate_a/single?client=gtx&sl={sl}&tl={tl}&dt=t&ie=UTF-8&oe=UTF-8&',
  corsApiHost: 'cors-anywhere.herokuapp.com',

  get corsApiUrl() {
    return "https://".concat(this.corsApiHost, "/");
  }

};

function translator(yourText, destination, url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onreadystatechange = function onreadystatechange() {
    if (xhr.readyState === 4) {
      var result = '';

      try {
        var translation = JSON.parse(xhr.responseText);
        var numOfSentences = translation[0].length;

        for (var iteration = 0; iteration < numOfSentences; iteration++) {
          result += translation[0][iteration][0];
        }

        callback(result, destination);
      } catch (e) {
        console.error(e);
        callback('Sorry! There is an error. Please try later', destination);
      }
    }
  };

  xhr.send(null);
} // CORS proxy by heroku


(function corsProxyHeroku() {
  var slice = [].slice;
  var origin = "".concat(window.location.protocol, "//").concat(window.location.host);
  var open = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function customOpen() {
    var args = slice.call(arguments);
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);

    if (targetOrigin && targetOrigin[0].toLowerCase() !== origin && targetOrigin[1] !== config.corsApiHost) {
      args[1] = config.corsApiUrl + args[1];
    }

    return open.apply(this, args);
  };
})();

function Speech() {
  if ('webkitSpeechRecognition' in window) {
    this.recognition = new webkitSpeechRecognition(); // custom settings

    this.recognizing = false;
    this.finalTranscript = '';
    this.interimTranscript = ''; // speech recognition settings

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.language = config.speechTranslator.defaultSrcLang.code;

    this.startSpeechCapture = function startSpeechCapture() {
      if (this.recognizing) {
        this.recognition.stop();
        this.recognizing = false;
      }

      this.recognition.lang = this.language;
      this.recognition.start();
      this.recognizing = true;
    };

    this.stopSpeechCapture = function stopSpeechCapture() {
      this.recognizing = false;
      this.recognition.stop();
    };

    this.recognition.onstart = function startSpeechRecognition() {
      console.log('Started...');
    };

    this.recognition.onend = function endSpeechRecognition(event) {
      // if recognition is ended because of idle time, resume recognition. We want to end recognition only if it is explicitly stopped by user.
      if (this.recognizing) {
        this.recognition.start();
      }
    };

    this.recognition.onresult = function speechRecognitionResult(event) {
      if (_typeof(event.results) === undefined) {
        console.log('Undefined results'); // this.stopSpeechCapture();

        return;
      }

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // this.finalTranscript = event.results[i][0].transcript;
          console.log(event.results[i][0].transcript);
        } else {
          this.finalTranscript = event.results[i][0].transcript;
          this.recognition.start();
        }
      }

      this.finalTranscript = function (transcript) {
        if (transcript === undefined || transcript === '') {
          return '';
        }

        var firstChar = /\S/;
        return transcript.replace(firstChar, function capitalize(match) {
          return match.toUpperCase();
        });
      }(this.finalTranscript);

      document.dispatchEvent(new CustomEvent('speechRecognitionResult', {
        bubbles: true,
        detail: {
          finalTranscript: this.finalTranscript
        }
      }));
    };

    this.recognition.onerror = function speechRecognitionError(event) {
      console.log(event.error);
    };

    console.log('webkitSpeechRecognition is available.');
  } else {
    console.log('webkitSpeechRecognition is not available.');
  }
}

var speechCodeToTranslateCode = {
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

var mapperSpeechCodeToTranslateCode = function mapperSpeechCodeToTranslateCode(from) {
  return speechCodeToTranslateCode[from] ? speechCodeToTranslateCode[from] : from;
}; // purpose


bindMenuClickAction(); // definition

function bindMenuClickAction() {
  var menuItems = document.querySelectorAll('.menu');
  Array.from(menuItems).forEach(function (item) {
    item.addEventListener('click', function () {
      Array.from(menuItems).forEach(function (menu) {
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
  document.querySelectorAll('section').forEach(function (section) {
    section.classList.add('hide');
  });
}

function unhideSection(section) {
  var activeSection = document.querySelector("[data-section=\"".concat(section, "\"]"));
  activeSection.classList.remove('hide');
} // purpose


fillLanguagesDropdown();
setDefaultLanguageInDropdown();
bindResizeOnDropwdownChange(); // definition

function fillLanguagesDropdown() {
  var languagesList = "\n<optgroup>\n    <option value=\"af\">Afrikaans</option>\n    <option value=\"sq\">Albanian</option>\n    <option value=\"am\">\u12A0\u121B\u122D\u129B</option>\n    <option value=\"ar\">Arabic</option>\n    <option value=\"hy\">\u0540\u0561\u0575\u0565\u0580\u0565\u0576</option>\n    <option value=\"az\">Azerbaijani</option>\n    <option value=\"eu\">Basque</option>\n    <option value=\"be\">Belarusian</option>\n    <option value=\"bn\">\u09AC\u09BE\u0982\u09B2\u09BE</option>\n    <option value=\"bs\">Bosnian</option>\n    <option value=\"bg\">\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438</option>\n    <option value=\"ca\">Catal\xE0</option>\n    <option value=\"ceb\">Cebuano</option>\n    <option value=\"ny\">Chichewa</option>\n    <option value=\"zh-CN\">Chinese (Simplified)</option>\n    <option value=\"zh-TW\">Chinese (Traditional)</option>\n    <option value=\"co\">Corsican</option>\n    <option value=\"hr\">Croatian</option>\n    <option value=\"cs\">\u010Ce\u0161tina</option>\n    <option value=\"da\">Dansk</option>\n    <option value=\"nl\">Dutch</option>\n    <option value=\"en\">English</option>\n    <option value=\"eo\">Esperanto</option>\n    <option value=\"et\">Estonian</option>\n    <option value=\"tl\">Filipino</option>\n    <option value=\"fi\">Finnish</option>\n    <option value=\"fr\">French</option>\n    <option value=\"fy\">Frisian</option>\n    <option value=\"gl\">Galician</option>\n    <option value=\"ka\">\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8</option>\n    <option value=\"de\">German</option>\n    <option value=\"el\">Greek</option>\n    <option value=\"gu\">\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0</option>\n    <option value=\"ht\">Haitian Creole</option>\n    <option value=\"ha\">Hausa</option>\n    <option value=\"haw\">Hawaiian</option>\n    <option value=\"iw\">Hebrew</option>\n    <option value=\"hi\">\u0939\u093F\u0928\u094D\u0926\u0940</option>\n    <option value=\"hmn\">Hmong</option>\n    <option value=\"hu\">Hungarian</option>\n    <option value=\"is\">\xCDslenska</option>\n    <option value=\"ig\">Igbo</option>\n    <option value=\"id\">Indonesian</option>\n    <option value=\"ga\">Irish</option>\n    <option value=\"it\">Italiano</option>\n    <option value=\"ja\">\u65E5\u672C\u8A9E</option>\n    <option value=\"jw\">Javanese</option>\n    <option value=\"kn\">\u0C95\u0CA8\u0CCD\u0CA8\u0CA1</option>\n    <option value=\"kk\">Kazakh</option>\n    <option value=\"km\">\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A</option>\n    <option value=\"ko\">\uD55C\uAD6D\uC5B4</option>\n    <option value=\"ku\">Kurdish (Kurmanji)</option>\n    <option value=\"ky\">Kyrgyz</option>\n    <option value=\"lo\">\u0EA5\u0EB2\u0EA7</option>\n    <option value=\"la\">Latin</option>\n    <option value=\"lv\">Latvie\u0161u</option>\n    <option value=\"lt\">Lietuvi\u0173</option>\n    <option value=\"lb\">Luxembourgish</option>\n    <option value=\"mk\">Macedonian</option>\n    <option value=\"mg\">Malagasy</option>\n    <option value=\"ms\">Bahasa Melayu</option>\n    <option value=\"ml\">\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02</option>\n    <option value=\"mt\">Maltese</option>\n    <option value=\"mi\">Maori</option>\n    <option value=\"mr\">\u092E\u0930\u093E\u0920\u0940</option>\n    <option value=\"mn\">Mongolian</option>\n    <option value=\"my\">Myanmar (Burmese)</option>\n    <option value=\"ne\">\u0928\u0947\u092A\u093E\u0932\u0940 \u092D\u093E\u0937\u093E</option>\n    <option value=\"no\">Norwegian</option>\n    <option value=\"ps\">Pashto</option>\n    <option value=\"fa\">Persian</option>\n    <option value=\"pl\">Polski</option>\n    <option value=\"pt\">Portugu\xEAs</option>\n    <option value=\"pa\">Punjabi</option>\n    <option value=\"ro\">Rom\xE2n\u0103</option>\n    <option value=\"ru\">P\u0443\u0441\u0441\u043A\u0438\u0439</option>\n    <option value=\"sm\">Samoan</option>\n    <option value=\"gd\">Scots Gaelic</option>\n    <option value=\"sr\">Serbian</option>\n    <option value=\"st\">Sesotho</option>\n    <option value=\"sn\">Shona</option>\n    <option value=\"sd\">Sindhi</option>\n    <option value=\"si\">\u0DC3\u0DD2\u0D82\u0DC4\u0DBD</option>\n    <option value=\"sk\">Sloven\u010Dina</option>\n    <option value=\"sl\">Sloven\u0161\u010Dina</option>\n    <option value=\"so\">Somali</option>\n    <option value=\"es\">Espa\xF1ol</option>\n    <option value=\"su\">Basa Sunda</option>\n    <option value=\"sw\">Kiswahili</option>\n    <option value=\"sv\">Svenska</option>\n    <option value=\"tg\">Tajik</option>\n    <option value=\"ta\">\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD</option>\n    <option value=\"te\">\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41</option>\n    <option value=\"th\">\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22</option>\n    <option value=\"tr\">T\xFCrk\xE7e</option>\n    <option value=\"uk\">\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430</option>\n    <option value=\"ur\">\u067E\u0627\u06A9\u0633\u062A\u0627\u0646</option>\n    <option value=\"uz\">Uzbek</option>\n    <option value=\"vi\">Ti\u1EBFng Vi\u1EC7t</option>\n    <option value=\"cy\">Welsh</option>\n    <option value=\"xh\">Xhosa</option>\n    <option value=\"yi\">Yiddish</option>\n    <option value=\"yo\">Yoruba</option>\n    <option value=\"zu\">IsiZulu</option>\n    </optgroup>\n";
  document.querySelectorAll('section[data-section="translateText"] .languages').forEach(function (dropdown) {
    dropdown.innerHTML = languagesList;
  });
}

function setDefaultLanguageInDropdown() {
  var dropdownSourceLanguages = document.querySelectorAll('section[data-section="translateText"] select:nth-of-type(1), section[data-section="transliterate"] select:nth-of-type(1)');
  dropdownSourceLanguages.forEach(function (dropdown) {
    dropdown.value = config.txtTranslator.defaultSrcLang.code;
    resizeElement(dropdown, dropdown.options[dropdown.selectedIndex].text.length);
  });
  var dropdownDestLanguages = document.querySelectorAll('section[data-section="translateText"] select:nth-of-type(2), section[data-section="transliterate"] select:nth-of-type(2)');
  dropdownDestLanguages.forEach(function (dropdown) {
    dropdown.value = config.txtTranslator.defaultDestLang.code;
    resizeElement(dropdown, dropdown.options[dropdown.selectedIndex].text.length);
  });
}

function resizeElement(dropdown, length) {
  length += 1;
  dropdown.style.width = "".concat(length, "rem");
}

function bindResizeOnDropwdownChange() {
  Array.from(document.querySelectorAll('.languages')).forEach(function (dropdown) {
    dropdown.addEventListener('change', function (event) {
      var language = event.target.options[event.target.selectedIndex].text;
      resizeElement(event.target, language.length);
    });
  });
} // purpose


fillSpeechRecognitionLanguagesDropdown();
setDefaultSpeechRecognitionLanguageInDropdown();
bindResizeOnSpeechRecognitionLanguageDropwdownChange();
bindSpeechRecognitionLanguageDropwdownChange(); // definition

function fillSpeechRecognitionLanguagesDropdown() {
  var _getSpeechRecognition = getSpeechRecognitionLanguagesDropdowns(),
      _getSpeechRecognition2 = _slicedToArray(_getSpeechRecognition, 2),
      sourceDropdown = _getSpeechRecognition2[0],
      destinationDropdown = _getSpeechRecognition2[1];

  var speechRecognitionLanguages = [['Afrikaans', 'af-ZA'], ['አማርኛ', 'am-ET'], ['Azərbaycanca', 'az-AZ'], // ['বাংলা - বাংলাদেশ', 'bn-BD'],
  // ['বাংলা - ভারত', 'bn-IN'],
  ['বাংলা', 'bn'], ['Bahasa Indonesia', 'id-ID'], ['Bahasa Melayu', 'ms-MY'], ['Català', 'ca-ES'], ['Čeština', 'cs-CZ'], ['Dansk', 'da-DK'], ['Deutsch', 'de-DE'], // ['English - Australia', 'en-AU'],
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
  ['English', 'en'], // ['Español - Argentina', 'es-AR'],
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
  ['Español', 'es'], ['Euskara', 'eu-ES'], ['Filipino', 'fil-PH'], ['Français', 'fr-FR'], ['Basa Jawa', 'jv-ID'], ['Galego', 'gl-ES'], ['ગુજરાતી', 'gu-IN'], ['Hrvatski', 'hr-HR'], ['IsiZulu', 'zu-ZA'], ['Íslenska', 'is-IS'], // ['Italiano - Italia', 'it-IT'],
  // ['Italiano - Svizzera', 'it-CH'],
  ['Italiano', 'it'], ['ಕನ್ನಡ', 'kn-IN'], ['ភាសាខ្មែរ', 'km-KH'], ['Latviešu', 'lv-LV'], ['Lietuvių', 'lt-LT'], ['മലയാളം', 'ml-IN'], ['मराठी', 'mr-IN'], ['Magyar', 'hu-HU'], ['ລາວ', 'lo-LA'], ['Nederlands', 'nl-NL'], ['नेपाली भाषा', 'ne-NP'], ['Norsk bokmål', 'nb-NO'], ['Polski', 'pl-PL'], // ['Português-Brasil', 'pt-BR'],
  // ['Português-Portugal', 'pt-PT'],
  ['Português', 'pt'], ['Română', 'ro-RO'], ['සිංහල', 'si-LK'], ['Slovenščina', 'sl-SI'], ['Basa Sunda', 'su-ID'], ['Slovenčina', 'sk-SK'], ['Suomi', 'fi-FI'], ['Svenska', 'sv-SE'], // ['Kiswahili - Tanzania', 'sw-TZ'],
  // ['Kiswahili - Kenya', 'sw-KE'],
  ['Kiswahili', 'sw'], ['ქართული', 'ka-GE'], ['Հայերեն', 'hy-AM'], // ['தமிழ் - இந்தியா', 'ta-IN'],
  // ['தமிழ் - சிங்கப்பூர்', 'ta-SG'],
  // ['தமிழ் - இலங்கை', 'ta-LK'],
  // ['தமிழ் - மலேசியா', 'ta-MY'],
  ['தமிழ்', 'ta'], ['తెలుగు', 'te-IN'], ['Tiếng Việt', 'vi-VN'], ['Türkçe', 'tr-TR'], // ['اُردُو - پاکستان', 'ur - PK'],
  // ['بھارت - پاکستان', 'ur - IN'],
  ['پاکستان', 'ur'], ['Ελληνικά', 'el-GR'], ['български', 'bg-BG'], ['Pусский', 'ru-RU'], ['Српски', 'sr-RS'], ['Українська', 'uk-UA'], ['한국어', 'ko-KR'], // ['中文 - 普通话 (中国大陆)', 'cmn-Hans-CN'],
  // ['中文 - 普通话 (香港)', 'cmn-Hans-HK'],
  // ['中文 - 中文 (台灣)', 'cmn-Hant-TW'],
  // ['中文 - 粵語 (香港)', 'yue-Hant-HK'],
  ['中文', 'cmn'], ['日本語', 'ja-JP'], ['हिन्दी', 'hi-IN'], ['ภาษาไทย', 'th-TH']];

  for (var i = 0; i < speechRecognitionLanguages.length; i++) {
    sourceDropdown.options[i] = new Option(speechRecognitionLanguages[i][0], speechRecognitionLanguages[i][1]);
    destinationDropdown.options[i] = new Option(speechRecognitionLanguages[i][0], speechRecognitionLanguages[i][1]);
  }
}

function getSpeechRecognitionLanguagesDropdowns() {
  return [document.querySelector('#translateSpeechSrcLanguagesList'), document.querySelector('#translateSpeechDestLanguagesList')];
}

function setDefaultSpeechRecognitionLanguageInDropdown() {
  var _getSpeechRecognition3 = getSpeechRecognitionLanguagesDropdowns(),
      _getSpeechRecognition4 = _slicedToArray(_getSpeechRecognition3, 2),
      sourceDropdown = _getSpeechRecognition4[0],
      destinationDropdown = _getSpeechRecognition4[1];

  sourceDropdown.value = config.speechTranslator.defaultSrcLang.code;
  resizeElement(sourceDropdown, sourceDropdown.options[sourceDropdown.selectedIndex].text.length);
  destinationDropdown.value = config.speechTranslator.defaultDestLang.code;
  resizeElement(destinationDropdown, destinationDropdown.options[destinationDropdown.selectedIndex].text.length);
}

function bindResizeOnSpeechRecognitionLanguageDropwdownChange() {
  var _getSpeechRecognition5 = getSpeechRecognitionLanguagesDropdowns(),
      _getSpeechRecognition6 = _slicedToArray(_getSpeechRecognition5, 2),
      sourceDropdown = _getSpeechRecognition6[0],
      destinationDropdown = _getSpeechRecognition6[1];

  sourceDropdown.addEventListener('change', function (event) {
    var language = event.target.options[event.target.selectedIndex].text;
    resizeElement(event.target, language.length);
  });
  destinationDropdown.addEventListener('change', function (event) {
    var language = event.target.options[event.target.selectedIndex].text;
    resizeElement(event.target, language.length);
  });
}

function bindSpeechRecognitionLanguageDropwdownChange() {
  var _getSpeechRecognition7 = getSpeechRecognitionLanguagesDropdowns(),
      _getSpeechRecognition8 = _slicedToArray(_getSpeechRecognition7, 1),
      sourceDropdown = _getSpeechRecognition8[0];

  sourceDropdown.addEventListener('change', function (event) {
    var languageCode = event.target.value;
    document.dispatchEvent(new CustomEvent('speechRecognitionLanguageChanged', {
      bubbles: true,
      detail: {
        languageCode: languageCode
      }
    }));
  });
}

window.addEventListener('load', function speechInitializer() {
  var speech = new Speech();
  var mic = document.getElementById('mic');
  mic.addEventListener('click', function micClick(event) {
    if (speech.recognizing) {
      speech.stopSpeechCapture();
      mic.classList.remove('onSpeechCapture');
    } else {
      speech.startSpeechCapture();
      mic.classList.add('onSpeechCapture');
    }
  });
  document.addEventListener('speechRecognitionResult', function (event) {
    var speech = "".concat(event.detail.finalTranscript, ".");
    var speechTextarea = document.getElementById('translateSpeechSrc');
    speechTextarea.innerHTML += speech;
  });
  document.addEventListener('speechRecognitionLanguageChanged', function (event) {
    speech.stopSpeechCapture();
    var speechTextarea = document.getElementById('translateSpeechSrc');
    speechTextarea.innerHTML = '';
    speech.language = event.detail.languageCode;
    mic.classList.remove('onSpeechCapture');
  });
}); // purpose

bindTranslateButtonClickAction();
restrictMaxCharactersinTextarea(); // definition

function bindTranslateButtonClickAction() {
  document.querySelectorAll('.btnTranslate').forEach(function (btnTranslate) {
    btnTranslate.addEventListener('click', function (e) {
      invokeTranslate("".concat(e.target.id));
    });
  });
}

function invokeTranslate(btnTranslate) {
  var source = document.getElementById(btnTranslate).previousElementSibling || document.getElementById(btnTranslate).previousElementSibling.querySelector('textarea');
  var yourText = source.value;
  var destination = document.getElementById(btnTranslate).nextElementSibling || document.getElementById(btnTranslate).nextElementSibling.querySelector('textarea');

  var _document$getElementB = document.getElementById(btnTranslate).closest('section').querySelectorAll('select'),
      _document$getElementB2 = _slicedToArray(_document$getElementB, 2),
      srcLanguage = _document$getElementB2[0],
      destLanguage = _document$getElementB2[1];

  var translateServiceURL = generateTranslateServiceURL(yourText, srcLanguage, destLanguage);
  invokeTranslateService(yourText, translateServiceURL, destination);
}

function generateTranslateServiceURL(yourText, srcLanguage, destLanguage) {
  var url = config.translatorServiceURL;
  url = url.replace('{sl}', mapperSpeechCodeToTranslateCode(srcLanguage.value));
  url = url.replace('{tl}', mapperSpeechCodeToTranslateCode(destLanguage.value));
  url = "".concat(url, "&q=").concat(encodeURI(yourText));
  return url;
}

function invokeTranslateService(yourText, url, destination) {
  destination.value = '';

  if (yourText.trim() === '') {
    return;
  }

  destination.value = 'Translation in progress...';

  try {
    translator(yourText, destination, url, writeTranslationResult);
  } catch (error) {
    destination.value = 'Error';
  }
}

function restrictMaxCharactersinTextarea() {
  document.querySelectorAll('textarea.source').forEach(function (textarea) {
    textarea.addEventListener('input', function (e) {
      var yourText = e.target.value;

      if (yourText.length > 1500) {
        yourText = yourText.substring(0, 1500);
        var positionOfLastFullStop = yourText.lastIndexOf('.');
        yourText = yourText.substring(0, positionOfLastFullStop + 1);
        e.target.value = yourText;
      }
    });
  });
}

function writeTranslationResult(result, destination) {
  destination.value = result;
}

(function transliterate() {
  google.load('elements', '1', {
    packages: 'transliteration'
  });

  function onLoad() {
    var options = {
      sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
      destinationLanguage: [google.elements.transliteration.LanguageCode.MALAYALAM],
      transliterationEnabled: true
    };
    var control = new google.elements.transliteration.TransliterationControl(options);
    control.makeTransliteratable(['transliterate']);
  }

  google.setOnLoadCallback(onLoad);
})(google);