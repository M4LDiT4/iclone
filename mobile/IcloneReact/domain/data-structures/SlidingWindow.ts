class SlidingWindow<T> {
  private window: T[] = [];
  private maxSize: number;

  constructor(maxSize: number){
    this.maxSize = maxSize;
  }

  push(item: T){
    this.window.push(item);
    if(this.window.length > this.maxSize){
      this.window.shift();
    }
  }
  get items(): T[] {
    return this.window;
  }
}

export default SlidingWindow;