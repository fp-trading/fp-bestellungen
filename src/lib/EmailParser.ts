import AddressParser from "./AddressParser";
import ProductsParser from "./ProductsParser";

export default class EmailParser {
    parse(email: string) {
        let error: Error

        [ error = error ] = new AddressParser().parse(email);
        [ error = error ] = new ProductsParser().parse(email);

        if (error !== undefined) throw error
    }
}