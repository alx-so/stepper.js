🌌 Universal and lightweight JavaScript plugin for creating multi step UI.
 
[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/alx-so/stepper.js/blob/master/LICENSE)

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

## Public API

```js
/**
 * Make a step to prev item
 */
prev();


/**
 * Make a step to next item
 */
next();


/**
 * Step to the given index
 * 
 * @param {number} index
 */
stepTo(1);


/**
 * Get current step info
 * 
 * @return {{index: number, elem: Element}}
 */
getCurrentStep();


/**
 * Disables and prevents from any step change
 * 
 * @param {boolean} isFrozen
 */
freeze(true);


/**
 * Check if step change is disabled
 * 
 * @return {boolean}
 */
isFrozen();


/**
 * Merges default and user options, sets up main steps container, builds progress (if enabled)
 * and binds click listeners, initializes initial state, dispatches setup events.
 * 
 * @param {Element} container
 * @param {Options} opts - see Options description
 */
setup(document.querySelector('.container'), {});


/**
 * Resets to the first step, skipping optional validator - validateStepChange
 */
reset();


/**
 * wipes out all own properties and its prototype
 */
destroy();
```

## Options

```js
let opts = {
    // initial step to show after setup
    startIndex: 0,

    // class names applied to elements
    className: {
        progressContainer: 'stepper-progress',
        progressItem: 'stepper-progress-item',
        progressActive: 'is-active',
        stepsContainer: 'stepper',
        stepItem: 'stepper-item',
        stepActive: 'is-active'
    },

    // Boolean | Object - indicating that progress is enabled.
    progress: {
        // target element for progress to use.
        // 1. If not supplied => element will be created and inserted before steps container
        // 2. If supplied => it will create and insert simple 1,2,3...
        // 3. If supplied and has children => will use your custom elements
        container: document.querySelector('.progress'),
        
        // is step change enabled by clicking on progress item
        navEnabled: true
    },

    // Whether to save intermediate state
    cache: true,

    // String | boolean - whether step can be opened by url param. string value is the name of url param &name=.
    // Param value &name=0 is index of step.
    // !!! Important: param value has higher priority then cache.
    urlParam: true,

    // Custom validator function, that will be run before every step change, 
    // except: reset() and initial step change by urlParam.
    // Boolean (true) value will indicate - that next step is valid and can be changed.
    validateStepChange: function (prev, next) {
        // @param {{ index: number, elem: Element }} prev | next

        return next.index === 1;
    }
};

new Stepper(document.querySelector('.container'), opts);
```

## Events

<table>
    <tr>
        <td>
            stepper.before.setup
        </td>
        <td>
            fires just before the setup is started - on instance creation or calling setup() method
        </td>
    </tr>
    <tr>
        <td>
            stepper.after.setup
        </td>
        <td>
            fires right after setup is done - on instance creation or calling setup() method
        </td>
    </tr>
    <tr>
        <td>
            stepper.before.destroy
        </td>
        <td>
            fires right before destroy() began
        </td>
    </tr>
    <tr>
        <td>
            stepper.after.destroy
        </td>
        <td>
            fires right after destroy() done
        </td>
    </tr>
    <tr>
        <td>
            stepper.before.reset
        </td>
        <td>
            fires right before reset() began
        </td>
    </tr>
    <tr>
        <td>
            stepper.after.reset
        </td>
        <td>
            fires right after reset() done
        </td>
    </tr>
    <tr>
        <td>
            stepper.before.change
        </td>
        <td>
            fires before any step change performed and optional validateStepChange() called.<br>
            Detail args: prevStep, nextStep
        </td>
    </tr>
    <tr>
        <td>
            stepper.after.change
        </td>
        <td>
            fires after step change performed successfully.<br>
            Detail args: prevStep, nextStep
        </td>
    </tr>
</table>
