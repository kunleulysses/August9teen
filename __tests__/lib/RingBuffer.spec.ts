import { RingBuffer } from '../../shared/lib/RingBuffer';

describe('RingBuffer', () => {
    it('should be able to be created with a given capacity', () => {
        const buffer = new RingBuffer<number>(5);
        expect(buffer.getCapacity()).toBe(5);
        expect(buffer.size()).toBe(0);
        expect(buffer.toArray()).toEqual([]);
    });

    it('should throw an error if created with a non-positive capacity', () => {
        expect(() => new RingBuffer<number>(0)).toThrow('RingBuffer capacity must be a positive integer.');
        expect(() => new RingBuffer<number>(-1)).toThrow('RingBuffer capacity must be a positive integer.');
    });

    it('should push items and increase size', () => {
        const buffer = new RingBuffer<number>(5);
        buffer.push(1);
        buffer.push(2);
        expect(buffer.size()).toBe(2);
        expect(buffer.toArray()).toEqual([1, 2]);
    });

    it('should be full when the number of pushed items equals capacity', () => {
        const buffer = new RingBuffer<number>(3);
        buffer.push(1);
        buffer.push(2);
        buffer.push(3);
        expect(buffer.size()).toBe(3);
        expect(buffer.toArray()).toEqual([1, 2, 3]);
    });

    it('should overwrite the oldest item when full', () => {
        const buffer = new RingBuffer<number>(3);
        buffer.push(1);
        buffer.push(2);
        buffer.push(3);
        buffer.push(4); // This should overwrite 1
        expect(buffer.size()).toBe(3);
        expect(buffer.toArray()).toEqual([2, 3, 4]);
    });

    it('should handle multiple overwrites correctly', () => {
        const buffer = new RingBuffer<number>(3);
        buffer.push(1);
        buffer.push(2);
        buffer.push(3);
        buffer.push(4);
        buffer.push(5);
        buffer.push(6);
        expect(buffer.size()).toBe(3);
        expect(buffer.toArray()).toEqual([4, 5, 6]);
    });

    it('should be able to be cleared', () => {
        const buffer = new RingBuffer<number>(3);
        buffer.push(1);
        buffer.push(2);
        buffer.push(3);
        buffer.clear();
        expect(buffer.size()).toBe(0);
        expect(buffer.toArray()).toEqual([]);
    });

    it('should work correctly after being cleared and refilled', () => {
        const buffer = new RingBuffer<number>(3);
        buffer.push(1);
        buffer.push(2);
        buffer.clear();
        buffer.push(4);
        buffer.push(5);
        expect(buffer.size()).toBe(2);
        expect(buffer.toArray()).toEqual([4, 5]);
        buffer.push(6);
        buffer.push(7);
        expect(buffer.toArray()).toEqual([5, 6, 7]);
    });

    it('should handle object references', () => {
        const buffer = new RingBuffer<{ id: number }> (2);
        const obj1 = { id: 1 };
        const obj2 = { id: 2 };
        const obj3 = { id: 3 };
        buffer.push(obj1);
        buffer.push(obj2);
        buffer.push(obj3);
        expect(buffer.toArray()).toEqual([obj2, obj3]);
    });
});