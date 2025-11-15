import Queue from "@/domain/dataStructures/Queue";

describe('Queue<T>', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  test('enqueue adds items to the end', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.toArray()).toEqual([1, 2]);
  });

  test('dequeue removes and returns the front item', () => {
    queue.enqueue(10);
    queue.enqueue(20);
    expect(queue.dequeue()).toBe(10);
    expect(queue.toArray()).toEqual([20]);
  });

  test('dequeue returns undefined when empty', () => {
    expect(queue.dequeue()).toBeUndefined();
  });

  test('peek returns the front item without removing it', () => {
    queue.enqueue(5);
    expect(queue.peek()).toBe(5);
    expect(queue.toArray()).toEqual([5]);
  });

  test('peek returns undefined when empty', () => {
    expect(queue.peek()).toBeUndefined();
  });

  test('isEmpty returns true for empty queue', () => {
    expect(queue.isEmpty()).toBe(true);
  });

  test('isEmpty returns false when items exist', () => {
    queue.enqueue(1);
    expect(queue.isEmpty()).toBe(false);
  });

  test('size returns correct number of items', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.size()).toBe(2);
  });

  test('clear empties the queue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.clear();
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  test('toArray returns a shallow copy of items', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    const arr = queue.toArray();
    expect(arr).toEqual([1, 2]);
    arr.push(3);
    expect(queue.toArray()).toEqual([1, 2]); // original queue remains unchanged
  });
});