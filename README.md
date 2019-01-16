# cursor-position


[![Download Count](https://img.shields.io/npm/dt/cursor-position.svg?style=flat-square)](http://www.npmjs.com/package/cursor-position)

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
Library has only one function: ```GetCursorPosition(options)```
```js
import GetCursorPosition from 'cursor-position'

document.setEventListener('mousemove', () => {
  const {x, y} = GetCursorPosition()
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
**event** | MouseEvent TouchEvent | No | window.event | Click event
**absolute** | Boolean | No | true | Determine if position must be calculated from body or from parent element
**scroll** | Boolean | No | false | Determine if position must include scroll value

### Response
```
{
  x number
  y number
}
```

## What's new
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
