import Address, { address } from "./Address";

export default class EmailParser {
    private streetNumberRegex = /[0-9]+[ a-zA-Z]{0,2}$/;

    parse(email: string) {
        address.set(this.parseAddress(email))
    }
    
    parseAddress(email: string) {
        let addressLines = this.getAddressLines(email)
        
        return new Address(
            this.parseName(addressLines.name),
            this.parsePhone(addressLines.rest),
            this.parseStreet(addressLines.street),
            this.parseNumber(addressLines.street),
            this.parseZipCode(addressLines.zip),
            this.parseCity(addressLines.city),
            this.parseCompany(addressLines.name)
        )
    }
    
    private getAddressLines(email: string): { name: string, street: string, city: string, zip: string, rest: string } {
        const addressString = this.extractAddressString(email)
        return this.splitAddressString(addressString)
    }
    
    private extractAddressString(email: string): string {
        const addressRegex = /Lieferadresse:\n\n(.*)\n\nKunden Email:/sg
        return addressRegex.exec(email)[1]
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