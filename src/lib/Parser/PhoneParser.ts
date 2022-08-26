export default class PhoneParser {
    parse(restLine): [ string, Error? ] {
        try {
            return [ this.tryToParsePhone(restLine) ]
        } catch (err) {
            return [ '', new Error('Telefonnummer fehlerhaft!') ]
        }
    }

    private tryToParsePhone(restLine: string): string {
        const phone = this.parsePhone(restLine)

        if (phone.length > 3) {
            return phone
        } else {
            throw new Error()
        }
    }

    private parsePhone(restLine: string): string {
        return /Phone: (.*)/.exec(restLine)[1]
            .replace(/[^0-9+]/g, '')
            .replace(/^0049/, '0')
            .replace(/^\+49/, '0')
    }
}