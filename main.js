import { createScreen } from './modules/screen.js'
const screens = []
window.screens = screens
const default_screen_server_url = 'http://localhost:3000'
const default_screen_url = `http://localhost:8081/?server=${default_screen_server_url}`

let editMode='add'


// side effects
const addScreen = (name, x, y, w=100, h=100) => screens.push(makeScreenObject(name, x, y, w, h))

const makeScreenObject = (name, x, y, w, h) => addElementToScreenObject({
  id: Math.max(...screens.map(s => s.id)) + 1,
  name,
  url: default_screen_url,
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


const updateScreen = screen => screens[screen.id] = Object.assign(screens[screen.id], screen)

const toggleEditMode = mode => editMode = mode ?? !editMode

const updateScreenElement = (el, screen_obj) => {
    el.style.top = screen_obj.y
    el.style.left = screen_obj.x
    el.style.width = `${screen_obj.w}px`
    el.style.height = `${screen_obj.h}px`
}

// util funcs
const getScreenTagID = screen => `screen-${screen.id}`

const pxVal = w => `${(Math.abs(w) > 0) ? Math.abs(w) : 1}px`

const makeConfigForBackup = (screens) => ({screens})

const storeBackup = screens => {
    const config = makeConfigForBackup(screens)
    localStorage.setItem('vscreen_config', JSON.stringify(config))
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
        const w = Math.abs(clientX - mouse_drag_start[0])
        const h = Math.abs(clientY - mouse_drag_start[1])
        addScreen(name, x, y, w, h)
        storeBackup(screens)
        console.log(`mouse_drag_start: ${mouse_drag_start}`)
        console.log(`added screen where x:${x}, y:${y}, w:${w}, h:${h}`)
        is_mouse_dragging = false
    }
    document.getElementById('drag-box').style.visibility = 'hidden'
}
// create default screen
addScreen('screen 1', 100, 100, 1000, 400)
storeBackup(screens)
