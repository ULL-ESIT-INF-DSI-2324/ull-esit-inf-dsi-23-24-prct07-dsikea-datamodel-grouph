/**
 * Representa una entidad abstracta con propiedades comunes como id, nombre, contacto y dirección.
 * @abstract
 */
export abstract class Entidad {
    /**
     * @param id_ El identificador único de la entidad.
     * @param nombre_ El nombre de la entidad.
     * @param contacto_ El número de contacto de la entidad.
     * @param direccion_ La dirección de la entidad.
     */
    constructor(protected id_: number, protected nombre_: string, protected contacto_: number, protected direccion_: string) {}

    /**
     * Obtiene el identificador de la entidad.
     * @returns El identificador.
     */
    public get id(): number {
        return this.id_;
    }

    /**
     * Obtiene el nombre de la entidad.
     * @returns El nombre.
     */
    public get nombre(): string {
        return this.nombre_;
    }

    /**
     * Obtiene el contacto de la entidad.
     * @returns El número de contacto.
     */
    public get contacto(): number {
        return this.contacto_;
    }

    /**
     * Obtiene la dirección de la entidad.
     * @returns La dirección.
     */
    public get direccion(): string {
        return this.direccion_;
    }

    /**
     * Establece un nuevo identificador para la entidad.
     * @param id El nuevo identificador.
     */
    public set id(id: number) {
        this.id_ = id;
    }

    /**
     * Establece un nuevo nombre para la entidad.
     * @param nombre El nuevo nombre.
     */
    public set nombre(nombre: string) {
        this.nombre_ = nombre;
    }

    /**
     * Establece un nuevo contacto para la entidad.
     * @param contacto El nuevo número de contacto.
     */
    public set contacto(contacto: number) {
        this.contacto_ = contacto;
    }

    /**
     * Establece una nueva dirección para la entidad.
     * @param direccion La nueva dirección.
     */
    public set direccion(direccion: string) {
        this.direccion_ = direccion;
    }

    /**
     * Valida el número de teléfono proporcionado.
     * @param telefono El número de teléfono a validar.
     * @returns True si el número es válido, de lo contrario false.
     */
    public validarTelefono(telefono: number): boolean {
        // Expresión regular para validar un número de teléfono.
        const regexTelefono = /^[0-9]{9}$/;
        return regexTelefono.test(telefono.toString());
    }

    /**
     * Convierte la entidad a un objeto JSON.
     * @returns Un objeto que representa la entidad.
     */
    toJSON() {
        return {
            id: this.id_,
            nombre: this.nombre_,
            contacto: this.contacto_,
            direccion: this.direccion_,
        };
    }
}