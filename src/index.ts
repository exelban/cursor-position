interface options {
    event?: Event | MouseEvent | TouchEvent,
    absolute?: boolean,
}

type cursorPosition = {
    x: number,
    y: number,
}

// if event not provided, function will search event in window
// if element not provided, function will return cursor position from body
// if absolute is false, function will return cursor position from parent element
const GetCursorPosition = (opt?: options): cursorPosition => {
    if (!document) throw new Error('document is not defined')
    if (!window) throw new Error('window is not defined')

    let absolute: boolean = true
    let x: number = 0
    let y: number = 0
    let event = window.event || undefined

    if (opt) {
        event = opt.event
        absolute = opt.absolute || true
    }

    if (!event) throw new Error('event is not defined')

    if (event instanceof MouseEvent) {
        x = event.clientX
        y = event.clientY
    }
    if (event instanceof TouchEvent) {
        if (!event.touches[0]) {
            throw new Error('touch is not find')
        }
        x = event.touches[0].clientX
        y = event.touches[0].clientY
    }

    if (absolute) {
        x += window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
        y += window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    }

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
