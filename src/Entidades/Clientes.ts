import { Entidad } from "../abstract_classes/Entidad.js";

/**
 * Representa un cliente, heredando las propiedades y métodos de la clase Entidad.
 */
export class Cliente extends Entidad {
    /**
     * Inicializa una nueva instancia de la clase Cliente.
     * @param id El identificador único del cliente.
     * @param nombre El nombre del cliente.
     * @param contacto El número de contacto del cliente.
     * @param direccion La dirección del cliente.
     * @throws {Error} Si el número de teléfono no es válido.
     */
    constructor(id: number, nombre: string, contacto: number, direccion: string) {
        super(id, nombre, contacto, direccion);
        if (!this.validarTelefono(contacto)) { 
            throw new Error("El número de teléfono del cliente no es válido.");
        }
    }

    /**
     * Convierte el cliente a un objeto JSON.
     * @returns Un objeto que representa el cliente, incluyendo todas las propiedades heredadas.
     */
    toJSON () {
        return {
            ...super.toJSON(),
        };
    }
}