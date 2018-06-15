# cursor-position

[![Download Count](https://img.shields.io/npm/dm/cursor-position.svg?style=flat-square)](http://www.npmjs.com/package/cursor-position)

[![Demo image](https://s3.eu-central-1.amazonaws.com/serhiy/Github_repo/cursor-position/cursor-position.png)](https://exelban.github.io/cursor-position)

Simple module for getting the current mouse position in element or window.


## Install
```sh
yarn add cursor-position
```  
Or with npm:  
```sh
npm install cursor-position --save
```

## Usage
Script has only one function: ```GetCursorPosition(options)```.  
```js
import GetCursorPosition from 'cursor-position'

document.setEventListener('mousemove', (e) => {
  const {x, y} = GetCursorPosition({
    event: e
  })
  console.log(x, y)
})
```

### Options
```
{
  event MouseEvent
  element Node
}
```
**Name** | **Type** | **Description** | **Usage**
--- | --- | --- | ---
**event** | **MouseEvent** | **Mouse event with contains cursor position** | **If event not provided scritp will take event object from window.**
**element** | **Node** | **HTML node element** | **Normally script will return absolute position of mouse in window. But if You want to get mouse position in specific element, just push this component to this option.**


## What's new
### v0.0.1
    - first release;

## License
[Apache License 2.0](https://github.com/exelban/cursor-position/blob/master/LICENSE)
