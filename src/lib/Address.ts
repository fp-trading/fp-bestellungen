import { writable, type Writable } from "svelte/store"

export default class Address {
    name: string
    phone: string
    street: string
    number: string
    zip: string
    city: string
    company: string

    constructor(name: string = '', phone: string = '', street: string = '', number: string = '', zip: string = '', city: string = '', company: string = '') {
        this.name = name
        this.phone = phone
        this.street = street
        this.number = number
        this.zip = zip
        this.city = city
        this.company = company
    }
}

export const address: Writable<Address> = writable(new Address())
