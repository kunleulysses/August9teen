/**
 * Simple binary MinHeap for GC queue.
 * Stores {key,lastAccessed}
 */
export interface HeapNode {
  key: string;
  lastAccessed: number;
}

class MinHeap<T extends HeapNode> {
  private data: T[] = [];
  _parent(i: number) { return ((i + 1) >>> 1) - 1; }
  _left(i: number) { return (i << 1) + 1; }
  _right(i: number) { return (i + 1) << 1; }
  push(val: T) {
    this.data.push(val);
    this._siftUp(this.data.length - 1);
  }
  pop(): T | undefined {
    if (this.size() === 0) return undefined;
    const min = this.data[0];
    const last = this.data.pop();
    if (this.size() > 0 && last) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return min;
  }
  peek(): T | undefined { return this.size() ? this.data[0] : undefined; }
  size(): number { return this.data.length; }
  _siftUp(i: number) {
    const node = this.data[i];
    while (i > 0) {
      const p = this._parent(i);
      if (this.data[p].lastAccessed <= node.lastAccessed) break;
      this.data[i] = this.data[p];
      i = p;
    }
    this.data[i] = node;
  }
  _siftDown(i: number) {
    const n = this.size();
    const node = this.data[i];
    while (true) {
      let min = i, l = this._left(i), r = this._right(i);
      if (l < n && this.data[l].lastAccessed < this.data[min].lastAccessed) min = l;
      if (r < n && this.data[r].lastAccessed < this.data[min].lastAccessed) min = r;
      if (min === i) break;
      this.data[i] = this.data[min];
      i = min;
    }
    this.data[i] = node;
  }
  remove(key: string): boolean {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i].key === key) {
        const last = this.data.pop();
        if (i < this.data.length && last) {
          this.data[i] = last;
          this._siftUp(i);
          this._siftDown(i);
        }
        return true;
      }
    }
    return false;
  }
  update(key: string, lastAccessed: number) {
    this.remove(key);
    this.push({ key, lastAccessed } as T);
  }
}

export default MinHeap;