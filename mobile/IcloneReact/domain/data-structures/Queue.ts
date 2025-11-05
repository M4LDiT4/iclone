class Queue<T> {
  private items: T[] = [];

  // Add an item to the end of the queue
  enqueue(item: T): void {
    this.items.push(item);
  }

  // Remove and return the item at the front of the queue
  dequeue(): T | undefined {
    return this.items.shift();
  }

  // Peek at the front item without removing it
  peek(): T | undefined {
    return this.items[0];
  }

  // Check if the queue is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Get the number of items in the queue
  size(): number {
    return this.items.length;
  }

  // Clear all items from the queue
  clear(): void {
    this.items = [];
  }

  // Return a shallow copy of the queue contents
  toArray(): T[] {
    return [...this.items];
  }
}

export default Queue;