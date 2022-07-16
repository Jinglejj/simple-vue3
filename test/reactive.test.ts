import effect from '@/reactive/effect';
import reactive from '@/reactive';



describe('reactive test', () => {


    test('basic reactive', () => {
        const data = {
            count: 1,
        }
        let obj = reactive(data);
        const fn = jest.fn(() => console.log(obj.count));
        effect(fn);
        obj.count++;
        expect(fn.mock.calls.length === 2);
    });

    test('test lazy', () => {
        const fn = jest.fn(() => { });
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
})