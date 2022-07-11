function mountElement(vnode: VNode, container: HTMLElement) {
    const el = document.createElement(vnode.tag as string);
    for (let key in vnode.props) {
        if (/^on/.test(key)) {
            const eventName = key.substring(2).toLocaleLowerCase();
            el.addEventListener(eventName, vnode.props[key]);
        }
    }

    if (typeof vnode.children === 'string') {
        el.appendChild(document.createTextNode(vnode.children));
    } else if (Array.isArray(vnode.children)) {
        vnode.children.forEach(child => renderer(child, el))
    }
    container.appendChild(el);
}

function mountComponent(vnode: VNode, container: HTMLElement) {
    const subtress = (vnode.tag as FunctionComponent)();
    renderer(subtress, container);
}

function renderer(vnode: VNode, container: HTMLElement) {
    if (typeof vnode.tag === 'string') {
        mountElement(vnode, container);
    } else if (typeof vnode === 'function') {
        //mountFunction
    }
}


export default renderer;