import createToolbar from './toolbar.js'

export const createScreen = (parent_el, screen_obj) => {
    // add toolbar
    const toolbar_obj = {
        buttons: [
            {
                icon: '\u10008',
                name: 'close',
                onClick: e => {
                    removeScreen(window.screens, screen_obj.id)
                }
            },
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
