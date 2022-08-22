import Product from "src/lib/Product";
import { afterEach, beforeEach, expect, it } from "vitest";
import { products } from "./products";

beforeEach(() => {
    products.subscribe(value => {
        value.clear()
    })
})



it('adds new Product to list', () => {
    const product = new Product()

    products.subscribe(value => {
        value.add(product)
        expect(value.products).toContain(product)
    })
})

it('adds empty product if no product info is given', () => {
    products.subscribe(value => {
        value.add()
        expect(value.products).toContainEqual(new Product())
    })
})

it('adds quantities of same Product', () => {
    products.subscribe(value => {
        const product = new Product('00000-001', '', 1)
        value.add(product)
        value.add(product)
        expect(value.products).toContainEqual(new Product('00000-001', '', 2))
    })
})

it('clears all products', () => {
    products.subscribe(value => {
        value.add(new Product())
        value.add(new Product())
        value.clear()
        expect(value.products.length).toBe(0)
    })
})

it('removes single product', () => {
    products.subscribe(value => {
        value.add(new Product('00000-001', '', 3))
        value.add(new Product())
        value.remove('00000-001', '')

        expect(value.products).not.toContainEqual(new Product('00000-001', '', 3))
        expect(value.products.length).toBe(1)
    })
})

it('returns correct DataTable format', () => {
    products.subscribe(value => {
        value.add(new Product())
        value.add(new Product('00000-001', '', 3))
        value.add(new Product('00000-001', 'RAL1000', 1))

        const result = value.getDataTableArray()

        expect(result).toContainEqual({
            id: 0,
            sku: '00000-000',
            color: '',
            quantity: 0
        })

        expect(result).toContainEqual({
            id: 1,
            sku: '00000-001',
            color: '',
            quantity: 3
        })

        expect(result).toContainEqual({
            id: 2,
            sku: '00000-001',
            color: 'RAL1000',
            quantity: 1
        })
    })
})



afterEach(() => {
    products.subscribe(value => {
        value.clear()
    })
})
