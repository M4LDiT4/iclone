import Queue from "../data-structures/Queue";

class SlidingWindowMemory<T> {
  private readonly window: Queue<T>;
  private readonly capacity: number;

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error("Sliding window capacity must be greater than 0.");
    }
    this.capacity = capacity;
    this.window = new Queue<T>();
  }

  add(item: T): void {
    if (this.window.size() === this.capacity) {
      this.window.dequeue(); // Evict oldest
    }
    this.window.enqueue(item);
  }

  getAll(): T[] {
    return this.window.toArray();
  }

  latest(): T | undefined {
    return this.window.toArray().at(-1);
  }

  clear(): void {
    this.window.clear();
  }

  size(): number {
    return this.window.size();
  }

  isFull(): boolean {
    return this.window.size() === this.capacity;
  }
}
