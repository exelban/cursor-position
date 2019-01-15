import GetCursorPosition from './index'
import 'mocha'
import { expect } from 'chai'
import { JSDOM } from 'jsdom'

declare var global: any

const { window } = new JSDOM('<!doctype html><html><body><div id="mockElement"></div></body></html>')
const div = window.document.getElementById("mockElement")!
let mouseEvent: any = undefined
let touchEvent: any = undefined

const setDOM = () => {
    global.document = window.document
    global.window = document.defaultView
    global.MouseEvent = window.MouseEvent
    global.TouchEvent = window.TouchEvent

    Object.defineProperty(global.window, "pageYOffset", {
        value: 0,
        writable: true
    })

    mouseEvent = new global.window.MouseEvent('click', {
        view: window,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true,
        screenX: 101,
        screenY: 102,
        clientX: 201,
        clientY: 202,
    })

    touchEvent = new global.window.TouchEvent('click', {
        view: window,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true,
    })

    Object.defineProperty(touchEvent, "touches", {
        value: [],
        writable: true
    })
}

describe('initialization', function() {
    it('document is not defined', () => {
        delete global.document
        delete global.window
        expect(() => {
            GetCursorPosition()
        }).to.throw('document is not defined')
    })

    it('window is not defined', () => {
        setDOM()
        delete global.window
        expect(() => {
            GetCursorPosition()
        }).to.throw('window is not defined')
    })

    it('event is defined', () => {
        setDOM()
        expect(() => {
            GetCursorPosition()
        }).to.throw('event is not defined')
    })
})

describe('functionality', function() {
    setDOM()

    it('simple mouse event', () => {
        const listener = (e: Event) => {
            const {x, y} = GetCursorPosition({ event: e })
            expect(x).equal(mouseEvent.clientX)
            expect(y).equal(mouseEvent.clientY)
        }
        div.addEventListener("click", listener)
        div.dispatchEvent(mouseEvent)
        div.removeEventListener("click", listener)
    })

    it('simple touch event', () => {
        touchEvent.touches = [{clientX: 401, clientY: 402}]
        const listener = (e: Event) => {
            const {x, y} = GetCursorPosition({ event: e })
            expect(x).equal(touchEvent.touches[0].clientX)
            expect(y).equal(touchEvent.touches[0].clientY)
        }
        div.addEventListener("click", listener)
        div.dispatchEvent(touchEvent)
        div.removeEventListener("click", listener)
        touchEvent.touches = []
    })
})

describe('body scroll X', function() {
    setDOM()

    const listener = (e: Event) => {
        const {x, y} = GetCursorPosition({ event: e })
        expect(x).equal(mouseEvent.clientX + 400)
        expect(y).equal(mouseEvent.clientY)
    }

    before(function() {
        div.addEventListener("click", listener)
    })
    after(function() {
        div.removeEventListener("click", listener)
    })

    it('window.pageXOffset', () => {
        global.window.pageXOffset = 400
        div.dispatchEvent(mouseEvent)
        global.window.pageXOffset = 0
    })
    it('document.documentElement.scrollLeft', () => {
        if (div !== null) {
            global.document.documentElement.scrollLeft = 400
            div.dispatchEvent(mouseEvent)
            global.document.documentElement.scrollLeft = 0
        }
    })
    it('document.body.scrollLeft', () => {
        if (div !== null) {
            global.document.body.scrollLeft = 400
            div.dispatchEvent(mouseEvent)
            global.document.body.scrollLeft = 0
        }
    })
})

describe('body scroll Y', function() {
    setDOM()

    beforeEach(function() {
        div.addEventListener("click", listener)
    })
    afterEach(function() {
        div.removeEventListener("click", listener)
    })

    function listener(e: Event) {
        const {x, y} = GetCursorPosition({ event: e })
        expect(x).equal(mouseEvent.clientX)
        expect(y).equal(mouseEvent.clientY + 500)
    }

    it('window.pageYOffset', () => {
        global.window.pageYOffset = 500
        div.dispatchEvent(mouseEvent)
        global.window.pageYOffset = 0
    })
    it('document.documentElement.scrollTop', () => {
        if (div !== null) {
            global.document.documentElement.scrollTop = 500
            div.dispatchEvent(mouseEvent)
            global.document.documentElement.scrollTop = 0
        }
    })
    it('document.body.scrollTop', () => {
        if (div !== null) {
            global.document.body.scrollTop = 500
            div.dispatchEvent(mouseEvent)
            global.document.body.scrollTop = 0
        }
    })
})

describe('position from element', function () {

})
