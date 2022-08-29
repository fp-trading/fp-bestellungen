import StreetNumberParser from "./StreetNumberParser";
import StreetParser from "./StreetParser";
import ZipCodeParser from "./ZipCodeParser";
import CityParser from "./CityParser";
import CompanyParser from "./CompanyParser";
import NameParser from "./NameParser";
import PhoneParser from "./PhoneParser";
import Address, { address } from "../Address";
import CommissionParser from "./CommissionParser";

export default class AddressParser {
    parse(email: string): [Error?] {
        try {
            this.parseAddress(email);
        } catch (err) {
            return [err]
        }
        return []
    }

    private parseAddress(email: string) {
        let addressLines = this.getAddressLines(email)
        let name: string, phone: string, street: string, number: string, zip: string, city: string, company: string, commission: string, error: Error

        [ name, error ] = new NameParser().parse(addressLines.name);
        [ phone, error = error ] = new PhoneParser().parse(addressLines.rest);
        [ street, error = error ] = new StreetParser().parse(addressLines.street);
        [ number, error = error ] = new StreetNumberParser().parse(addressLines.street);
        [ zip, error = error ] = new ZipCodeParser().parse(addressLines.zip);
        [ city, error = error ] = new CityParser().parse(addressLines.city);
        [ company, error = error ] = new CompanyParser().parse(addressLines.name);
        [ commission, error = error ] = new CommissionParser().parse(email)

        address.set(new Address(name, phone, street, number, zip, city, company, commission))

        if (error !== null) {
            throw error
        }
    }
    
    private getAddressLines(email: string): { name: string, street: string, city: string, zip: string, rest: string } {
        const addressString = this.tryToExtractAddressString(email)
        return this.tryToSplitAddressString(addressString)
    }

    private tryToExtractAddressString(email: string): string {
        try {
            return this.extractAddressString(email)
        } catch (err) {
            throw new Error('Adresse nicht gefunden!')
        } 
    }
    
    private extractAddressString(email: string): string {
        return /Lieferadresse:\n\n(.*)\n\nKunden Email:/sg.exec(email)[1]
    }

    private tryToSplitAddressString(addressString: string): { name: string, street: string, city: string, zip: string, rest: string } {
        const addressLines = this.splitAddressString(addressString)

        if(!addressLines.rest.includes('Phone:')) {
            throw new Error('Adresse fehlerhaft!')
        }
        
        return addressLines
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
}