export type IDimensiones = {
    ancho: number;
    alto: number;
    largo: number;
}

export abstract class Mueble {
    constructor(protected id_: number, protected nombre_: string, protected descripcion_: string, protected material_: string,
                protected dimensiones_: IDimensiones, protected precio_: number) {
        if (dimensiones_.ancho < 0 || dimensiones_.alto < 0 || dimensiones_.largo < 0) {
            throw new Error("Las dimensiones del mueble no pueden ser negativas.");
        }
    }
    
    public get id(): number {
        return this.id_;
    }

    public get nombre(): string {
        return this.nombre_;
    }

    public get descripcion(): string {
        return this.descripcion_;
    }

    public get material(): string {
        return this.material_;
    }

    public get dimensiones(): IDimensiones {
        return this.dimensiones_;
    }

    public get precio(): number {
        return this.precio_;
    }

    public set id(id: number) {
        this.id_ = id;
    }

    public set nombre(nombre: string) {
        this.nombre_ = nombre;
    }

    public set descripcion(descripcion: string) {
        this.descripcion_ = descripcion;
    }

    public set material(material: string) {
        this.material_ = material;
    }

    public set dimensiones(dimensiones: IDimensiones) {
        this.dimensiones_ = dimensiones;
    }

    public set precio(precio: number) {
        this.precio_ = precio;
    }

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