// Se importan las librerias requeridas para que el proyecto funcione
const data = require("./data"); //Archivo json donde se tiene data de prueba local
const {PrismaClient} = require('@prisma/client'); // se crea la constante del prisma client 
const prisma = new PrismaClient(); // se crea la instancia del ORM
class Controller {
    // Funcion para  Obtener todos los usuarios que se encuentran registrados en la base de datos
    async getUsuarios() {
        // retornar todos los registros encontrados
        return new Promise((resolve, _) => resolve(
            prisma.usuarios.findMany()
        ));
    }
    // Obtener usuario por id
    async getUsuario(id) {        
        return new Promise((resolve, reject) => {
            // se obtiene el Usuario
            let newTodo = prisma.usuarios.findUnique({
               where:{
                   IdUsuario : parseInt(id)
               }
            });
            if (newTodo) {
                // Se retorna el objeto
                resolve(newTodo);
            } else {
                // Se retorna mensaje con error
                reject(`El usuario con id ${id} no existe en la base de datos`);
            }
        });
    }
    // Insertar Usuario en base de datos
    async crearUsuario(UsuarioData) {
        return new Promise((resolve, _) => {
            let newTodo = prisma.usuarios.create({
                data:{
                    Nombre:UsuarioData["Nombre"],
                    Correo:UsuarioData["Correo"],
                    Balance:UsuarioData["Balance"],
                } 
            });
            // Se retorna el objeto insertado
            resolve(newTodo);
        });
    }
    // Actualizando un usuario
    async updateUsuario(UsuarioData) {
        //valido que datos vienen diferentes de null para actualizar
        return new Promise((resolve, _) => {
            let newTodo = prisma.usuarios.update({
                where:{
                    IdUsuario : parseInt(UsuarioData["IdUsuario"])
                },
                data:{
                    Nombre:UsuarioData["Nombre"],
                    Correo:UsuarioData["Correo"],
                    Balance:UsuarioData["Balance"],
                } 
            });
            // Se retorna el objeto Actualizado
            resolve(newTodo);
        });
    }
    // Funcion para eliminar un usuario 
    async deleteUsuario(id) {
        return new Promise((resolve, reject) => {
            // get the todo
            let newTodo = prisma.usuarios.delete({
                where:{
                    IdUsuario : parseInt(id)
                }
             });
            if (!newTodo) {
                reject(`El usuario con id ${id} no existe en la base de datos`);
            }
            // else, return a success message
            resolve(`El usuario fue eliminado correctamente`);
        });
    }
    async updateUsuarioActualizarBalance(UsuarioData) {
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
module.exports = Controller;