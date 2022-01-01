interface EventListener {
  (evt: Event): void
}

interface EventListenerObject {
  handleEvent(object: Event): void
}

export type EventListenerOrEventListenerObject =
  | EventListener
  | EventListenerObject

interface EventListenerOptions {
  capture?: boolean
}

export interface AddEventListenerOptions extends EventListenerOptions {
  once?: boolean
  passive?: boolean
  signal?: AbortSignal
}

interface EspecialEvent<T> extends Event {
  detail: T
}

interface EspecialEventListener<T> {
  (evt: EspecialEvent<T>): void
}

interface EspecialEventListenerObject<T> {
  handleEvent(object: EspecialEvent<T>): void
}

export type EspecialEventListenerOrEventListenerObject<T> =
  | EspecialEventListener<T>
  | EspecialEventListenerObject<T>
