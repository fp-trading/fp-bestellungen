export default class StreetNumberParser {
    parse(numberLine: string): [ string, Error? ] {
        try {
            return [ this.tryToParseNumber(numberLine) ]
        } catch (err) {
            return [ '', new Error('Hausnummer fehlerhaft!') ]
        }
    }

    private tryToParseNumber(streetLine: string): string {
        const number = this.parseNumber(streetLine)

        if(number.length === 0) throw new Error()

        return number
    }

    private parseNumber(streetLine: string): string {
        const streetNumberRegex = /[0-9]+[ a-zA-Z]{0,2}$/;
        return streetNumberRegex.exec(streetLine.trim())[0]
    }
}