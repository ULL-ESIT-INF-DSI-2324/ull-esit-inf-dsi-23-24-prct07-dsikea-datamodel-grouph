import { Low } from 'lowdb';
//import { Mueble } from "../abstract_classes/Mueble.js";
import { Proveedor } from "../Entidades/Proveedores.js";
import { Cliente } from "../Entidades/Clientes.js";
import { JSONFile } from "lowdb/node";

import { Silla } from '../Muebles/Silla.js';
import { Armario }  from '../Muebles/Armario.js';
import { Mesa } from '../Muebles/Mesa.js'

// Definición del esquema de la base de datos
interface DbSchema {
    sillas:Silla[];
    armarios:Armario[];
    mesas:Mesa[]
    proveedores: Proveedor[];
    clientes: Cliente[];
}

// Creación de la base de datos
const adapter = new JSONFile<DbSchema>('db.json');
const db = new Low<DbSchema>(adapter);
  
// Inicialización de la base de datos
async function initializeDb() {
    await db.read();
    db.data ||= { sillas: [], proveedores: [], clientes: [], mesas: [], armarios: [] };
    await db.write();
}
  
// Agregar un Aramrio
async function addArmario(mueble: Armario) {
    db.data?.armarios.push(mueble);
    await db.write();
}

async function addSilla(mueble: Silla) {
    db.data?.sillas.push(mueble);
    await db.write();
}

async function addMesa(mueble: Mesa) {
    db.data?.mesas.push(mueble);
    await db.write();
}

// Eliminar un mueble
async function deleteSilla(id: number) {
    if (db.data) {
        db.data.sillas = db.data.sillas.filter(mueble => mueble.id !== id);
        await db.write();
    }
}

async function deleteMesa(id: number) {
    if (db.data) {
        db.data.mesas = db.data.mesas.filter(mueble => mueble.id !== id);
        console.log(db.data.mesas);
        await db.write();
    }
}

async function deleteArmario(id: number) {
    if (db.data) {
        db.data.armarios = db.data.armarios.filter(mueble => mueble.id !== id);
        await db.write();
    }
}

// Modificar un mueble
async function modifyMesa(mueble: Mesa,id:number) {
    deleteMesa(id);
    addMesa(mueble);
}

// Modificar un mueble
async function modifyArmario(mueble: Armario,id:number) {
    deleteArmario(id);
    addArmario(mueble);
}

// Modificar un mueble
async function modifySilla(mueble: Silla,id:number) {
    deleteSilla(id);
    addSilla(mueble);
}

async function getSilla() {
    await db.read();
    return db.data?.sillas || [];
}

async function getMesa() {
    await db.read();
    return db.data?.mesas || [];
}

async function getArmario() {
    await db.read();
    return db.data?.armarios || [];
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
    return !(db.data?.armarios.some(mueble => mueble.id === id) || db.data?.sillas.some(mueble => mueble.id === id) || db.data?.mesas.some(mueble => mueble.id === id));
}
  
// Exportando la función de inicialización y las operaciones de la base de datos
export { initializeDb, addProveedor, deleteProveedor, getArmario, getMesa, getSilla, deleteArmario, deleteMesa, deleteSilla,
         modifyArmario, modifyMesa, modifySilla, addArmario, addSilla, addMesa, modifyProveedor, getProveedores, addCliente, 
         deleteCliente, modifyCliente, getClientes, idEsUnico, db};