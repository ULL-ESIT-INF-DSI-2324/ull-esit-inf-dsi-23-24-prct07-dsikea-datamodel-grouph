import { Low } from 'lowdb';
import { Mueble } from "../abstract_classes/Mueble.js";
import { Proveedor } from "../Entidades/Proveedores.js";
import { Cliente } from "../Entidades/Clientes.js";
import { JSONFile } from "lowdb/node";

// Definición del esquema de la base de datos
interface DbSchema {
    muebles: Mueble[];
    proveedores: Proveedor[];
    clientes: Cliente[];
}

// Creación de la base de datos
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

// Eliminar un mueble
async function deleteMueble(id: number) {
    if (db.data) {
        db.data.muebles = db.data.muebles.filter(mueble => mueble.id !== id);
        await db.write();
    }
}

// Modificar un mueble
async function modifyMueble(mueble: Mueble) {
    if (db.data) {
        db.data.muebles = db.data.muebles.map(m => m === mueble ? mueble : m);
        await db.write();
    }
}

// Obtener todos los muebles
async function getMuebles() {
    await db.read();
    return db.data?.muebles || [];
}

async function getSilla() {
    await db.read();
    return db.data?.muebles || [];
}

// Añadir un proveedor
async function addProveedor(proveedor: Proveedor) {
    db.data?.proveedores.push(proveedor);
    await db.write();
}

// Eliminar un proveedor
async function deleteProveedor(id: number) {
    if (db.data) {
        db.data.proveedores = db.data.proveedores.filter(proveedor => proveedor.id !== id);
        await db.write();
    }
}



// Modificar un proveedor
async function modifyProveedor(proveedor: Proveedor) {
    if (db.data) {
        db.data.proveedores = db.data.proveedores.map(p => p === proveedor ? proveedor : p);
        await db.write();
    }
}

// Obtener todos los proveedores
async function getProveedores() {
    await db.read();
    return db.data?.proveedores || [];
}

// Añadir un cliente
async function addCliente(cliente: Cliente) {
    db.data?.clientes.push(cliente);
    await db.write();
}

// Eliminar un cliente
async function deleteCliente(id: number) {
    if (db.data) {
        db.data.clientes = db.data.clientes.filter(cliente => cliente.id !== id);
        await db.write();
    }
}

// Modificar un cliente
async function modifyCliente(cliente: Cliente) {
    if (db.data) {
        db.data.clientes = db.data.clientes.map(c => c === cliente ? cliente : c);
        await db.write();
    }
}

// Obtener todos los clientes
async function getClientes() {
    await db.read();
    return db.data?.clientes || [];
}

async function idEsUnico(id: number) {
    await db.read(); // Asegúrate de que db está actualizado
    return !db.data?.muebles.some(mueble => mueble.id === id);
}
  
// Exportando la función de inicialización y las operaciones de la base de datos
export { initializeDb, addMueble, deleteMueble, modifyMueble, getMuebles, addProveedor, deleteProveedor, 
         modifyProveedor, getProveedores, addCliente, deleteCliente, modifyCliente, getClientes, idEsUnico, db};