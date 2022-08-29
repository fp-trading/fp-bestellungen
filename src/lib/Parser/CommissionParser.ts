export default class CommissionParser {
    parse(email: string): [ string, Error? ] {
        try {
            return [ this.parseCommission(email) ]
        } catch (err) {
            return [ '', new Error('Auftragsnummer fehlerhaft!') ]
        }
    }

    private parseCommission(email:string): string {
        return /#[0-9]{8,}/.exec(email)[0]
    }
}