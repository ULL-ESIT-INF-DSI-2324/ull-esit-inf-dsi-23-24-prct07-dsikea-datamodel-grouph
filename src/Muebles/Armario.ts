import { IDimensiones, Mueble } from "../abstract_classes/Mueble.js";

/**
 * Representa un armario, extendiendo las propiedades y métodos de la clase Mueble.
 */
export class Armario extends Mueble {
    /**
     * @param numeroPuertas_ El número de puertas del armario.
     * @param tieneCajones_ Indica si el armario tiene cajones.
     */
    private numeroPuertas_: number;
    private tieneCajones_: boolean;

    /**
     * Inicializa una nueva instancia de la clase Armario.
     */
    constructor(id: number, nombre: string, descripcion: string, material: string, dimensiones: IDimensiones, precio: number, numeroPuertas: number, tieneCajones: boolean) {
        super(id, nombre, descripcion, material, dimensiones, precio);
        this.numeroPuertas_ = numeroPuertas;
        this.tieneCajones_ = tieneCajones;
    }

    /**
     * Devuelve el número de puertas del armario.
     * @returns El número de puertas del armario.
     */
    public get numeroPuertas(): number {
        return this.numeroPuertas_;
    }

    /**
     * Devuelve si el armario tiene cajones.
     * @returns True si el armario tiene cajones.
     */
    public get tieneCajones(): boolean {
        return this.tieneCajones_;
    }

    /**
     * Establece el número de puertas del armario.
     * @param numeroPuertas El número de puertas del armario.
     */
    public set numeroPuertas(numeroPuertas: number) {
        this.numeroPuertas_ = numeroPuertas;
    }

    /**
     * Establece si el armario tiene cajones.
     * @param tieneCajones True si el armario tiene cajones.
     */
    public set tieneCajones(tieneCajones: boolean) {
        this.tieneCajones_ = tieneCajones;
    }

    /**
     * Convierte el armario a un objeto JSON.
     * @returns Un objeto que representa el armario.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            numeroPuertas: this.numeroPuertas,
            tieneCajones: this.tieneCajones,
        };
    }
}

