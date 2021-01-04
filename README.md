🌌 Universal multi step JavaScript plugin for any purpose.

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

<table>

<thead>
<th>Function signature</th>
<th>Description</th>
</thead>

<tr>
<td>

```ts
prev()
```
</td>
<td>make a step to prev item</td>
</tr>

<tr>
<td>

```ts
next()
```

</td>
<td>make a step to next item</td>
</tr>

<tr>
<td>

```ts
stepTo(index: number)
```

</td>
<td>step to the given index as an argument</td>
</tr>

<tr>
<td>

```ts
getCurrentStep(): { 
    index: number, 
    elem: Element 
}
```

</td>
<td>returns the object with info of current step</td>
</tr>

<tr>
<td>

```ts
freeze(isFrozen: boolean)
```

</td>
<td>disables and prevents from any step change</td>
</tr>

<tr>
<td>

```ts
isFrozen(): boolean
```

</td>
<td>returns boolean - if step change is disabled</td>
</tr>

<tr>
<td>

```ts
setup(container: HTMLElement, opts: Options)
```

</td>
<td>merges default and user options, sets up main steps container, builds progress (if enabled)
and binds click listeners, initializes initial state, dispatches setup events. 
Arguments: container - any valid html element with child elements; opts - see Options
</td>
</tr>

<tr>
<td>

```ts
reset()
```

</td>
<td>resets to the first step, skipping optional validator - validateStepChange</td>
</tr>

<tr>
<td>

```ts
destroy()
```

</td>
<td>wipes out all own properties and its prototype</td>
</tr>

</table>

## Options

<table>
<thead>
<th>Property signature</th>
<th>Description</th>
<th>Default value</th>
</thead>

<tr>
<td>

```ts
startIndex: number
```

</td>
<td>initial step to show after setup</td>
<td>0</td>
</tr>

<tr>
<td>

```ts
className: {
    progressContainer: string, 
    progressItem: string, 
    progressActive: string, 
    stepsContainer: string, 
    stepItem: string, 
    stepActive: string, 
}
```

</td>
<td>class names applied to elements</td>
<td>

```js
className: {
    progressContainer: 'stepper-progress',
    progressItem: 'stepper-progress-item',
    progressActive: 'is-active',
    stepsContainer: 'stepper',
    stepItem: 'stepper-item',
    stepActive: 'is-active'
}
```

</td>
</tr>

<tr>
<td>

```ts
progress: boolean | { 
    container?: Element, 
    navEnabled?: boolean 
}
```

</td>
<td>Boolean or object - indicating that progress is enabled. Object can have properties - 

`container:` target element into which progress html will be inserted (note: any child elements will be replaced); 
`navEnabled:` is step change enabled by clicking on progress item
</td>
<td>undefined</td>
</tr>

<tr>
<td>

```ts
cache: boolean
```

</td>
<td>whether to save intermediate state to localStorage</td>
<td>false</td>
</tr>

<tr>
<td>

```ts
urlParam: string | boolean
```

</td>
<td>whether step can be opened by url param.

`string` value is the name of url param `&name=`.
Param value  `&name=0` is index of step.
**Important:** param value has higher priority then cache.

</td>
<td>undefined</td>
</tr>

<tr>
<td>

```ts
validateStepChange: (
    prev: { index: number, elem: Element }, 
    next: { index: number, elem: Element }
) => boolean;
```

</td>
<td>
Custom validator function, that will be run before every step change, 

**except**: reset() and initial step change by urlParam.

Positive (true) boolean value will indicate - that step change is allowed.
</td>
<td>undefined</td>
</tr>


</table>