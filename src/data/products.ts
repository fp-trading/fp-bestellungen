import { writable, type Writable } from "svelte/store";
import ProductStore from '../lib/ProductStore';

export const products: Writable<ProductStore> = writable(new ProductStore())