import { Entidad } from "../abstract_classes/Entidad.js";

export class Cliente extends Entidad {
    constructor(id: number, nombre: string, contacto: string, direccion: string) {
        super(id, nombre, contacto, direccion);
        if (!this.validarTelefono(parseInt(contacto))) { 
            throw new Error("El número de teléfono del cliente no es válido.");
        }
    }
}