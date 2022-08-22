import Product from './Product'

export default class ProductStore {
    products: Array<Product> = []

    add(product?: Product) {
        if (product === undefined) product = new Product()
        this.addToMatchingOrPushNew(product, this.getMatchingProductIndex(product))
    }

    remove(sku: string, color: string) {
        this.products.splice(this.getMatchingProductIndex(new Product(sku, color)), 1)
    }

    clear() {
        this.products = []
    }

    getDataTableArray() {
        return this.products.map((product, index) => {
            return {
                id: index,
                sku: product.sku,
                color: product.color,
                quantity: product.quantity
            }
        })
    }

    private getMatchingProductIndex(product: Product): number {
        return this.products.findIndex(existingProduct =>
            existingProduct.sku === product.sku &&
            existingProduct.color === product.color
        )
    }

    private addToMatchingOrPushNew(product: Product, matchingProductIndex: number) {
        const noMatch = -1
        if (matchingProductIndex === noMatch) {
            this.createNew(product)
        } else {
            this.addToMatching(product, matchingProductIndex)
        }
    }

    private createNew(product: Product) {
        this.products.push(product)
    }

    private addToMatching(product: Product, matchingProductIndex: number) {
        this.products[matchingProductIndex].quantity += product.quantity
    }
}