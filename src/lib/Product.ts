import { v4 as uuidv4 } from 'uuid'

export default class Product {
    title = ''
    sku = '00000-000'
    color = ''
    quantity = '0'
    id = uuidv4()

    constructor(sku?: string, color?: string, quantity?: string, title?: string) {
        if (sku !== undefined) this.sku = sku
        if (color !== undefined) this.color = color
        if (quantity !== undefined) this.quantity = quantity
        if (title !== undefined) this.title = title
    }
}