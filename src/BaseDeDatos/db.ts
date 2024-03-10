import { Low } from 'lowdb';
//import FileSync from "lowdb/adapters/FileSync";
import { Mueble } from "../abstract_classes/Mueble.js";
import { Proveedor } from "../Entidades/Proveedores.js";
import { Cliente } from "../Entidades/Clientes.js";
import { JSONFile } from "lowdb/node";

interface DbSchema {
    muebles: Mueble[];
    proveedores: Proveedor[];
    clientes: Cliente[];
}
  
const adapter = new JSONFile<DbSchema>('db.json');
const db = new Low<DbSchema>(adapter);
  
// Inicialización de la base de datos
async function initializeDb() {
    await db.read();
    db.data ||= { muebles: [], proveedores: [], clientes: [] };
    await db.write();
}
  
// Agregar un mueble
async function addMueble(mueble: Mueble) {
    db.data?.muebles.push(mueble);
    await db.write();
}

async function getMuebles() {
    await db.read();
    return db.data?.muebles || [];
}
  
// Exportando la función de inicialización y las operaciones de la base de datos
export { initializeDb, addMueble, getMuebles};