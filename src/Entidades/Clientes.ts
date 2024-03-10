import { Entidad } from "../abstract_classes/Entidad.js";

export class Cliente extends Entidad {
    constructor(id: number, nombre: string, contacto: number, direccion: string) {
        super(id, nombre, contacto, direccion);
        if (!this.validarTelefono(contacto)) { 
            throw new Error("El número de teléfono del cliente no es válido.");
        }
    }

    toJSON () {
        return {
            ...super.toJSON(),
        };
    }
}