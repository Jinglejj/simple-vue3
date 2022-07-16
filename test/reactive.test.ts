import effect from '@/reactive/effect';
import reactive, { readonly, shallowReactive } from '@/reactive';
import { flushJob, jobQueue } from '@/queue';

describe('reactive test', () => {


    test('basic reactive', () => {
        const data = {
            count: 1,
        }
        const obj = reactive(data);
        const fn = jest.fn(() => console.log(obj.count));
        effect(fn);
        obj.count++;
        expect(fn.mock.calls.length === 2);
    });

    test('flush queue', () => {
        const data = {
            count: 1,
        }
        const obj = reactive(data);
        const fn = jest.fn(() => console.log(obj.count));
        effect(fn, {
            scheduler: (fn) => {
                jobQueue.add(fn);
                flushJob();
            }
        });
        for (let i = 0; i < 1000; i++) {
            obj.count++;
        }
        expect(obj.count).toEqual(1001);
        // 放入微任务队列
        Promise.resolve().then(() => expect(fn.mock.calls.length).toEqual(2))
    })

    test('test lazy', () => {
        const fn = jest.fn(() => void 0);
        effect(fn, { lazy: true });
        expect(fn.mock.calls.length).toEqual(0);
    })

    test('test extend', () => {
        const obj = {};
        const proto = { bar: 1 };
        const child = reactive(obj) as { bar: number };
        const parent = reactive(proto);
        Object.setPrototypeOf(child, parent);
        const fn = jest.fn(() => console.log('bar', child.bar));
        effect(fn);
        child.bar = 2;
        expect(fn.mock.calls.length).toEqual(2);
    })

    test('deep reactive', () => {
        const data = {
            foo: {
                bar: 1
            }
        }
        const obj = reactive(data);
        const fn = jest.fn(() => console.log(obj.foo.bar));
        effect(fn);
        obj.foo.bar++;
        expect(fn.mock.calls.length).toEqual(2);
    })

    test('shallow reactive', () => {
        const data = {
            foo: {
                bar: 1
            }
        }
        const obj = shallowReactive(data);
        const fn = jest.fn(() => console.log(obj.foo.bar));
        effect(fn);
        obj.foo.bar++;
        expect(fn.mock.calls.length).toEqual(1);
    })

    test('readonly', () => {
        const data = { foo: 1 };
        const obj = readonly(data);
        obj.foo++;
        expect(obj.foo).toEqual(1);
    })
})