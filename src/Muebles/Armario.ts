import { IDimensiones, Mueble } from "../abstract_classes/Mueble.js";

export class Armario extends Mueble {
    private numeroPuertas_: number;
    private tieneCajones_: boolean;
    constructor(id: number, nombre: string, descripcion: string, material: string, dimensiones: IDimensiones, precio: number, numeroPuertas: number, tieneCajones: boolean) {
        super(id, nombre, descripcion, material, dimensiones, precio);
        this.numeroPuertas_ = numeroPuertas;
        this.tieneCajones_ = tieneCajones;
    }

    public get numeroPuertas(): number {
        return this.numeroPuertas_;
    }

    public get tieneCajones(): boolean {
        return this.tieneCajones_;
    }

    public set numeroPuertas(numeroPuertas: number) {
        this.numeroPuertas_ = numeroPuertas;
    }

    public set tieneCajones(tieneCajones: boolean) {
        this.tieneCajones_ = tieneCajones;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            numeroPuertas: this.numeroPuertas,
            tieneCajones: this.tieneCajones,
        };
    }
}

