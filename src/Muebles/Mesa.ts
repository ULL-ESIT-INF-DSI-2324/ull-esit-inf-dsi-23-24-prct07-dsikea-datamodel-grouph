import { IDimensiones, Mueble } from "../abstract_classes/Mueble.js";

export class Mesa extends Mueble {
    private forma_: string;
    private plegable_: boolean;
    constructor(id: number, nombre: string, descripcion: string, material: string, dimensiones: IDimensiones, precio: number, forma: string, plegable: boolean) {
        super(id, nombre, descripcion, material, dimensiones, precio);
        this.forma_ = forma;
        this.plegable_ = plegable;
    }

    public get forma(): string {
        return this.forma_;
    }

    public get plegable(): boolean {
        return this.plegable_;
    }

    public set forma(forma: string) {
        this.forma_ = forma;
    }

    public set plegable(plegable: boolean) {
        this.plegable_ = plegable;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            forma: this.forma,
            plegable: this.plegable,
        };
    }
}