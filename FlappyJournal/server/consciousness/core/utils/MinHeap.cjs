/**
 * Simple binary MinHeap for GC queue.
 * Stores {key,lastAccessed}
 */
class MinHeap {
  constructor() {
    this.data = [];
  }
  _parent(i) { return ((i + 1) >>> 1) - 1; }
  _left(i) { return (i << 1) + 1; }
  _right(i) { return (i + 1) << 1; }
  push(val) {
    this.data.push(val);
    this._siftUp(this.data.length - 1);
  }
  pop() {
    if (this.size() === 0) return undefined;
    const min = this.data[0];
    const last = this.data.pop();
    if (this.size() > 0) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return min;
  }
  peek() { return this.size() ? this.data[0] : undefined; }
  size() { return this.data.length; }
  _siftUp(i) {
    const node = this.data[i];
    while (i > 0) {
      const p = this._parent(i);
      if (this.data[p].lastAccessed <= node.lastAccessed) break;
      this.data[i] = this.data[p];
      i = p;
    }
    this.data[i] = node;
  }
  _siftDown(i) {
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
  remove(key) {
    // Remove by key (linear scan)
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i].key === key) {
        const last = this.data.pop();
        if (i < this.data.length) {
          this.data[i] = last;
          this._siftUp(i);
          this._siftDown(i);
        }
        return true;
      }
    }
    return false;
  }
  update(key, lastAccessed) {
    // Remove and re-add
    this.remove(key);
    this.push({ key, lastAccessed });
  }
}

module.exports = MinHeap;