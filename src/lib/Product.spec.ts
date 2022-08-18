import { it, expect } from 'vitest'
import { Product } from './Product'

it('has sku, color and quantity', () => {
    const product = new Product()

    expect(Object.getOwnPropertyNames(product)).toContain('sku')
    expect(Object.getOwnPropertyNames(product)).toContain('color')
    expect(Object.getOwnPropertyNames(product)).toContain('quantity')
})
