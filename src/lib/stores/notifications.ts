import type { Writable } from "svelte/store"
import { writable, derived } from "svelte/store"

type Notification = {
  id: string;
  message: string;
}

const NOTIFICATION_TIMEOUT = 2000

const createNotificationStore = () => {
  const _notifications = writable<Notification[]>([])

  const send = (message) => {
    _notifications.update(state => {
      return [...state, { id: id(), message }]
    })
  }

  const notifications = derived<Writable<Notification[]>, Notification[]>(_notifications, ($_notifications, set) => {
    set($_notifications)
    if ($_notifications.length > 0) {
      const timeout = setTimeout(() => {
        _notifications.update(state => {
          state.shift()
          return state
        })
      }, NOTIFICATION_TIMEOUT)
      return () => {
        clearTimeout(timeout)
      }
    }
  })
  const { subscribe } = notifications

  return { subscribe, send }
}

function id() {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const notifications = createNotificationStore()