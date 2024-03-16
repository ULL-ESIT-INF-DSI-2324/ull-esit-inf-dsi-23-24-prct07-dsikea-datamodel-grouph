/**
 * Define un tipo para las dimensiones de un mueble (ancho, alto, largo).
 */
export type IDimensiones = {
    ancho: number;
    alto: number;
    largo: number;
}

/**
 * Representa un mueble abstracto con propiedades comunes como id, nombre, descripción, material, dimensiones y precio.
 * @abstract
 */
export abstract class Mueble {
    /**
     * @param id_ El identificador único del mueble.
     * @param nombre_ El nombre del mueble.
     * @param descripcion_ La descripción del mueble.
     * @param material_ El material del que está hecho el mueble.
     * @param dimensiones_ Las dimensiones del mueble.
     * @param precio_ El precio del mueble.
     * @throws {Error} Si alguna de las dimensiones es negativa.
     */
    constructor(protected id_: number, protected nombre_: string, protected descripcion_: string, protected material_: string,
                protected dimensiones_: IDimensiones, protected precio_: number) {
        if (dimensiones_.ancho < 0 || dimensiones_.alto < 0 || dimensiones_.largo < 0) {
            throw new Error("Las dimensiones del mueble no pueden ser negativas.");
        }
    }
    
    /**
     * Obtiene el identificador del mueble.
     * @returns El identificador.
     */
    public get id(): number {
        return this.id_;
    }

    /**
     * Obtiene el nombre del mueble.
     * @returns El nombre.
     */
    public get nombre(): string {
        return this.nombre_;
    }

    /**
     * Obtiene la descripción del mueble.
     * @returns La descripción.
     */
    public get descripcion(): string {
        return this.descripcion_;
    }

    /**
     * Obtiene el material del mueble.
     * @returns El material.
     */
    public get material(): string {
        return this.material_;
    }

    /**
     * Obtiene las dimensiones del mueble.
     * @returns Las dimensiones.
     */
    public get dimensiones(): IDimensiones {
        return this.dimensiones_;
    }

    /**
     * Obtiene el precio del mueble.
     * @returns El precio.
     */
    public get precio(): number {
        return this.precio_;
    }

    /**
     * Establece un nuevo identificador para el mueble.
     * @param id El nuevo identificador.
     */
    public set id(id: number) {
        this.id_ = id;
    }

    /**
     * Establece un nuevo nombre para el mueble.
     * @param nombre El nuevo nombre.
     */
    public set nombre(nombre: string) {
        this.nombre_ = nombre;
    }

    /**
     * Establece una nueva descripción para el mueble.
     * @param descripcion La nueva descripción.
     */
    public set descripcion(descripcion: string) {
        this.descripcion_ = descripcion;
    }

    /**
     * Establece un nuevo material para el mueble.
     * @param material El nuevo material.
     */
    public set material(material: string) {
        this.material_ = material;
    }

    /**
     * Establece unas nuevas dimensiones para el mueble.
     * @param dimensiones Las nuevas dimensiones.
     * @throws {Error} Si alguna de las dimensiones es negativa.
     */
    public set dimensiones(dimensiones: IDimensiones) {
        this.dimensiones_ = dimensiones;
    }

    /**
     * Establece un nuevo precio para el mueble.
     * @param precio El nuevo precio.
     */
    public set precio(precio: number) {
        this.precio_ = precio;
    }

    /**
     * Convierte el mueble a un objeto JSON.
     * @returns Un objeto que representa el mueble.
     */
    toJSON() {
        return {
            id: this.id_,
            nombre: this.nombre_,
            descripcion: this.descripcion_,
            material: this.material_,
            dimensiones: this.dimensiones_,
            precio: this.precio_,
        };
    }
}