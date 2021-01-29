import { addScreen } from './modules/screen.js'
window.screens = []
const default_screen_server_url = 'http://localhost:3000'
const default_screen_url = `http://localhost:8081/?server=${default_screen_server_url}`
let defaults = {default_screen_url}

// util funcs
const pxVal = w => `${(Math.abs(w) > 0) ? Math.abs(w) : 1}px`

const storeConfig = config => {
    localStorage.setItem('vscreen_config', JSON.stringify(config))
}

export const updateConfig = (screens, defaults) => {
    window.config = {
        screens,
        defaults
    }
    storeConfig(window.config)
    return window.config
}

// init event listeners
let mouse_drag_start = [0, 0]
let is_mouse_dragging = false
document.onmousedown = (e) => {
    var e = e ?? window.event
    const {target, srcElement, clientX, clientY} = e
    const target_element = target ?? srcElement
    console.log(`you clicked on ${target_element.id}`)

    if (target_element.id == 'screens') {
        const cur_pos = [clientX, clientY]
        mouse_drag_start = [...cur_pos]
        is_mouse_dragging = true
        const drag_box_el = document.getElementById('drag-box')
        drag_box_el.style.visibility = 'visible'
        drag_box_el.style.width = '1px'
        drag_box_el.style.heigh = '1px'
        drag_box_el.style.top = mouse_drag_start[0]
        drag_box_el.style.left = mouse_drag_start[1]
    }
}
document.onmousemove = (e) => {
    if (is_mouse_dragging) {
        const {clientX, clientY} = e
        console.log(`clientX: ${clientX}, clientY: ${clientY}`)
        const drag_box_el = document.getElementById('drag-box')
        drag_box_el.style.width = pxVal(clientX - mouse_drag_start[0])
        drag_box_el.style.height = pxVal(clientY - mouse_drag_start[1])
    }
}
document.onmouseup = (e) => {
    if (is_mouse_dragging){
        const {clientX, clientY} = e
        const name = `screen ${Math.max(...screens.map(s => s.id)) + 1}`
        const x = Math.min(mouse_drag_start[0], clientX)
        const y = Math.min(mouse_drag_start[1], clientY)
        const w = Math.max(
            Math.abs(clientX - mouse_drag_start[0]),
            50
        )
        const h = Math.max(
            Math.abs(clientY - mouse_drag_start[1]),
            50
        )
        addScreen(name, x, y, w, h, defaults)
        updateConfig(screens, defaults)
        console.log(`mouse_drag_start: ${mouse_drag_start}`)
        console.log(`added screen where x:${x}, y:${y}, w:${w}, h:${h}`)
        is_mouse_dragging = false
    }
    document.getElementById('drag-box').style.visibility = 'hidden'
}
// create default screen or load config
const loaded_config_json = localStorage.getItem('vscreen_config')
if (loaded_config_json) {
    const loaded_config = JSON.parse(loaded_config_json)
    window.screens = loaded_config.screens
    window.screens.forEach(s => {
        addScreen(
            s.name, s.x, s.y, s.w, s.h, defaults
        )
    })
    defaults = loaded_config.defaults
} else {
    addScreen('screen 1', 100, 100, 1000, 400, window.config.defaults)
}
updateConfig(window.screens, defaults)    
