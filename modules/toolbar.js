const createToolbar = (parent_el, toolbar_object) => {
    toolbar = document.createElement('div')
    toolbar.className='toolbar'
    toolbar.style.height = '2rem'
    return toolbar
}

export default createToolbar