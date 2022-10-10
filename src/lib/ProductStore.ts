import { get, readable, writable, type Writable } from 'svelte/store'
import Product from './Product'

import * as productFile from '../products.json';

export const products: Writable<Array<Product>> = writable([])
export const selectedProductIds: Writable<Array<string>> = writable([])
export const stoProducts = readable(getFormatedStoProducts())

export default class ProductStore {
    removeIndex(index: number) {
        products.update(u => {
            u.splice(index, 1)

            return u
        })
    }

    removeId(id: string) {
        products.update(u => {
            u.splice(this.getIndexOfId(id, u), 1)

            return u
        })
    }

    clear() {
        products.set([])
    }

    add(product: Product = new Product()): Product {
        products.update(u => {
            return this.addToExistingOrCreateNew(product, u)
        })

        return product
    }

    combineDuplicates() {
        const currentProducts = get(products)
        const withoutDuplicates = this.getStoreWithoutDuplicates()

        if(currentProducts.length !== withoutDuplicates.length) products.set(withoutDuplicates)
    }

    selectAllProducts() {
        const allIds = get(products).map(product => product.id)

        selectedProductIds.set(allIds)
    }

    private getStoreWithoutDuplicates() {
        let result: Array<Product> = []

        get(products).forEach(product => {
            this.addToExistingOrCreateNew(product, result)
        })

        return result
    }

    private addToExistingOrCreateNew(product: Product, products: Array<Product>): Array<Product> {
        const index = this.getIndexOfProduct(product, products)

        if (index !== -1) {
            products[index].quantity = (parseInt(products[index].quantity) + parseInt(product.quantity)).toString()
        } else {
            products.push(product)
        }

        return products
    }

    private getIndexOfProduct(product: Product, products: Array<Product>): number {
        return products.findIndex(item => item.sku === product.sku && item.color === product.color)
    }

    private getIndexOfId(id: string, products: Array<Product>): number {
        return products.findIndex(item => item.id === id)
    }
}

// Remove duplicates
products.subscribe(() => {
    const productStore = new ProductStore()
    productStore.combineDuplicates()
})

function getFormatedStoProducts() {
    return getProductList().map(product => formatProduct(product))
}

function getProductList() {
    let productList = [];

    for (const product of productFile.productlist.product) {
        if (product.material === undefined) {
            continue
        }

        if (Array.isArray(product.material)) {
            productList.concat(product.material)
        } else {
            productList.push(product.material)
        }
    }

    return productList;
}

function formatProduct(product) {
    return {
        title: `${product.m_name} ${product.m_fuellmenge}${product.m_einheit}`,
        sku: product['-ID']
    }
}
