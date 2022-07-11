import renderer from "./renderer";

const vnode: VNode = {
    tag: 'div',
    props: {
        onClick: () => {
            alert('hello')
        }
    },
    children: 'hello'
};

const container = document.getElementById('app');

if (container) {
    renderer(vnode, container);
}