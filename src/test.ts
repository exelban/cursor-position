import GetCursorPosition from './index'
import { expect } from 'chai'
import 'mocha'
import { JSDOM } from 'jsdom'

declare var global: any
const { window } = new JSDOM('<!doctype html><html><body></body></html>')
const setDOM = () => {
    global.document = window.document
    global.window = window
    global.MouseEvent = window.MouseEvent
    global.TouchEvent = window.TouchEvent
}

describe('global tests', () => {
    it('document is not defined', () => {
        delete global.document
        delete global.window
        expect(() => {
            GetCursorPosition({})
        }).to.throw('document is not defined')
    })

    it('window is not defined', () => {
        global.document = window.document
        delete global.window
        expect(() => {
            GetCursorPosition({})
        }).to.throw('window is not defined')
    })

    it('event is defined', () => {
        setDOM()
        expect(() => {
            GetCursorPosition({})
        }).to.throw('event is not defined')
    })
})

describe('functionality tests', () => {
    setDOM()

    const mouseEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    })
    const touchEvent = new TouchEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    })

    it('simple mouse event', () => {
        GetCursorPosition({ event: mouseEvent })
        GetCursorPosition({ event: touchEvent })
    })
})