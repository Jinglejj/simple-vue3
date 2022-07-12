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
    console.log(obj.count)
    const container = document.getElementById('app');
    if (container) {
        container.innerHTML = obj.ok ? obj.count : 'not';
    }
},{
    scheduler:(fn)=>{
        console.log('scheduler');
        fn();
    }
})




const createBtn = (onClick: Function, name:string) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => onClick());
    btn.innerText = name;
    document.body.appendChild(btn);
}
createBtn(() => obj.count++, 'change ok');
// createBtn(() => obj.ok = false, 'change ok');
// createBtn(() => obj.text = Math.random().toString(), 'changeText');

// createBtn(()=>console.log(obj),'console obj')