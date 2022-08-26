export default class ZipCodeParser {
    parse(zipLine: string): [string, Error?] {
        try {
            return [ this.tryToParseZipCode(zipLine) ]
        } catch (err) {
            return [ '', new Error('Postleitzahl fehlerhaft!') ]
        }
    }

    private tryToParseZipCode(zipLine: string): string {
        const zip = this.parseZipCode(zipLine)

        if(zip.length !== 5) throw new Error()

        return zip
    }

    private parseZipCode(zipLine: string): string {
        return /[0-9]{5}/.exec(zipLine)[0].toString()
    }
}