export default class StreetParser {

    parse(streetLine): [ string, Error? ] {
        try {
            return [ this.tryToParseStreet(streetLine) ]
        } catch (err) {
            return [ '', new Error('Straße fehlerhaft!') ]
        }
    }

    private tryToParseStreet(streetLine: string): string {
        const street = this.parseStreet(streetLine)

        if (street.length === 0) throw Error()

        return street
    }

    private parseStreet(streetLine: string): string {
        const streetNumberRegex = /[0-9]+[ a-zA-Z]{0,2}$/;
        return streetLine.replace(streetNumberRegex, '').trim()
    }
}