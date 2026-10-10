import { es } from "./locales/es";

/**
 * The Spanish dictionary is the source of truth for the shape of every locale:
 * `en` is declared as `Dict`, so a missing or renamed key fails the build.
 */
export type Dict = typeof es;
