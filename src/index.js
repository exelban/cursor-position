// @flow

type options = {
  event?: MouseEvent,
  element?: HTMLElement,
}
type response = {
  x: number,
  y: number,
}

const GetCursorPosition = ({ event, element }: options): response => {
  if (!window || !document) throw new Error('[Cursor-pointer] window or document not defined')
  if (!event) ({ event } = window)

  let x = 0
  let y = 0

  if (event.pageX || event.pageY) {
    x = event.pageX
    y = event.pageY
  } else if (event.clientX || event.clientY) {
    x = event.clientX
    y = event.clientY
  } else if (event.touches) {
    x = event.touches[0].clientX
    y = event.touches[0].clientY
  }

  if (document && document.body && document.documentElement) {
    x += document.body.scrollLeft + document.documentElement.scrollLeft
    y += document.body.scrollTop + document.documentElement.scrollTop
  }

  if (element) {
    x -= element.offsetLeft
    y -= element.offsetTop

    if (element.offsetParent) {
      // $FlowFixMe
      let obj: HTMLElement = element.offsetParent
      while (obj) {
        x -= obj.offsetLeft
        y -= obj.offsetTop
        if (!obj.offsetParent) break
        obj = obj.offsetParent
      }
    }
  }

  return {
    x,
    y,
  }
}

export default GetCursorPosition
