import { writable, type Writable } from "svelte/store"

export default class Address {
    name: string = ''
    phone: string = ''
    street: string = ''
    number: string = ''
    zip: string = ''
    city: string = ''
    note: string = ''
}

export const address: Writable<Address> = writable(new Address())
