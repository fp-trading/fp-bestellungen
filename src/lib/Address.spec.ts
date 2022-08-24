import { describe, expect, it } from "vitest";
import Address from "./Address";

describe('test adress constructor', () => {
    it('creates address without company', () => {
        const address = new Address('Jonas Abrahams', '015120596734', 'Im Kleinfeld', '53', '67227', 'Frankenthal (Pfalz)')
        expect(address.name).toBe('Jonas Abrahams')
        expect(address.phone).toBe('015120596734')
        expect(address.street).toBe('Im Kleinfeld')
        expect(address.number).toBe('53')
        expect(address.zip).toBe('67227')
        expect(address.city).toBe('Frankenthal (Pfalz)')
        expect(address.company).toBe('')
    })

    it('creates address with company', () => {
        const address = new Address('Jonas Abrahams', '015120596734', 'Im Kleinfeld', '53', '67227', 'Frankenthal (Pfalz)', 'jabrms GmbH')
        expect(address.name).toBe('Jonas Abrahams')
        expect(address.phone).toBe('015120596734')
        expect(address.street).toBe('Im Kleinfeld')
        expect(address.number).toBe('53')
        expect(address.zip).toBe('67227')
        expect(address.city).toBe('Frankenthal (Pfalz)')
        expect(address.company).toBe('jabrms GmbH')
    })
})