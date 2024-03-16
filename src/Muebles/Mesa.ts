import { IDimensiones, Mueble } from "../abstract_classes/Mueble.js";

/**
 * Representa una mesa, extendiendo las propiedades y métodos de la clase Mueble.
 */
export class Mesa extends Mueble {
    /**
     * @param forma_ La forma de la mesa.
     * @param plegable_ Indica si la mesa es plegable.
     */
    private forma_: string;
    private plegable_: boolean;

    /**
     * Inicializa una nueva instancia de la clase Mesa.
     */
    constructor(id: number, nombre: string, descripcion: string, material: string, dimensiones: IDimensiones, precio: number, forma: string, plegable: boolean) {
        super(id, nombre, descripcion, material, dimensiones, precio);
        this.forma_ = forma;
        this.plegable_ = plegable;
    }

    /**
     * Devuelve la forma de la mesa.
     * @returns La forma de la mesa.
     */
    public get forma(): string {
        return this.forma_;
    }

    /**
     * Devuelve si la mesa es plegable.
     * @returns True si la mesa es plegable.
     */
    public get plegable(): boolean {
        return this.plegable_;
    }

    /**
     * Establece la forma de la mesa.
     * @param forma La forma de la mesa.
     */
    public set forma(forma: string) {
        this.forma_ = forma;
    }

    /**
     * Establece si la mesa es plegable.
     * @param plegable True si la mesa es plegable.
     */
    public set plegable(plegable: boolean) {
        this.plegable_ = plegable;
    }

    /**
     * Convierte la mesa a un objeto JSON.
     * @returns Un objeto que representa la mesa.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            forma: this.forma,
            plegable: this.plegable,
        };
    }
}