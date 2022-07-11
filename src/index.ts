import { effect, obj } from "./observer";
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

effect(() => {
    console.log('effect');
    const container = document.getElementById('app');
    if (container) {
        container.innerHTML = obj.ok ? obj.text : 'not';
    }
})




const createBtn = (onClick: Function, name) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => onClick());
    btn.innerText = name;
    document.body.appendChild(btn);
}

createBtn(() => obj.ok = false, 'change ok');
createBtn(() => obj.text = Math.random().toString(), 'changeText');

createBtn(()=>console.log(obj),'console obj')