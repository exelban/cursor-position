# cursor-position


[![Download Count](https://img.shields.io/npm/dt/cursor-position.svg?style=flat-square)](http://www.npmjs.com/package/cursor-position)

[![Demo image](https://s3.eu-central-1.amazonaws.com/serhiy/Github_repo/cursor-position/cursor-position.png)](https://exelban.github.io/cursor-position)

Simple module for getting click/touch position in element or window.


## Install
```sh
yarn add cursor-position
```  
Or with npm:  
```sh
npm install cursor-position --save
```

## Usage
Library has only one function: ```GetCursorPosition(options)```
```js
import GetCursorPosition from 'cursor-position'

document.addEventListener('mousemove', (event) => {
  const {x, y} = GetCursorPosition({ event })
  console.log(x, y)
})
```

### Options
```
{
    event?: MouseEvent | TouchEvent
    absolute?: boolean
    scroll?: boolean
}
```
**Name** | **Type** | **Required** | **Default** | **Description**
--- | --- | --- | --- | ---
**event** | MouseEvent or TouchEvent | No | window.event | Event carrying the cursor coordinates
**absolute** | Boolean | No | true | Use the viewport or page as the origin. Set to false to use the event target element.
**scroll** | Boolean | No | false | Include the scroll offset for the selected origin.

**absolute** | **scroll** | **Coordinates**
--- | --- | ---
true | false | From the top-left of the viewport
true | true | From the top-left of the page
false | false | From the top-left of the target's bounding rectangle in the viewport
false | true | From the same rectangle, plus the target's own horizontal and vertical scroll offsets

Both target-relative modes account for page and ancestor scrolling through the bounding rectangle. For touch events, the first active touch supplies the coordinates. For `touchend` and `touchcancel`, the first changed touch supplies them.

### Response
```
{
  x number
  y number
}
```

## Development
Use Node.js 20 or later to run the tests. Run `npm install`, then `npm test` to build the library and test its package entry point.

## What's new
### v2.0.0 (BREAKING CHANGES)
    - target-relative coordinates use the target's bounding rectangle. Enabling scroll also adds the target's own scroll offsets.
    - events without cursor coordinates throw an error. Target-relative mode requires an element target.
    - touchend and touchcancel use the first changed touch.

### v1.0.1
    - package.json fixed
    
### v1.0.0 (BREAKING CHANGES)
    - rewrited library in typescript
    - removed eslint
    - removed @flow
    - changed options
    - added some tests (in progress)
    
### v0.0.3
    - first release

## License
[Apache License 2.0](https://github.com/exelban/cursor-position/blob/master/LICENSE)
