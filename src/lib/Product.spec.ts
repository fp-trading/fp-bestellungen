import { describe, expect, it } from 'vitest'
import Product from './Product'

describe('check default values', () => {
    it('has correct default value', () => {
        const product = new Product()

        expect(product.sku).toBe('00000-000')
        expect(product.color).toBe('')
        expect(product.quantity).toBe('0')
    })

    it('get an uuid assigned', () => {
        const product = new Product()

        expect(product.id).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
    })
})

describe('check custom values', () => {
    it('can be created with custom sku only', () => {
        const product = new Product('00000-003')
        expect(product.sku).toBe('00000-003')
        expect(product.color).toBe('')
        expect(product.quantity).toBe('0')
    })

    it('can be created with custom sku and color', () => {
        const product = new Product('00000-002', 'RAL1000')
        expect(product.sku).toBe('00000-002')
        expect(product.color).toBe('RAL1000')
        expect(product.quantity).toBe('0')
    })

    it('can be created with custom sku, color and quantity', () => {
        const firstProduct = new Product('00000-001', 'RAL1000', '1')
        expect(firstProduct.sku).toBe('00000-001')
        expect(firstProduct.color).toBe('RAL1000')
        expect(firstProduct.quantity).toBe('1')
    })
})
