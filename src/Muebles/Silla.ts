import { IDimensiones, Mueble } from "../abstract_classes/Mueble.js";

/**
 * Representa una silla, extendiendo las propiedades y métodos de la clase Mueble.
 */
export class Silla extends Mueble {
    /**
     * @param inclinable_ Indica si la silla es inclinable.
     * @param reposabrazos_ Indica si la silla tiene reposabrazos.
     */
    private inclinable_: boolean;
    private reposabrazos_: boolean;

    /**
     * Inicializa una nueva instancia de la clase Silla.
     */
    constructor(id: number, nombre: string, descripcion: string, material: string, dimensiones: IDimensiones, precio: number, inclinable: boolean, reposabrazos: boolean) {
        super(id, nombre, descripcion, material, dimensiones, precio);
        this.inclinable_ = inclinable;
        this.reposabrazos_ = reposabrazos;
    }

    /**
     * Devuelve si la silla es inclinable.
     * @returns True si la silla es inclinable.
     */
    public get inclinable(): boolean {
        return this.inclinable_;
    }

    /**
     * Devuelve si la silla tiene reposabrazos.
     * @returns True si la silla tiene reposabrazos.
     */
    public get reposabrazos(): boolean {
        return this.reposabrazos_;
    }

    /**
     * Establece si la silla es inclinable.
     * @param inclinable True si la silla es inclinable.
     */
    public set inclinable(inclinable: boolean) {
        this.inclinable_ = inclinable;
    }

    /**
     * Establece si la silla tiene reposabrazos.
     * @param reposabrazos True si la silla tiene reposabrazos.
     */
    public set reposabrazos(reposabrazos: boolean) {
        this.reposabrazos_ = reposabrazos;
    }

    /**
     * Convierte la silla a un objeto JSON.
     * @returns Un objeto que representa la silla.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            inclinable: this.inclinable,
            reposabrazos: this.reposabrazos,
        };
    }
}