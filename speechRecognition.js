"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    document.querySelector('[data-section="translateSpeech"] article').remove();
    document.querySelector('[data-section="translateSpeech"] .micContainer').remove();
    document.querySelector('[data-section="translateSpeech"] .message').textContent = 'Please use latest Chrome browser to use speech recognition feature';
  }
}