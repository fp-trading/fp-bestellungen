import Address, { address } from "./Address";
import Product from "./Product";
import { products } from "./ProductStore";

export default class EmailParser {
    private streetNumberRegex = /[0-9]+[ a-zA-Z]{0,2}$/;

    parse(email: string) {
        this.parseAddress(email)
        this.parseProducts(email)
    }

    private parseProducts(email: string) {
        const productStrings = this.getProductStrings(email)

        products.update(u => {
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
    
    private parseAddress(email: string) {
        let addressLines = this.getAddressLines(email)
        
        address.set(new Address(
            this.parseName(addressLines.name),
            this.parsePhone(addressLines.rest),
            this.parseStreet(addressLines.street),
            this.parseNumber(addressLines.street),
            this.parseZipCode(addressLines.zip),
            this.parseCity(addressLines.city),
            this.parseCompany(addressLines.name)
        ))
    }
    
    private getAddressLines(email: string): { name: string, street: string, city: string, zip: string, rest: string } {
        const addressString = this.extractAddressString(email)
        return this.splitAddressString(addressString)
    }
    
    private extractAddressString(email: string): string {
        return /Lieferadresse:\n\n(.*)\n\nKunden Email:/sg.exec(email)[1]
    }
    
    private splitAddressString(addressString: string): { name: string, street: string, city: string, zip: string, rest: string } {
        const [nameLine, streetLine, cityLine, zipLine, ...rest] = addressString.split('\n\n')
        
        return {
            name: nameLine,
            street: streetLine,
            city: cityLine,
            zip: zipLine,
            rest: rest.join(' ')
        }
    }
    
    private parseName(nameLine: string): string {
        return nameLine.split('|')[0].trim()
    }
    
    private parseCompany(nameLine: string): string {
        return nameLine.split('|')[1].trim()
    }
    
    private parsePhone(restLine: string): string {
        return /Phone: (.*)/.exec(restLine)[1]
            .replace(/[^0-9+]/g, '')
            .replace(/^0049/, '0')
            .replace(/^\+49/, '0')
    }

    private parseStreet(streetLine: string): string {
        return streetLine.replace(this.streetNumberRegex, '').trim()
    }

    private parseNumber(streetLine: string): string {
        return this.streetNumberRegex.exec(streetLine.trim())[0]
    }

    private parseZipCode(zipLine: string): string {
        return /[0-9]{5}/.exec(zipLine)[0].toString()
    }

    private parseCity(cityLine: string): string {
        return cityLine.split(/,(?!.*,)/)[0].trim()
    }
}