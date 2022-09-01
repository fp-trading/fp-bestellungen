import { writable, type Writable } from "svelte/store";

export const notifications: Writable<Array<Notification>> = writable([])

export class Notification {
    kind: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt'
    lowContrast: boolean
    timeout: number
    timestamp: number = new Date().getTime()
    title: string
    subtitle: string
    iconDescription: string

    constructor(
        kind: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt' = 'error',
        lowContrast: boolean = false,
        title: string = '',
        subtitle: string = '',
        iconDescription: string = '',
        timeout: number = 5000
    ) {
        this.kind = kind
        this.lowContrast = lowContrast
        this.timeout = timeout
        this.title = title
        this.subtitle = subtitle
        this.iconDescription = iconDescription
    }
}

export default class Notifier {
    add(notification: Notification) {
        notifications.update(u => {
            u.push(notification)
            return u
        })

        this.notifySubscribersAfterTimeout(notification.timeout)
    }

    private notifySubscribersAfterTimeout(timeout: number) {
        setTimeout(() => {
            notifications.update(u => u)
        }, timeout)
    }
}