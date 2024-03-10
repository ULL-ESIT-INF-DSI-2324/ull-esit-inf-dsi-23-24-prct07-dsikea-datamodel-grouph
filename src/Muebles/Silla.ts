import { IDimensiones, Mueble } from "../abstract_classes/Mueble.js";

export class Silla extends Mueble {
    private inclinable_: boolean;
    private reposabrazos_: boolean;
    constructor(id: number, nombre: string, descripcion: string, material: string, dimensiones: IDimensiones, precio: number, inclinable: boolean, reposabrazos: boolean) {
        super(id, nombre, descripcion, material, dimensiones, precio);
        this.inclinable_ = inclinable;
        this.reposabrazos_ = reposabrazos;
    }

    public get inclinable(): boolean {
        return this.inclinable_;
    }

    public get reposabrazos(): boolean {
        return this.reposabrazos_;
    }

    public set inclinable(inclinable: boolean) {
        this.inclinable_ = inclinable;
    }

    public set reposabrazos(reposabrazos: boolean) {
        this.reposabrazos_ = reposabrazos;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            inclinable: this.inclinable,
            reposabrazos: this.reposabrazos,
        };
    }
}