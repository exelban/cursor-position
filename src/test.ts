import GetCursorPosition from './index'
import 'mocha'
import { expect } from 'chai'
import { JSDOM } from 'jsdom'

declare var global: any

const { window } = new JSDOM('<!doctype html><html><body><div id="parentMockElement"><div id="mockElement"></div></div></body></html>')
const parent = window.document.getElementById("parentMockElement")!
const div = window.document.getElementById("mockElement")!
let mouseEvent: any = undefined
let touchEvent: any = undefined

const setDOM = () => {
    global.document = window.document
    global.window = document.defaultView
    global.MouseEvent = window.MouseEvent
    global.TouchEvent = window.TouchEvent
    global.Element = window.Element
    global.HTMLElement = window.HTMLElement

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

describe('absolute + !scroll', function() {
    setDOM()

    it('absolute mouse event', () => {
        const listener = (e: Event) => {
            const {x, y} = GetCursorPosition({ event: e })
            expect(x).equal(mouseEvent.clientX)
            expect(y).equal(mouseEvent.clientY)
        }
        div.addEventListener("click", listener)
        div.dispatchEvent(mouseEvent)
        div.removeEventListener("click", listener)
    })

    it('absolute touch event', () => {
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

describe('absolute + scroll X', function() {
    setDOM()

    const listener = (e: Event) => {
        const {x, y} = GetCursorPosition({ event: e, scroll: true })
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
        global.document.documentElement.scrollLeft = 400
        div.dispatchEvent(mouseEvent)
        global.document.documentElement.scrollLeft = 0
    })
    it('document.body.scrollLeft', () => {
        global.document.body.scrollLeft = 400
        div.dispatchEvent(mouseEvent)
        global.document.body.scrollLeft = 0
    })
})

describe('absolute + scroll Y', function() {
    setDOM()

    beforeEach(function() {
        div.addEventListener("click", listener)
    })
    afterEach(function() {
        div.removeEventListener("click", listener)
    })

    function listener(e: Event) {
        const {x, y} = GetCursorPosition({ event: e, scroll: true })
        expect(x).equal(mouseEvent.clientX)
        expect(y).equal(mouseEvent.clientY + 500)
    }

    it('window.pageYOffset', () => {
        global.window.pageYOffset = 500
        div.dispatchEvent(mouseEvent)
        global.window.pageYOffset = 0
    })
    it('document.documentElement.scrollTop', () => {
        global.document.documentElement.scrollTop = 500
        div.dispatchEvent(mouseEvent)
        global.document.documentElement.scrollTop = 0
    })
    it('document.body.scrollTop', () => {
        global.document.body.scrollTop = 500
        div.dispatchEvent(mouseEvent)
        global.document.body.scrollTop = 0
    })
})

describe('!absolute + scroll X', function () {
    setDOM()

    const listener = (e: Event) => {
        const {x, y} = GetCursorPosition({ event: e, scroll: true, absolute: false })
        expect(x).equal(mouseEvent.clientX + 600)
        expect(y).equal(mouseEvent.clientY)
    }

    before(function() {
        div.addEventListener("click", listener)
    })
    after(function() {
        div.removeEventListener("click", listener)
    })

    it('scrollLeft', () => {
        parent.scrollLeft = 600
        div.dispatchEvent(mouseEvent)
        parent.scrollLeft = 0
    })
})

describe('!absolute + scroll Y', function () {
    setDOM()

    const listener = (e: Event) => {
        const {x, y} = GetCursorPosition({ event: e, scroll: true, absolute: false })
        expect(x).equal(mouseEvent.clientX)
        expect(y).equal(mouseEvent.clientY + 600)
    }

    before(function() {
        div.addEventListener("click", listener)
    })
    after(function() {
        div.removeEventListener("click", listener)
    })

    it('scrollLeft', () => {
        parent.scrollTop = 600
        div.dispatchEvent(mouseEvent)
        parent.scrollTop = 0
    })
})
