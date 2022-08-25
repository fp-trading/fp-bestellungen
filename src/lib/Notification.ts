import { writable, type Writable } from "svelte/store";

export const notifications: Writable<Array<Notification>> = writable([])

export default class Notification {
    kind: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt'
    lowContrast: boolean
    timeout: number
    timestamp: number = new Date().getTime()
    title: string
    subtitle: string
    caption: string
    iconDescription: string

    constructor(
        kind: 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt' = 'error',
        lowContrast: boolean = false,
        timeout: number = 5000,
        title: string = '',
        subtitle: string = '',
        caption: string = '',
        iconDescription: string = ''
    ) {
        this.kind = kind
        this.lowContrast = lowContrast
        this.timeout = timeout
        this.title = title
        this.subtitle = subtitle
        this.caption = caption
        this.iconDescription = iconDescription
    }
}