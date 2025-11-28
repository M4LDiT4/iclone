
type EventMap = {
  service_error: (err: Error) => void;
};

class EventBus {
  private listeners: { [K in keyof EventMap]?: EventMap[K][] } = {};

  on<K extends keyof EventMap>(event: K, callback: EventMap[K]) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(callback);
  }

  off<K extends keyof EventMap>(event: K, callback: EventMap[K]) {
    this.listeners[event] = this.listeners[event]?.filter(cb => cb !== callback);
  }

  emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>) {
    this.listeners[event]?.forEach(cb => (cb as (...args: any) => any)(...args));
  }
}

// Singleton instance
export const eventBus = new EventBus();
