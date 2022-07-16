import effect from "./reactive/effect";
import reactive from "./reactive";

// const vnode: VNode = {
//     tag: 'div',
//     props: {
//         onClick: () => {
//             alert('hello')
//         }
//     },
//     children: 'hello'
// };


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

const data = {
    count: 1,
    foo: 2,
    bar: 3,
    ok: true,
    text: 'Hello Vue'
}
const obj = reactive(data);

effect(() => {
    for (const key in obj) {
       console.log(obj[key]);
    }
    const container = document.getElementById('app');
    if (container) {
        container.innerHTML = JSON.stringify(obj);
    }
})

const createBtn = (onClick: Fn, name: string) => {
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