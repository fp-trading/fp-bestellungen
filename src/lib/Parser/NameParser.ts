export default class NameParser {
    parse(nameLine): [ string, Error? ] {
        try {
            return [ this.tryToParseName(nameLine) ]
        } catch (err) {
            return [ '', new Error('Name fehlerhaft!') ]
        }
    }

    private tryToParseName(nameLine: string): string {
        const name = this.parseName(nameLine)

        if (name.length === 0) {
            throw new Error()
        }

        return name
    }
    
    private parseName(nameLine: string): string {
        return nameLine.split('|')[0].trim()
    }
}