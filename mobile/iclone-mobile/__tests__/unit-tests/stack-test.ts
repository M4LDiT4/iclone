import Stack from "@/domain/dataStructures/Stack";

describe('Stack<T>', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  test('push adds items to the top', () => {
    stack.push(1);
    stack.push(2);
    expect(stack.size()).toBe(2);
    expect(stack.peek()).toBe(2);
  });

  test('pop removes and returns the top item', () => {
    stack.push(10);
    stack.push(20);
    expect(stack.pop()).toBe(20);
    expect(stack.size()).toBe(1);
    expect(stack.peek()).toBe(10);
  });

  test('pop returns undefined when empty', () => {
    expect(stack.pop()).toBeUndefined();
  });

  test('peek returns the top item without removing it', () => {
    stack.push(5);
    expect(stack.peek()).toBe(5);
    expect(stack.size()).toBe(1);
  });

  test('peek returns undefined when empty', () => {
    expect(stack.peek()).toBeUndefined();
  });

  test('isEmpty returns true for empty stack', () => {
    expect(stack.isEmpty()).toBe(true);
  });

  test('isEmpty returns false when items exist', () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });

  test('size returns correct number of items', () => {
    stack.push(1);
    stack.push(2);
    expect(stack.size()).toBe(2);
  });

  test('clear empties the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
    expect(stack.peek()).toBeUndefined();
  });
});