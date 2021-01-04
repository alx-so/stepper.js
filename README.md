🌌 Universal multi step JavaScript plugin for any purpose.

[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/loryjs/lory/master/LICENSE)

## Download

Stepper.js is released under the MIT license & supports modern environments.

## Basic usage

```html
<div class="container">
    <div>a</div>
    <div>b</div>
    <div>c</div>
    <div>d</div>
</div>

<button class="prev">prev</button>
<button class="next">next</button>

<script src="dist/stepper.min.js"></script>
```

```js
var stepper = new Stepper(document.querySelector('.container'), {
    cache: true,
    progress: { navEnabled: true }
});

document.querySelector('.prev').addEventListener('click', function() {
    stepper.prev();
});

document.querySelector('.next').addEventListener('click', function() {
    stepper.next();
});
```