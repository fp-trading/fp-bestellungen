export default class CompanyParser {
    parse(nameLine): [ string, Error? ] {
        try {
            return [ this.tryToParseCompany(nameLine) ]
        } catch (err) {
            return [ '', new Error('Fehlendes "|" in der Namenzeile!') ]
        }
    }

    private tryToParseCompany(nameLine: string): string {
        try {
            return this.parseCompany(nameLine)
        } catch (err) {
            throw new Error()
        }
    }
    
    private parseCompany(nameLine: string): string {
        return nameLine.split('|')[1].trim()
    }
}