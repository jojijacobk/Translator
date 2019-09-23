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
  maxCharactersPerTranslation: 1500,
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
  translatorSerivceProvider: 'https://translate.googleapis.com',
  // corsApiHost: 'cors-anywhere.herokuapp.com/',
  corsProxyURL: 'https://corslb-861327797.us-east-1.elb.amazonaws.com/',
  shouldRouteThroughCorsProxy: false
};

function translator(yourText, destination, url, callback, idBtnTranslate) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(url);

  if (targetOrigin[0] !== config.translatorSerivceProvider) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }

  xhr.onreadystatechange = function onreadystatechange() {
    if (xhr.readyState === 4) {
      var result = '';

      try {
        var translation = JSON.parse(xhr.responseText);
        var numOfSentences = translation[0].length;

        for (var iteration = 0; iteration < numOfSentences; iteration++) {
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
  var open = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function customOpen() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);

    if (targetOrigin[0] === config.translatorSerivceProvider && config.shouldRouteThroughCorsProxy) {
      args[1] = config.corsProxyURL + args[1];
    }

    return open.apply(this, args);
  };
})();

function Speech() {
  var _this = this;

  if ('webkitSpeechRecognition' in window) {
    console.assert(this.constructor.name, 'Speech', 'Error: this is not Speech');
    console.dir(this);
    this.recognition = new webkitSpeechRecognition();
    console.log('webkitSpeechRecognition is available.'); // custom settings

    this.recognizing = false;
    this.finalTranscript = '';
    this.interimTranscript = ''; // speech recognition settings

    this.recognition.continuous = true;
    this.language = config.speechTranslator.defaultSrcLang.code;

    this.startSpeechCapture = function () {
      console.assert(_this.constructor.name === 'Speech', 'Expected Speech object but "this" failed ');
      console.log('startSpeechCapture');

      if (_this.recognizing) {
        _this.recognition.stop();

        _this.recognizing = false;
      }

      console.log("initiate language change from - ".concat(_this.recognition.lang, " to ").concat(_this.language));
      _this.recognition.lang = _this.language;

      _this.recognition.start();

      _this.recognizing = true;
    };

    this.stopSpeechCapture = function () {
      console.assert(_this.constructor.name === 'Speech', 'Expected Speech object but "this" failed ');
      console.dir(_this);
      console.log('stopSpeechCapture');
      _this.recognizing = false;

      _this.recognition.stop();
    };

    this.recognition.onstart = function () {
      console.assert(_this.constructor.name === 'Speech', 'Expected Speech object but "this" failed ');
      console.dir(_this);
      console.log('Started...');
    };

    this.recognition.onend = function (event) {
      console.assert(_this.constructor.name === 'Speech', 'Expected Speech object but "this" failed ');
      console.dir(_this); // if recognition is ended because of idle time, resume recognition. We want to end recognition only if it is explicitly stopped by user.

      console.log('end...');
      console.log("this.recognizing - ".concat(_this.recognizing));

      if (_this.recognizing) {
        _this.recognition.start();
      }
    };

    this.recognition.onresult = function (event) {
      console.assert(_this.constructor.name === 'Speech', 'Expected Speech object but "this" failed ');
      console.log('result');

      if (_typeof(event.results) === undefined) {
        console.log('Undefined results'); // this.stopSpeechCapture();

        return;
      }

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          _this.finalTranscript = event.results[i][0].transcript;
        }
      }

      _this.finalTranscript = function (transcript) {
        if (transcript === undefined || transcript === '') {
          return '';
        }

        var firstChar = /\S/;
        return transcript.replace(firstChar, function capitalize(match) {
          return match.toUpperCase();
        });
      }(_this.finalTranscript);

      document.dispatchEvent(new CustomEvent('speechRecognitionResult', {
        bubbles: true,
        detail: {
          finalTranscript: _this.finalTranscript
        }
      }));
    };

    this.recognition.onerror = function (event) {
      console.log(event.error);
    };
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
  var menuItems = document.querySelectorAll('.nav a');
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
}

$('.menu-toggle').click(function () {
  $('ul.nav').toggleClass('opening');
  $(this).toggleClass('open');
}); // purpose

fillLanguagesDropdown();
setDefaultLanguageInDropdown();
bindResizeOnDropwdownChange(); // definition

function fillLanguagesDropdown() {
  var _getTextLanguagesDrop = getTextLanguagesDropdowns(),
      _getTextLanguagesDrop2 = _slicedToArray(_getTextLanguagesDrop, 2),
      sourceDropdown = _getTextLanguagesDrop2[0],
      destinationDropdown = _getTextLanguagesDrop2[1];

  var languagesList = "\n<optgroup>\n    <option value=\"af\">Afrikaans</option>\n    <option value=\"sq\">Albanian</option>\n    <option value=\"am\">\u12A0\u121B\u122D\u129B</option>\n    <option value=\"ar\">Arabic</option>\n    <option value=\"hy\">\u0540\u0561\u0575\u0565\u0580\u0565\u0576</option>\n    <option value=\"az\">Azerbaijani</option>\n    <option value=\"eu\">Basque</option>\n    <option value=\"be\">Belarusian</option>\n    <option value=\"bn\">\u09AC\u09BE\u0982\u09B2\u09BE</option>\n    <option value=\"bs\">Bosnian</option>\n    <option value=\"bg\">\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438</option>\n    <option value=\"ca\">Catal\xE0</option>\n    <option value=\"ceb\">Cebuano</option>\n    <option value=\"ny\">Chichewa</option>\n    <option value=\"zh-CN\">Chinese (Simplified)</option>\n    <option value=\"zh-TW\">Chinese (Traditional)</option>\n    <option value=\"co\">Corsican</option>\n    <option value=\"hr\">Croatian</option>\n    <option value=\"cs\">\u010Ce\u0161tina</option>\n    <option value=\"da\">Dansk</option>\n    <option value=\"nl\">Dutch</option>\n    <option value=\"en\">English</option>\n    <option value=\"eo\">Esperanto</option>\n    <option value=\"et\">Estonian</option>\n    <option value=\"tl\">Filipino</option>\n    <option value=\"fi\">Finnish</option>\n    <option value=\"fr\">French</option>\n    <option value=\"fy\">Frisian</option>\n    <option value=\"gl\">Galician</option>\n    <option value=\"ka\">\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8</option>\n    <option value=\"de\">German</option>\n    <option value=\"el\">Greek</option>\n    <option value=\"gu\">\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0</option>\n    <option value=\"ht\">Haitian Creole</option>\n    <option value=\"ha\">Hausa</option>\n    <option value=\"haw\">Hawaiian</option>\n    <option value=\"iw\">Hebrew</option>\n    <option value=\"hi\">\u0939\u093F\u0928\u094D\u0926\u0940</option>\n    <option value=\"hmn\">Hmong</option>\n    <option value=\"hu\">Hungarian</option>\n    <option value=\"is\">\xCDslenska</option>\n    <option value=\"ig\">Igbo</option>\n    <option value=\"id\">Indonesian</option>\n    <option value=\"ga\">Irish</option>\n    <option value=\"it\">Italiano</option>\n    <option value=\"ja\">\u65E5\u672C\u8A9E</option>\n    <option value=\"jw\">Javanese</option>\n    <option value=\"kn\">\u0C95\u0CA8\u0CCD\u0CA8\u0CA1</option>\n    <option value=\"kk\">Kazakh</option>\n    <option value=\"km\">\u1797\u17B6\u179F\u17B6\u1781\u17D2\u1798\u17C2\u179A</option>\n    <option value=\"ko\">\uD55C\uAD6D\uC5B4</option>\n    <option value=\"ku\">Kurdish (Kurmanji)</option>\n    <option value=\"ky\">Kyrgyz</option>\n    <option value=\"lo\">\u0EA5\u0EB2\u0EA7</option>\n    <option value=\"la\">Latin</option>\n    <option value=\"lv\">Latvie\u0161u</option>\n    <option value=\"lt\">Lietuvi\u0173</option>\n    <option value=\"lb\">Luxembourgish</option>\n    <option value=\"mk\">Macedonian</option>\n    <option value=\"mg\">Malagasy</option>\n    <option value=\"ms\">Bahasa Melayu</option>\n    <option value=\"ml\">\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02</option>\n    <option value=\"mt\">Maltese</option>\n    <option value=\"mi\">Maori</option>\n    <option value=\"mr\">\u092E\u0930\u093E\u0920\u0940</option>\n    <option value=\"mn\">Mongolian</option>\n    <option value=\"my\">Myanmar (Burmese)</option>\n    <option value=\"ne\">\u0928\u0947\u092A\u093E\u0932\u0940 \u092D\u093E\u0937\u093E</option>\n    <option value=\"no\">Norwegian</option>\n    <option value=\"ps\">Pashto</option>\n    <option value=\"fa\">Persian</option>\n    <option value=\"pl\">Polski</option>\n    <option value=\"pt\">Portugu\xEAs</option>\n    <option value=\"pa\">Punjabi</option>\n    <option value=\"ro\">Rom\xE2n\u0103</option>\n    <option value=\"ru\">P\u0443\u0441\u0441\u043A\u0438\u0439</option>\n    <option value=\"sm\">Samoan</option>\n    <option value=\"gd\">Scots Gaelic</option>\n    <option value=\"sr\">Serbian</option>\n    <option value=\"st\">Sesotho</option>\n    <option value=\"sn\">Shona</option>\n    <option value=\"sd\">Sindhi</option>\n    <option value=\"si\">\u0DC3\u0DD2\u0D82\u0DC4\u0DBD</option>\n    <option value=\"sk\">Sloven\u010Dina</option>\n    <option value=\"sl\">Sloven\u0161\u010Dina</option>\n    <option value=\"so\">Somali</option>\n    <option value=\"es\">Espa\xF1ol</option>\n    <option value=\"su\">Basa Sunda</option>\n    <option value=\"sw\">Kiswahili</option>\n    <option value=\"sv\">Svenska</option>\n    <option value=\"tg\">Tajik</option>\n    <option value=\"ta\">\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD</option>\n    <option value=\"te\">\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41</option>\n    <option value=\"th\">\u0E20\u0E32\u0E29\u0E32\u0E44\u0E17\u0E22</option>\n    <option value=\"tr\">T\xFCrk\xE7e</option>\n    <option value=\"uk\">\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430</option>\n    <option value=\"ur\">\u067E\u0627\u06A9\u0633\u062A\u0627\u0646</option>\n    <option value=\"uz\">Uzbek</option>\n    <option value=\"vi\">Ti\u1EBFng Vi\u1EC7t</option>\n    <option value=\"cy\">Welsh</option>\n    <option value=\"xh\">Xhosa</option>\n    <option value=\"yi\">Yiddish</option>\n    <option value=\"yo\">Yoruba</option>\n    <option value=\"zu\">IsiZulu</option>\n    </optgroup>\n";
  sourceDropdown.innerHTML = languagesList;
  destinationDropdown.innerHTML = languagesList;
}

function getTextLanguagesDropdowns() {
  return [document.querySelector('#translateTxtSrcLanguagesList'), document.querySelector('#translateTxtDestLanguagesList')];
}

function setDefaultLanguageInDropdown() {
  var _getTextLanguagesDrop3 = getTextLanguagesDropdowns(),
      _getTextLanguagesDrop4 = _slicedToArray(_getTextLanguagesDrop3, 2),
      sourceDropdown = _getTextLanguagesDrop4[0],
      destinationDropdown = _getTextLanguagesDrop4[1];

  sourceDropdown.value = config.txtTranslator.defaultSrcLang.code;
  resizeElement(sourceDropdown, sourceDropdown.options[sourceDropdown.selectedIndex].text.length);
  destinationDropdown.value = config.txtTranslator.defaultDestLang.code;
  resizeElement(destinationDropdown, destinationDropdown.options[destinationDropdown.selectedIndex].text.length);
}

function resizeElement(dropdown, length) {
  length += 1;
  dropdown.style.width = "".concat(length, "rem");
}

function bindResizeOnDropwdownChange() {
  var _getTextLanguagesDrop5 = getTextLanguagesDropdowns(),
      _getTextLanguagesDrop6 = _slicedToArray(_getTextLanguagesDrop5, 2),
      sourceDropdown = _getTextLanguagesDrop6[0],
      destinationDropdown = _getTextLanguagesDrop6[1];

  var handler = function handler(event) {
    var language = event.target.options[event.target.selectedIndex].text;
    resizeElement(event.target, language.length);
  };

  sourceDropdown.addEventListener('change', handler);
  destinationDropdown.addEventListener('change', handler);
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

  var handler = function handler(event) {
    var language = event.target.options[event.target.selectedIndex].text;
    resizeElement(event.target, language.length);
  };

  sourceDropdown.addEventListener('change', handler);
  destinationDropdown.addEventListener('change', handler);
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
    var textNode = document.createTextNode(speech);
    speechTextarea.appendChild(textNode);
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
      if (e.target.nodeName !== 'BUTTON') return;
      invokeTranslate("".concat(e.target.id));
    });
  });
}

function invokeTranslate(idBtnTranslate) {
  console.log("btnTranslate id - ".concat(idBtnTranslate));
  var source = document.getElementById(idBtnTranslate).previousElementSibling.querySelector('.content');
  var yourText = source.textContent.trim();

  if (yourText === '') {
    return;
  }

  spinningWheel(idBtnTranslate, true);
  var destination = document.getElementById(idBtnTranslate).nextElementSibling.querySelector('.content');

  var _document$getElementB = document.getElementById(idBtnTranslate).closest('section').querySelectorAll('select'),
      _document$getElementB2 = _slicedToArray(_document$getElementB, 2),
      srcLanguage = _document$getElementB2[0],
      destLanguage = _document$getElementB2[1];

  var translateServiceURL = generateTranslateServiceURL(yourText, srcLanguage, destLanguage);
  invokeTranslateService(yourText, translateServiceURL, destination, idBtnTranslate);
}

function generateTranslateServiceURL(yourText, srcLanguage, destLanguage) {
  var url = config.translatorServiceURL;
  url = url.replace('{sl}', mapperSpeechCodeToTranslateCode(srcLanguage.value));
  url = url.replace('{tl}', mapperSpeechCodeToTranslateCode(destLanguage.value));
  url = "".concat(url, "&q=").concat(encodeURI(yourText));
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
  document.querySelectorAll('.content.source').forEach(function (textarea) {
    textarea.addEventListener('input', function (e) {
      var yourText = e.target.textContent;

      if (yourText.length > config.maxCharactersPerTranslation) {
        yourText = yourText.substring(0, config.maxCharactersPerTranslation);
        var positionOfLastFullStop = yourText.lastIndexOf('.');
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
  var wheel = document.getElementById('spinningWheel');
  var btnTranslate = document.getElementById(idBtnTranslate);

  if (show) {
    wheel.classList.remove('hide');
    btnTranslate.disabled = true;
  } else {
    wheel.classList.add('hide');
    btnTranslate.disabled = false;
  }
}

document.querySelectorAll('[contenteditable]').forEach(function (textarea) {
  textarea.addEventListener('paste', function (e) {
    var clipboardData;
    var pastedData; // Stop data actually being pasted into div

    e.stopPropagation();
    e.preventDefault(); // Get pasted data via clipboard API

    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    textarea.textContent += pastedData;
  });
});

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