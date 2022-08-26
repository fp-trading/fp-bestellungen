export default class CityParser {
    parse(cityLine): [ string, Error? ] {
        try {
            return [ this.tryToParseCity(cityLine) ]
        } catch (err) {
            return [ '', new Error('Stadt fehlerhaft!') ]
        }
    }

    private tryToParseCity(cityLine: string): string {
        const city = this.parseCity(cityLine)

        if(city.length === 0) throw new Error()

        return city
    }

    private parseCity(cityLine: string): string {
        return cityLine.split(/,(?!.*,)/)[0].trim()
    }
}