import { describe, expect, it } from "vitest";
import Notification from './Notification'

describe('notification class', () => {
    it('creates notification with default values', () => {
        const notification = new Notification()

        expect(notification.kind).toBe('error')
        expect(notification.lowContrast).toBe(false)
        expect(notification.timeout).toBe(5000)
        expect(notification.timestamp).toBeLessThanOrEqual(new Date().getTime())
        expect(notification.timestamp).toBeGreaterThan(new Date().getTime() - 100)
        expect(notification.title).toBe('')
        expect(notification.subtitle).toBe('')
        expect(notification.caption).toBe('')
        expect(notification.iconDescription).toBe('')
    })

    it('creates notification with custom values', () => {
        const date = new Date()
        const notification = new Notification('info', true, 4000, 'Info', 'Interessante Info', date.toString(), 'Info')

        expect(notification.kind).toBe('info')
        expect(notification.lowContrast).toBe(true)
        expect(notification.timeout).toBe(4000)
        expect(notification.timestamp).toBeLessThanOrEqual(new Date().getTime())
        expect(notification.timestamp).toBeGreaterThan(new Date().getTime() - 100)
        expect(notification.title).toBe('Info')
        expect(notification.subtitle).toBe('Interessante Info')
        expect(notification.caption).toBe(date.toString())
        expect(notification.iconDescription).toBe('Info')
    })
})