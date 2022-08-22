export default class Product {
    sku = '00000-000'
    color = ''
    quantity = 0

    constructor(sku?: string, color?: string, quantity?: number) {
        if (sku !== undefined) this.sku = sku
        if (color !== undefined) this.color = color
        if (quantity !== undefined) this.quantity = quantity
    }
}