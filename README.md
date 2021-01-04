🌌 Universal multi step JavaScript plugin for any purpose.

[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/loryjs/lory/master/LICENSE)

## Download

Stepper.js is released under the MIT license & supports modern environments.

## Use it simply in your browser:

```js
var stepper = new Stepper(document.querySelector('.container'), {
    cache: true,
    urlParam: false,
    progress: true
});

document.querySelector('.prev').addEventListener('click', function() {
    stepper.prev();
});

document.querySelector('.next').addEventListener('click', function() {
    stepper.next();
});
```