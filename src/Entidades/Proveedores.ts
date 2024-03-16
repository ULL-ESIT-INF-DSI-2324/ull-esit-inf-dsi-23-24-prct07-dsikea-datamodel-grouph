import { Entidad } from "../abstract_classes/Entidad.js";

/**
 * Representa un proveedor, heredando las propiedades y métodos de la clase Entidad.
 */
export class Proveedor extends Entidad {
    /**
     * Inicializa una nueva instancia de la clase Proveedor.
     * @param id El identificador único del proveedor.
     * @param nombre El nombre del proveedor.
     * @param contacto El número de contacto del proveedor.
     * @param direccion La dirección del proveedor.
     * @throws {Error} Si el número de teléfono no es válido.
     */
    constructor(id: number, nombre: string, contacto: number, direccion: string) {
        super(id, nombre, contacto, direccion);
        if (!this.validarTelefono(contacto)) { 
            throw new Error("El número de teléfono del proveedor no es válido.");
        }
    }

    /**
     * Convierte el proveedor a un objeto JSON.
     * @returns Un objeto que representa el proveedor, incluyendo todas las propiedades heredadas.
     */
    toJSON () {
        return {
            ...super.toJSON(),
        };
    }
}