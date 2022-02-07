// Se importan las librerias requeridas para que el proyecto funcione
const data = require("./data"); //Archivo json donde se tiene data de prueba local
const {PrismaClient} = require('@prisma/client'); // se crea la constante del prisma client 
const prisma = new PrismaClient(); // se crea la instancia del ORM
class OrdenCompraController {
    // Funcion para  Obtener todas las ordenes de compra que se encuentran registrados en la base de datos
    async getOrdenCompra() {
        // retornar todos los registros encontrados
        return new Promise((resolve, _) => resolve(
            prisma.ordenCompra.findMany()
        ));
    }
    // Obtener orden de compra por id
    async getOrdenCompra(id) {        
        return new Promise((resolve, reject) => {
            // se obtiene el Usuario
            let newTodo = prisma.ordenCompra.findUnique({
               where:{
                   IdOrdenCompra : parseInt(id)
               }
            });
            if (newTodo) {
                // Se retorna el objeto
                resolve(newTodo);
            } else {
                // Se retorna mensaje con error
                reject(`La orden de compra con id ${id} no existe en la base de datos`);
            }
        });
    }
    // Insertar orden de compra en base de datos
    async crearOrdenCompra(OrdenCompraData) {
        return new Promise((resolve, _) => {
            let newTodo = prisma.ordenCompra.create({
                data:{
                    Producto:OrdenCompraData["Producto"],
                    IdUsuario:OrdenCompraData["IdUsuario"],
                    Valor:OrdenCompraData["Valor"],
                } 
            });
            // Se retorna el objeto insertado
            resolve(newTodo);
        });
    }
    // Actualizando un usuario
    async updateOrdenCompra(OrdenCompraData) {
        //valido que datos vienen diferentes de null para actualizar
        return new Promise((resolve, _) => {
            let newTodo = prisma.ordenCompra.update({
                where:{
                    IdOrdenCompra : parseInt(OrdenCompraData["IdOrdenCompra"])
                },
                data:{
                    IdUsuario:UsuarioData["IdUsuario"],
                    Producto:UsuarioData["Producto"],
                    Valor:UsuarioData["Valor"],
                } 
            });
            // Se retorna el objeto Actualizado
            resolve(newTodo);
        });
    }
    // Funcion para eliminar un usuario 
    async deleteOrdenCompra(id) {
        return new Promise((resolve, reject) => {
            // get the todo
            let newTodo = prisma.ordenCompra.delete({
                where:{
                    IdOrdenCompra : parseInt(id)
                }
             });
            if (!newTodo) {
                reject(`El usuario con id ${id} no existe en la base de datos`);
            }
            // else, return a success message
            resolve(`El usuario fue eliminado correctamente`);
        });
    }
    //Funcion para disminuir el balance de la orden de compra 
    // Actualizando un usuario
    async updateUsuarioDisminuirBalance(UsuarioData) {
        //valido que datos vienen diferentes de null para actualizar
        return new Promise((resolve, _) => {
            let newTodo = prisma.usuarios.update({
                where:{
                    IdUsuario : parseInt(UsuarioData["IdUsuario"])
                },
                data:{                    
                    Balance:UsuarioData["Balance"],
                } 
            });
            // Se retorna el objeto Actualizado
            resolve(newTodo);
        });
    }
}
module.exports = OrdenCompraController;