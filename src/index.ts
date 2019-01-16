interface options {
    event?: Event | MouseEvent | TouchEvent,
    absolute?: boolean,
    scroll?: boolean,
}

type cursorPosition = {
    x: number,
    y: number,
}

function isTouchEvent(event: any): boolean {
    if ((window as any).TouchEvent !== undefined) {
        return event instanceof TouchEvent
    }
    return event.touches !== undefined
}

const GetCursorPosition = (opt?: options): cursorPosition => {
    if (!document) throw new Error('document is not defined')
    if (!window) throw new Error('window is not defined')

    let absolute: boolean = true
    let scroll: boolean = false
    let x: number = 0
    let y: number = 0
    let event = window.event || undefined
    let element = undefined

    if (opt) {
        if (opt.event !== undefined) event = opt.event
        if (opt.absolute !== undefined) absolute = opt.absolute
        if (opt.scroll !== undefined) scroll = opt.scroll
    }

    if (!event) throw new Error('event is not defined')
    const touches: TouchList = (event as TouchEvent).touches

    if (event instanceof MouseEvent) {
        x = event.clientX
        y = event.clientY
    }
    if (isTouchEvent(event) && touches) {
        if (!touches[0]) {
            throw new Error('touch is not find')
        }
        x = touches[0].clientX
        y = touches[0].clientY
    }

    if (absolute && scroll) {
        x += window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
        y += window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    }
    else if (!absolute && scroll) {
        if (!event.target) throw new Error('target is not defined')
        element = event!.target!

        if (element instanceof Element && element instanceof HTMLElement) {
            x -= element.offsetLeft
            y -= element.offsetTop
            if (element.parentElement) {
                let obj = element.parentElement
                while (obj) {
                    if (obj instanceof HTMLElement) {
                        x -= obj.offsetLeft
                        y -= obj.offsetTop
                        if (!obj.parentElement) break
                        obj = obj.parentElement
                    }
                }
            }

            if (element.parentElement) {
                let obj: Element | HTMLElement = element.parentElement
                while (obj) {
                    if (obj instanceof HTMLElement) {
                        x += obj.scrollLeft
                        y += obj.scrollTop
                        if (obj.scrollLeft || obj.scrollTop || !obj.parentElement) break
                        obj = obj.parentElement
                    }
                }
            }
        }
    }
    else if (!absolute && !scroll){
        if (!event.target) throw new Error('target is not defined')
        element = event!.target!

        if (element instanceof Element && element instanceof HTMLElement) {
            x -= element.offsetLeft
            y -= element.offsetTop
            if (element.parentElement) {
                let obj = element.parentElement
                while (obj) {
                    if (obj instanceof HTMLElement) {
                        x -= obj.offsetLeft
                        y -= obj.offsetTop
                        if (!obj.parentElement) break
                        obj = obj.parentElement
                    }
                }
            }
        }
    }

    return { x, y }
}

export default GetCursorPosition
