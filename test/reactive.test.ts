import effect from '@/observer/effect';
import reactive from '@/observer/reactive';

const data = {
    count: 1,
}

let obj = reactive(data);

describe('reactive test', () => {

    const fn = jest.fn(() => console.log(obj.count));

    effect(fn);

    test('tow plust to is four', () => {
        obj.count++;
        expect(fn.mock.calls.length === 2);
    })
})