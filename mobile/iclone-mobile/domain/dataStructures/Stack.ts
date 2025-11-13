class Stack<T> {
  private items: T[] = [];

  // Push an item onto the stack
  push(item: T): void {
    this.items.push(item);
  }

  // Remove and return the top item
  pop(): T | undefined {
    return this.items.pop();
  }

  // Return the top item without removing it
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Return the number of items in the stack
  size(): number {
    return this.items.length;
  }

  // Clear the stack
  clear(): void {
    this.items = [];
  }
}

export default Stack;