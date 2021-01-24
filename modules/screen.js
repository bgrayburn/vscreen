// import { createToolbar } from './modules/toolbar.js'

export const createScreen = (parent_el, screen_obj) => {
    // add toolbar
    // const toolbar = createToolbar(parent_el, toolbar_obj)
    // parent_el.appendChild(toolbar)

    // add iframe
    const child_iframe = document.createElement('iframe')
    child_iframe.className = 'screen-iframe'
    child_iframe.src = screen_obj.url
    parent_el.appendChild(child_iframe)
}