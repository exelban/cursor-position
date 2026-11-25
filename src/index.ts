interface options {
    event?: Event,
    absolute?: boolean,
    scroll?: boolean,
}

type cursorPosition = {
    x: number,
    y: number,
}

const GetCursorPosition = (opt: options = {}): cursorPosition => {
    if (typeof document === 'undefined') throw new Error('document is not defined')
    if (typeof window === 'undefined') throw new Error('window is not defined')

    const { event = window.event, absolute = true, scroll = false } = opt
    if (!event) throw new Error('event is not defined')

    let point: MouseEvent | Touch = event as MouseEvent
    if ('touches' in event) {
        const touchEvent = event as TouchEvent
        const ended = touchEvent.type === 'touchend' || touchEvent.type === 'touchcancel'
        const touches = ended ? touchEvent.changedTouches : touchEvent.touches
        if (!touches || !touches[0]) throw new Error('touch is not defined')
        point = touches[0]
    }

    let { clientX: x, clientY: y } = point
    if (typeof x !== 'number' || typeof y !== 'number') throw new Error('event has no cursor coordinates')

    if (!absolute) {
        const element = event.target as Element | null
        if (!element || typeof element.getBoundingClientRect !== 'function') throw new Error('target element is not defined')

        const rect = element.getBoundingClientRect()
        x -= rect.left
        y -= rect.top
        if (scroll) {
            x += element.scrollLeft
            y += element.scrollTop
        }
    }
    else if (scroll) {
        const view = (event as UIEvent).view || window
        const doc = view.document
        x += view.pageXOffset || doc.documentElement.scrollLeft || doc.body.scrollLeft || 0
        y += view.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop || 0
    }

    return { x, y }
}

export default GetCursorPosition
