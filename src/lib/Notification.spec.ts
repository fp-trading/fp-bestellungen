import { View } from "carbon-icons-svelte";
import { get } from "svelte/store";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Notifier, { Notification, notifications } from './Notification'

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
        expect(notification.iconDescription).toBe('')
    })

    it('creates notification with custom values', () => {
        const date = new Date()
        const notification = new Notification('info', true, 'Info', 'Interessante Info', 'Info', 4000)

        expect(notification.kind).toBe('info')
        expect(notification.lowContrast).toBe(true)
        expect(notification.timeout).toBe(4000)
        expect(notification.timestamp).toBeLessThanOrEqual(new Date().getTime())
        expect(notification.timestamp).toBeGreaterThan(new Date().getTime() - 100)
        expect(notification.title).toBe('Info')
        expect(notification.subtitle).toBe('Interessante Info')
        expect(notification.iconDescription).toBe('Info')
    })
})


describe('notifier class', () => {

    beforeEach(() => {
        notifications.set([])
        vi.useFakeTimers()
    })

    it('creates new Notifier', () => {
        const notifier = new Notifier()

        expect(notifier).toBeTruthy()
    })

    it('adds notification to store', () => {
        expect(get(notifications).length).toBe(0)
        new Notifier().add(new Notification())
        expect(get(notifications).length).toBe(1)
    })

    it('removes notifies after timeout', () => {
        const notifier = new Notifier()
        const notification = new Notification()
        let counter = 0

        notifier.add(notification)

        notifications.subscribe(() => {
            counter++
        })

        expect(counter).toBe(1)

        vi.runOnlyPendingTimers()

        expect(counter).toBeGreaterThan(1)
    })
})