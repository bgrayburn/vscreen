const createToolbar = (toolbar_object) => {
    toolbar = document.createElement('div')
    toolbar.className = 'toolbar'
    toolbar_object.buttons.forEach(b => {
        toolbar.appendChild(
            createToolbarButton(b)
        )
    })
    return toolbar
}

const createToolbarButton = button_object => {
    const button = document.createElement('div')
    button.className = 'toolbar-button'
    button.title = button_object.name
    button.onclick = button_object.onClick
    const button_text = document.createTextNode(
        button_object.icon
    )
    button.appendChild(button_text)
    return button
}

export default createToolbar