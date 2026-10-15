import store from "../../content/store.json";
import hero from "../../content/hero.json";
import categories from "../../content/categories.json";
import products from "../../content/products.json";
import { validateContent } from "./validate";

// Se ejecuta una sola vez en el build. Si el contenido es inválido, el build falla.
export const content = validateContent({ store, hero, categories, products });
