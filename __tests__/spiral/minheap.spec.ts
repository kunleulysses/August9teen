import MinHeap from '../../FlappyJournal/server/consciousness/core/utils/MinHeap';

describe('MinHeap', () => {
  it('push and pop maintains min-heap', () => {
    const heap = new MinHeap();
    heap.push({ key: 'a', lastAccessed: 5 });
    heap.push({ key: 'b', lastAccessed: 2 });
    heap.push({ key: 'c', lastAccessed: 7 });
    expect(heap.pop().key).toBe('b');
    expect(heap.pop().key).toBe('a');
    expect(heap.pop().key).toBe('c');
    expect(heap.pop()).toBeUndefined();
  });

  it('update and remove work', () => {
    const heap = new MinHeap();
    heap.push({ key: 'x', lastAccessed: 1 });
    heap.push({ key: 'y', lastAccessed: 2 });
    heap.update('y', 0);
    expect(heap.pop().key).toBe('y');
    expect(heap.pop().key).toBe('x');
  });
});