import { expect, it } from "vitest";
import Product from "./Product";

it('has sku, color and quantity attributes', () => {
    const product = new Product()

    expect(Object.getOwnPropertyNames(product)).toContain('sku')
    expect(Object.getOwnPropertyNames(product)).toContain('color')
    expect(Object.getOwnPropertyNames(product)).toContain('quantity')
})
