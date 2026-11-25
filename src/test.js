const { beforeEach, describe, it } = require('node:test')
const assert = require('node:assert/strict')
const { JSDOM } = require('jsdom')
const GetCursorPosition = require('..').default

let mouseEvent
let target

beforeEach(function() {
    const { window } = new JSDOM('<!doctype html><html><body><div><div><div id="target"></div></div></div></body></html>')
    global.document = window.document
    global.window = window
    target = document.getElementById('target')
    mouseEvent = new window.MouseEvent('click', { clientX: 201, clientY: 202 })
})

describe('initialization', function() {
    it('document is not defined', () => {
        delete global.document
        assert.throws(() => GetCursorPosition(), { message: 'document is not defined' })
    })

    it('window is not defined', () => {
        delete global.window
        assert.throws(() => GetCursorPosition(), { message: 'window is not defined' })
    })

    it('event is not defined', () => {
        assert.throws(() => GetCursorPosition(), { message: 'event is not defined' })
    })

    it('rejects events without coordinates', () => {
        const event = new global.window.Event('change')
        assert.throws(() => GetCursorPosition({ event }), { message: 'event has no cursor coordinates' })
    })

    it('uses window.event when the event option is omitted', () => {
        global.window.event = mouseEvent
        assert.deepEqual(GetCursorPosition(), { x: 201, y: 202 })
    })
})

describe('absolute coordinates', function() {
    it('uses viewport coordinates by default', () => {
        assert.deepEqual(GetCursorPosition({ event: mouseEvent }), { x: 201, y: 202 })
    })

    it('includes the page scroll', () => {
        global.window.pageXOffset = 400
        global.window.pageYOffset = 500
        assert.deepEqual(GetCursorPosition({ event: mouseEvent, scroll: true }), { x: 601, y: 702 })
    })

    it('falls back to the document element scroll', () => {
        document.documentElement.scrollLeft = 400
        document.documentElement.scrollTop = 500
        assert.deepEqual(GetCursorPosition({ event: mouseEvent, scroll: true }), { x: 601, y: 702 })
    })

    it('falls back to the body scroll', () => {
        document.body.scrollLeft = 400
        document.body.scrollTop = 500
        assert.deepEqual(GetCursorPosition({ event: mouseEvent, scroll: true }), { x: 601, y: 702 })
    })
})

describe('target coordinates', function() {
    it('uses the displayed target rectangle inside nested scrollers', () => {
        const parent = target.parentElement
        parent.scrollLeft = 40
        parent.parentElement.scrollTop = 50
        Object.defineProperty(parent, 'offsetLeft', { value: 100 })
        Object.defineProperty(target, 'offsetLeft', { value: 230 })
        Object.defineProperty(target, 'getBoundingClientRect', {
            value: () => ({ left: 230 - parent.scrollLeft, top: 240 - parent.parentElement.scrollTop })
        })
        target.scrollLeft = 7
        target.scrollTop = 8
        target.dispatchEvent(mouseEvent)

        assert.deepEqual(GetCursorPosition({ event: mouseEvent, absolute: false }), { x: 11, y: 12 })
        assert.deepEqual(GetCursorPosition({ event: mouseEvent, absolute: false, scroll: true }), { x: 18, y: 20 })
    })

    it('handles HTML elements inside SVG foreignObject', () => {
        document.body.innerHTML = '<svg><foreignObject><div></div></foreignObject></svg>'
        const element = document.querySelector('foreignObject div')
        Object.defineProperty(element, 'getBoundingClientRect', { value: () => ({ left: 101, top: 102 }) })
        element.dispatchEvent(mouseEvent)
        assert.deepEqual(GetCursorPosition({ event: mouseEvent, absolute: false }), { x: 100, y: 100 })
    })

    it('requires an element target', () => {
        assert.throws(() => GetCursorPosition({ event: mouseEvent, absolute: false }), { message: 'target element is not defined' })
    })
})

describe('touch coordinates', function() {
    const active = { clientX: 401, clientY: 402 }
    const ended = { clientX: 501, clientY: 502 }

    it('uses the first active touch during movement', () => {
        const event = new global.window.TouchEvent('touchmove', { touches: [active, ended] })
        assert.deepEqual(GetCursorPosition({ event }), { x: 401, y: 402 })
    })

    it('uses the final released touch', () => {
        const event = new global.window.TouchEvent('touchend', { changedTouches: [ended] })
        assert.deepEqual(GetCursorPosition({ event }), { x: 501, y: 502 })
    })

    it('uses the cancelled touch when another contact remains', () => {
        const event = new global.window.TouchEvent('touchcancel', { touches: [active], changedTouches: [ended] })
        assert.deepEqual(GetCursorPosition({ event }), { x: 501, y: 502 })
    })

    it('rejects a missing touch', () => {
        const event = new global.window.TouchEvent('touchmove')
        assert.throws(() => GetCursorPosition({ event }), { message: 'touch is not defined' })
    })
})
