export abstract class Entidad {
    constructor(protected id_: number, protected nombre_: string, protected contacto_: string, protected direccion_: string) {}

    public get id(): number {
        return this.id_;
    }

    public get nombre(): string {
        return this.nombre_;
    }

    public get contacto(): string {
        return this.contacto_;
    }

    public get direccion(): string {
        return this.direccion_;
    }

    public set id(id: number) {
        this.id_ = id;
    }

    public set nombre(nombre: string) {
        this.nombre_ = nombre;
    }

    public set contacto(contacto: string) {
        this.contacto_ = contacto;
    }

    public set direccion(direccion: string) {
        this.direccion_ = direccion;
    }

    public validarTelefono(telefono: number): boolean {
        // Expresión regular para validar un número de teléfono.
        const regexTelefono = /^[0-9]{9}$/;
        return regexTelefono.test(telefono.toString());
    }
}