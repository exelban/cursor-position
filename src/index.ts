type options = {
    event?: Event | MouseEvent | TouchEvent,
    element?: HTMLElement,
    absolute?: boolean,
    visible?: boolean,
}
type cursorPosition = {
    x: number,
    y: number,
}

const isMouseEvent = (e: Event | MouseEvent | TouchEvent): boolean => e instanceof MouseEvent
const isTouchEvent = (e: Event | MouseEvent | TouchEvent): boolean => e instanceof TouchEvent

// if event not provided, function will search event in window
// if element not provided, function will return absolute cursor position
const GetCursorPosition = ({ event, element, absolute, visible }: options): cursorPosition => {
    let x = 0
    let y = 0

    if (!document) throw new Error('document is not defined')
    if (!window) throw new Error('window is not defined')
    if (!event) ({ event } = window)
    if (!event) throw new Error('event is not defined')

    switch (true) {
        case isMouseEvent(event):
            console.log("mouse event")
            break
        case isTouchEvent(event):
            console.log("touch event")
            break
        default:
            console.log("default event")
            break
    }

    // if (event instanceof MouseEvent) {
    //     if (event.pageX || event.pageY) {
    //         x = event.pageX
    //         y = event.pageY
    //     } else if (event.clientX || event.clientY) {
    //         x = event.clientX
    //         y = event.clientY
    //     }
    // } else if (event instanceof TouchEvent) {
    //     if (event.touches) {
    //         x = event.touches[0].clientX
    //         y = event.touches[0].clientY
    //     }
    // } else {
    //     throw new Error('[cursor-pointer]: event type error')
    // }
    //
    // if (document && document.body && document.documentElement) {
    //     x += document.body.scrollLeft + document.documentElement.scrollLeft
    //     y += document.body.scrollTop + document.documentElement.scrollTop
    // }
    //
    // if (element) {
    //     x -= element.offsetLeft
    //     y -= element.offsetTop
    //
    //     if (element.offsetParent) {
    //         let obj: Element | HTMLElement = element.offsetParent
    //         while (obj) {
    //             if (obj instanceof HTMLElement) {
    //                 x -= obj.offsetLeft
    //                 y -= obj.offsetTop
    //                 if (!obj.offsetParent) break
    //                 obj = obj.offsetParent
    //             }
    //         }
    //     }
    // }

    return { x, y }
}

export default GetCursorPosition