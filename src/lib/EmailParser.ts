import Address, { address } from "./Address";

export default class EmailParser {
    parse(email: string) {
        this.parseAddress(email)
    }

    parseAddress(email: string) {
        let parsedAddress = new Address()
        let addressLines = this.getAddressLines(email)

        parsedAddress.name = this.parseName(addressLines.name)
        parsedAddress.company = this.parseCompany(addressLines.name)

        address.set(parsedAddress)
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
        const [nameLine, ...rest] = addressString.split('\n\n')

        return {
            name: nameLine,
            street: '',
            city: '',
            zip: '',
            rest: ''
        }
    }

    private parseName(nameLine: string): string {
        return nameLine.split('|')[0].trim()
    }

    private parseCompany(nameLine: string): string {
        return nameLine.split('|')[1].trim()
    }
}