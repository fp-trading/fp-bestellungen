import Product from "../Product";
import { products } from "../ProductStore";

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

        products.update(u => {
            u = []

            productStrings.forEach(product => {
                u.push(this.parseProduct(product))
            })

            return u
        })
    }

    private parseProduct(productString: string): Product {
        return new Product(
            this.parseSKU(productString),
            this.parseColor(productString),
            this.parseQuantity(productString)
        )
    }

    private parseQuantity(productString: string): string {
        return /Anzahl: ([0-9]+)/.exec(productString)[1]
    }

    private parseColor(productString: string): string {
        const colorRegex = /Farbton: (.*)/
        return colorRegex.test(productString) ? colorRegex.exec(productString)[1] : ''
    }

    private parseSKU(productString: string): string {
        return /[0-9]{5}-[0-9]{3}/.exec(productString)[0]
    }

    private getProductStrings(email: string): Array<string> {
        const productString = this.extractProductString(email)
        return this.splitProductString(productString)
    }

    private extractProductString(email: string): string {
        return /Bestellung:\n\n(.*)\n\nKunden Bestellanmerkungen:/sg.exec(email)[1]
    }

    private splitProductString(productString: string): Array<string> {
        return productString.split('\n\n\n')
    }
}