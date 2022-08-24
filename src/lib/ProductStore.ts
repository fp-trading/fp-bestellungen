import { writable, type Writable } from 'svelte/store'
import Product from './Product'

export const products: Writable<Array<Product>> = writable([])

export default class ProductStore {
    remove(index: number) {
        products.update(u => {
            u.splice(index, 1)

            return u
        })
    }

    clear() {
        products.set([])
    }

    add(product: Product = new Product()) {
        products.update(u => {
            return this.addToExistingOrCreateNew(product, u)
        })
    }

    private addToExistingOrCreateNew(product: Product, products: Array<Product>): Array<Product> {
        const index = this.getMatchingIndex(product, products)

        if (index !== -1) {
            products[index].quantity += product.quantity
        } else {
            products.push(product)
        }

        return products
    }

    private getMatchingIndex(product: Product, products: Array<Product>): number {
        return products.findIndex(item => item.sku === product.sku && item.color === product.color)
    }
}