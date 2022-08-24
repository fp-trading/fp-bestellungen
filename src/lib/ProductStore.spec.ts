import Product from "src/lib/Product";
import ProductStore, { products } from "./ProductStore";
import { beforeEach, describe, expect, it } from "vitest";
import { get } from "svelte/store";

let productStore = new ProductStore()

describe('testing add()', () => {
    beforeEach(() => {
        products.set([])
    })

    it('ads one product to product store', () => {
        const product = new Product()
        productStore.add(product)

        expect(get(products)).toContain(product)
    })

    it('ads multiple products to product sotre', () => {
        const productOne = new Product('00000-001')
        const productTwo = new Product('00000-002')
        productStore.add(productOne)
        productStore.add(productTwo)

        expect(get(products)).toContain(productOne)
        expect(get(products)).toContain(productTwo)
    })

    it('adds default product if no argument given', () => {
        productStore.add()

        expect(get(products).length).toBe(1)
        expect(get(products)[0].sku).toBe('00000-000')
        expect(get(products)[0].color).toBe('')
        expect(get(products)[0].quantity).toBe('0')
    })

    it('combines products with same sku and color', () => {
        productStore.add(new Product('00000-001', '', '1'))
        productStore.add(new Product('00000-001', '', '2'))

        expect(get(products).length).toBe(1)
        expect(get(products)[0].sku).toBe('00000-001')
        expect(get(products)[0].color).toBe('')
        expect(get(products)[0].quantity).toBe('3')
    })

    it('does not combine products with same sku but different color', () => {
        productStore.add(new Product('00000-001', '', '1'))
        productStore.add(new Product('00000-001', 'RAL1000', '2'))

        expect(get(products).length).toBe(2)
    })

    it('notifies subscribers', () => {
        let counter = 0
        products.subscribe(() => {
            counter++
        })
        productStore.add()

        expect(counter).toBe(2)
    })
})

describe('testing clear()', () => {
    beforeEach(() => {
        products.set([])
    })

    it('removes all products from products', () => {
        productStore.add(new Product('00000-001', '', '1'))
        productStore.add(new Product('00000-002', '', '2'))

        expect(get(products).length).toBe(2)

        productStore.clear()

        expect(get(products).length).toBe(0)
    })

    it('notifies subscribers', () => {
        let counter = 0
        productStore.add()

        products.subscribe(value => {
            counter++
        })

        productStore.clear()

        expect(counter).toBe(2)
    })
})

describe('testing remove()', () => {
    beforeEach(() => {
        products.set([])
    })

    it('removes product with index', () => {
        productStore.add(new Product())
        productStore.add(new Product('00000-001', '', '1'))
        productStore.remove(0)
        expect(get(products).length).toBe(1)
        expect(get(products)[0].sku).toBe('00000-001')
        expect(get(products)[0].color).toBe('')
        expect(get(products)[0].quantity).toBe('1')
    })

    it('notifies subscribers', () => {
        let counter = 0
        productStore.add()

        products.subscribe(value => {
            counter++
        })

        productStore.remove(0)

        expect(counter).toBe(2)
    })
})

describe('test additional functionality', () => {
    beforeEach(() => {
        products.set([])
    })

    it('combines products if changed to same sku and color', () => {
        productStore.add(new Product('00000-001', '', '1'))
        productStore.add(new Product())
        products.update(u => {
            u[1].sku = '00000-001'
            u[1].quantity = '2'

            return u
        })

        expect(get(products).length).toBe(1)
        expect(get(products)[0].sku).toBe('00000-001')
        expect(get(products)[0].color).toBe('')
        expect(get(products)[0].quantity).toBe('3')
    })
})