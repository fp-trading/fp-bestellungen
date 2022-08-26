import AddressParser from "./AddressParser";
import ProductsParser from "./ProductsParser";

export default class EmailParser {
    parse(email: string) {
        this.emailIsNotEmpty(email)

        let error: Error

        [ error = error ] = new AddressParser().parse(email);
        [ error = error ] = new ProductsParser().parse(email);

        if (error !== undefined) throw error
    }

    private emailIsNotEmpty(email: string) {
        if (email.length === 0) throw new Error('Zwischenablage ist leer!')
    }
}