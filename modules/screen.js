import createToolbar from './toolbar.js'

export const addScreen = (name, x, y, w=100, h=100, defaults) => {
    screens.push(makeScreenObject(name, x, y, w, h, defaults))
}

const makeScreenObject = (name, x, y, w, h, defaults) => addElementToScreenObject({
    id: Math.max(...screens.map(s => s.id), 1),
    name,
    url: defaults.default_screen_url,
    x,
    y,
    w,
    h
})

const addElementToScreenObject = (screen_obj) => ({
    ...screen_obj,
    element: makeScreenElement(screen_obj)
})

const makeScreenElement = screen_obj => {
    const el = document.createElement('div')
    el.id = getScreenTagID(screen_obj)
    el.className = 'screen'
    updateScreenElement(el, screen_obj)
    createScreen(el, screen_obj)
    document.getElementById('screens').appendChild(el)
    return el
}

const updateScreenElement = (el, screen_obj) => {
    el.style.top = screen_obj.y
    el.style.left = screen_obj.x
    el.style.width = `${screen_obj.w}px`
    el.style.height = `${screen_obj.h}px`
}

const createScreen = (parent_el, screen_obj) => {
    // add toolbar
    const toolbar_obj = {
        buttons: [
            {
                icon: '\u2718',
                name: 'close',
                onClick: e => removeScreen(window.screens, screen_obj.id)
            },
            {
                icon: '\u21BA',
                name: 'refresh',
                onClick: e => refreshScreen(window.screens, screen_obj.id)
            }
        ]
    }
    const toolbar = createToolbar(toolbar_obj)
    parent_el.appendChild(toolbar)
    // add iframe
    const child_iframe = document.createElement('iframe')
    child_iframe.className = 'screen-iframe'
    child_iframe.src = screen_obj.url
    parent_el.appendChild(child_iframe)
}

const removeScreen = (screens, id) => {
    document.getElementById(`screen-${id}`).remove()

    screens = screens.filter(s => s.id != id)
}

const refreshScreen = (screens, id) => {
    const screen = screens.find(s => s.id == id)
    const screens_el = document.getElementById('screens')
    removeScreen(screens, screen.id)
    createScreen(screens_el, screen)
}

const getScreenTagID = screen => `screen-${screen.id}`
