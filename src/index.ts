import { obj } from "./observer";
import computed from "./observer/computed";
import effect from "./observer/effect";
import watch from "./observer/watch";
import { flushJob, jobQueue } from "./queue";
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
    const container = document.getElementById('app');
    if (container) {
        container.innerHTML = obj.ok ? obj.count : 'not';
    }
}, {
    scheduler: (fn) => {
        jobQueue.add(fn);
        flushJob();
    }
})


const createBtn = (onClick: Function, name: string) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => onClick());
    btn.innerText = name;
    document.body.appendChild(btn);
}
createBtn(() => {
    obj.count++;
}, 'add count');
// createBtn(() => obj.ok = false, 'change ok');
// createBtn(() => obj.text = Math.random().toString(), 'changeText');

// createBtn(()=>console.log(obj),'console obj')


// const res=computed(()=>obj.foo+obj.bar);

// effect(()=>{
//     console.log(res.value);
// })
// obj.foo++;

watch(() => obj.count, (oldVal, newVal) => console.log(oldVal, newVal));