import computed from "./observer/computed";
import effect from "./observer/effect";
import reactive from "./observer/reactive";
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


// effect(() => {
//     const container = document.getElementById('app');
//     if (container) {
//         container.innerHTML = obj.foo;
//     }
// }, {
//     scheduler: (fn) => {
//         jobQueue.add(fn);
//         flushJob();
//     }
// })

const data: Record<Key, any> = {
    count: 1,
    foo: 2,
    bar: 3,
    ok: true,
    text: 'Hello Vue'
}
const obj = reactive(data);

effect(() => {
    for (let key in obj) {
        console.log(obj[key]);
    }
})

const createBtn = (onClick: Function, name: string) => {
    const btn = document.createElement('button');
    btn.addEventListener('click', () => onClick());
    btn.innerText = name;
    document.body.appendChild(btn);
}

createBtn(() => {
    obj.abcd = 'add'
}, 'add');

createBtn(() => {
    obj.foo++
}, 'foo++');

createBtn(() => {
    delete obj.foo;
}, 'delete foo')
// createBtn(() => {
//     obj.foo++;
// }, 'add count');
// createBtn(() => obj.ok = false, 'change ok');
// createBtn(() => obj.text = Math.random().toString(), 'changeText');

// createBtn(()=>console.log(obj),'console obj')


// const res=computed(()=>obj.foo+obj.bar);

// effect(()=>{
//     console.log(res.value);
// })
// obj.foo++;

// watch(() => obj.count, (oldVal, newVal) => console.log(oldVal, newVal, 'change'), { immdiate: true });