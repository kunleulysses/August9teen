/**
 * A generic, fixed-capacity ring buffer implementation.
 *
 * This data structure is designed for memory safety, preventing unbounded growth
 * by overwriting the oldest elements when the capacity is reached. It is ideal
 * for managing history, logs, or any stream of data where only the most recent
 * items are relevant.
 *
 * This implementation was created as part of the MEM1 task to prevent memory leaks.
 * @see FlappyJournal/Sprints2/Sprint-2_Performance-and-Protection/01_Task_MEM1_RingBuffers.md
 * @see FlappyJournal/Sprints2/Sprint-2_Performance-and-Protection/06_Task_TEST3_Leak_Test.md
 */
export class RingBuffer<T> {
    private capacity: number;
    private buffer: T[];
    private head: number;
    private tail: number;
    private isFull: boolean;

    /**
     * Constructs a new RingBuffer.
     * @param capacity The fixed capacity of the buffer. Must be a positive integer.
     */
    constructor(capacity: number) {
        if (capacity < 1) {
            throw new Error("RingBuffer capacity must be a positive integer.");
        }
        this.capacity = capacity;
        this.buffer = new Array<T>(capacity);
        this.head = 0;
        this.tail = 0;
        this.isFull = false;
    }

    /**
     * Adds a new item to the buffer, overwriting the oldest item if the buffer is full.
     * @param item The item to add.
     */
    push(item: T): void {
        this.buffer[this.tail] = item;
        this.tail = (this.tail + 1) % this.capacity;

        if (this.isFull) {
            this.head = (this.head + 1) % this.capacity;
        } else if (this.tail === this.head) {
            this.isFull = true;
        }
    }

    /**
     * Returns the contents of the buffer as an array, from oldest to newest.
     * @returns An array containing the items in the buffer.
     */
    toArray(): T[] {
        const result: T[] = [];
        if (this.isFull) {
            for (let i = 0; i < this.capacity; i++) {
                result.push(this.buffer[(this.head + i) % this.capacity]);
            }
        } else {
            let current = this.head;
            while (current !== this.tail) {
                result.push(this.buffer[current]);
                current = (current + 1) % this.capacity;
            }
        }
        return result;
    }

    /**
     * Clears the buffer, resetting it to its initial empty state.
     */
    clear(): void {
        this.head = 0;
        this.tail = 0;
        this.isFull = false;
        // Although not strictly necessary, clearing the array can help the GC.
        this.buffer = new Array<T>(this.capacity);
    }

    /**
     * Returns the current number of elements in the buffer.
     * @returns The size of the buffer.
     */
    size(): number {
        if (this.isFull) {
            return this.capacity;
        }
        return (this.tail - this.head + this.capacity) % this.capacity;
    }

    /**
     * Returns the capacity of the buffer.
     * @returns The capacity of the buffer.
     */
    getCapacity(): number {
        return this.capacity;
    }
}