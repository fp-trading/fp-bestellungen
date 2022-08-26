import Product from "../Product";
import ProductStore from "../ProductStore";

export default class ProductsParser {
    parse(email: string): [Error?] {
        try {
            this.parseProducts(email);
        } catch (err) {
            return [err]
        }

        return []
    }

    private parseProducts(email: string) {
        const productStrings = this.getProductStrings(email)
        if(productStrings.includes('')) throw new Error('Keine Produkte enthalten!')

        let error: Error

        error = this.addProductsToStore(productStrings, error);

        if (error) throw error
    }

    private addProductsToStore(productStrings: string[], error: Error) {
        const productStore = new ProductStore()
        productStore.clear()

        productStrings.forEach(product => {
            try {
                productStore.add(this.parseProduct(product))
            } catch (err) {
                error = err;
            }
        });

        productStore.selectAllProducts()

        return error;
    }

    private parseProduct(productString: string): Product {
        return new Product(
            this.parseSKU(productString),
            this.parseColor(productString),
            this.parseQuantity(productString),
            this.parseTitle(productString)
        )
    }

    private parseTitle(productString: string): string {
        const titleRegex = /Artikel: (.*)/
        return titleRegex.test(productString) ? titleRegex.exec(productString)[1] : ''
    }

    private parseQuantity(productString: string): string {
        try {
            return /Anzahl: ([0-9]+)/.exec(productString)[1]
        } catch (err) {
            return ''
        }
    }

    private parseColor(productString: string): string {
        const colorRegex = /Farbton: (.*)/
        return colorRegex.test(productString) ? colorRegex.exec(productString)[1] : ''
    }

    private parseSKU(productString: string): string {
        try {
            return /[0-9]{5}-[0-9]{3}/.exec(productString)[0]
        } catch (err) {
        throw new Error('Fehlerhafte SKU!')
        }
    }

    private getProductStrings(email: string): Array<string> {
        const productString = this.extractProductString(email)
        return this.splitProductString(productString)
    }

    private extractProductString(email: string): string {
        try {
            return /Bestellung:\n\n(.*)\n\nKunden Bestellanmerkungen:/sg.exec(email)[1]
        } catch (err) {
            throw new Error('Keine Bestellung enthalten!')
        }
    }

    private splitProductString(productString: string): Array<string> {
        return productString.split('\n\n\n')
    }
}