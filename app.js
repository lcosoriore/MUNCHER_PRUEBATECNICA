const http = require("http");
const Controlador = require("./controller");
const OrdenCompraControlador = require("./OrdenCompraController");
const { getReqData } = require("./utils"); 
const PORT = process.env.PORT || 3000;
//Creo e inicio el servidor, esto para no usar ingun framework
const server = http.createServer(async (req, res) => {
    /** Se inicia el codigo para el CRUD de Usuarios */
    // /api/Usuarios : GET
    if (req.url === "/api/Usuarios" && req.method === "GET") {
        // Se obtienen todos los usuarios.
        const Usuarios = await new Controlador().getUsuarios();
        // Seteo el estado y el tipo de contenido
        res.writeHead(200, { "Content-Type": "application/json" });
        // Se retorna la data de los usuarios encontrados
        res.end(JSON.stringify(Usuarios));
    }
    // /api/Usuarios/:id : GET
    else if (req.url.match(/\/api\/Usuarios\/([0-9]+)/) && req.method === "GET") {
        try {
            // Se obtiene el id de la url
            const id = req.url.split("/")[3];
            // Obtener Usuario
            const usuario = await new Controlador().getUsuario(id);
            // Seteo el estado y el tipo de contenido
            res.writeHead(200, { "Content-Type": "application/json" });
            // Se retorna la data del usuarios encontrado
            res.end(JSON.stringify(usuario));
        } catch (error) {
            // set the status code and content-type
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the error
            res.end(JSON.stringify({ message: error }));
        }
    }
    // /api/Usuarios/:id : DELETE
    else if (req.url.match(/\/api\/Usuarios\/([0-9]+)/) && req.method === "DELETE") {
        try {
            // Se obtiene el id de la url
            const id = req.url.split("/")[3];
            // Llama funcion para eliminar usuario
            let message = await new Controlador().deleteUsuario(id);
            // Seteo el estado y el tipo de contenido
            res.writeHead(200, { "Content-Type": "application/json" });
            // Se retorna mensaje del resultado de la peticion
            res.end(JSON.stringify({ message }));
        } catch (error) {
            // Seteo estado y tipo de contenido
            res.writeHead(404, { "Content-Type": "application/json" });
            // Retorno mensaje de error
            res.end(JSON.stringify({ message: error }));
        }
    }
    // /api/Usuarios/:id : UPDATE
    else if (req.url === "/api/Usuarios" && req.method === "PATCH") {
        try {
            let UsuarioData = await getReqData(req);
            // Se llama funcion para actualizar Usuario
            let updated_todo = await new Controlador().updateUsuario(JSON.parse(UsuarioData));
            // set the status code and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the message
            res.end(JSON.stringify(updated_todo));
        } catch (error) {
             // Seteo estado y tipo de contenido
             res.writeHead(404, { "Content-Type": "application/json" });
             // Retorno mensaje de error
             res.end(JSON.stringify({ message: error }));
        }
    }
    // /api/Usuarios/ : POST
    else if (req.url === "/api/Usuarios" && req.method === "POST") {
        // Obtengo la data enviada en el request
        let UsuarioData = await getReqData(req);
        // Se llama a la funcion para realizar el insert en bd
        let Usuario = await new Controlador().crearUsuario(JSON.parse(UsuarioData));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(Usuario));
    }
    //Disminuir Balance
    else if (req.url === "/api/UsuarioDisminuirBalance" && req.method === "PATCH") {
        // Obtengo la data enviada en el request
        let DisminuirData = await getReqData(req);
        //busco el usuario para descontar del balance el valor de la orden de compra
        let dataInicialDisminuir=JSON.parse(DisminuirData);        
        const usuario = await new Controlador().getUsuario(dataInicialDisminuir["IdUsuario"]);
        if(usuario==null){
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "El usuario al cual le quiere disminuir el balance no existe" })); 
        }
        else{
                const NuevoBalance = parseInt(usuario["Balance"])-parseInt(dataInicialDisminuir["Valor"]);
                //Disminuir balance de usuario
                const UsuarioData ='{"IdUsuario":'+dataInicialDisminuir["IdUsuario"]+','+ '"Balance":'+NuevoBalance+"}";                  
                let Actualizacion =await new OrdenCompraControlador().updateUsuarioDisminuirBalance(JSON.parse(UsuarioData));
                // Seteo estado y tipo de contenido
                res.writeHead(200, { "Content-Type": "application/json" });                
                res.end(JSON.stringify(Actualizacion));                     
        }
    }
    else if (req.url === "/api/UsuarioAumentarBalance" && req.method === "PATCH") {
        // Obtengo la data enviada en el request
        let DisminuirData = await getReqData(req);
        //busco el usuario para descontar del balance el valor de la orden de compra
        let dataInicialDisminuir=JSON.parse(DisminuirData);        
        const usuario = await new Controlador().getUsuario(dataInicialDisminuir["IdUsuario"]);
        if(usuario==null){
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "El usuario al cual le quiere aumentar el balance no existe" })); 
        }
        else{
                const NuevoBalance = parseInt(usuario["Balance"])+parseInt(dataInicialDisminuir["Valor"]);
                //Disminuir balance de usuario
                const UsuarioData ='{"IdUsuario":'+dataInicialDisminuir["IdUsuario"]+','+ '"Balance":'+NuevoBalance+"}";                  
                let Actualizacion =await new OrdenCompraControlador().updateUsuarioDisminuirBalance(JSON.parse(UsuarioData));
                // Seteo estado y tipo de contenido
                res.writeHead(200, { "Content-Type": "application/json" });                
                res.end(JSON.stringify(Actualizacion));                     
        }
    }
    else if (req.url === "/api/TransferirBalance" && req.method === "PATCH") {
        // Obtengo la data enviada en el request
        let TransferirData = await getReqData(req);
        //busco el usuario para descontar del balance el valor de la orden de compra
        let dataInicialTransferir=JSON.parse(TransferirData);        
        const usuario = await new Controlador().getUsuario(dataInicialTransferir["IdUsuarioBenefactor"]);
        if(usuario==null){
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "El usuario al cual le quiere aumentar el balance no existe" })); 
        }
        else{
            if(usuario["Balance"]<dataInicialTransferir["ValorTransferir"]){
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "El balance disponible no alcansa para realizar la transferencia" }));
            }
            else
            {
                const usuarioTransferencia = await new Controlador().getUsuario(dataInicialTransferir["IdUsuarioTransferencia"]);
                if(usuarioTransferencia==null){
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "El usuario al cual le quiere transferir el balance no existe" })); 
                }
                else{
                    const NuevoBalanceBenefactor = parseInt(usuarioTransferencia["Balance"]) -  parseInt(dataInicialTransferir["ValorTransferir"]);
                    const NuevoBalanceTrans = parseInt(usuarioTransferencia["Balance"])+parseInt(dataInicialTransferir["ValorTransferir"]);
                    //Disminuir balance de usuario
                    const UsuarioData ='{"IdUsuario":'+dataInicialTransferir["IdUsuarioTransferencia"]+','+ '"Balance":'+NuevoBalanceTrans+"}";                  
                    let Actualizacion =await new OrdenCompraControlador().updateUsuarioDisminuirBalance(JSON.parse(UsuarioData));
                    //Actualizar el balance del benefactor
                    const UsuarioDataBenefactor ='{"IdUsuario":'+dataInicialTransferir["IdUsuarioTransferencia"]+','+ '"Balance":'+NuevoBalanceBenefactor+"}";                  
                    let ActualizacionBenefactor =await new OrdenCompraControlador().updateUsuarioDisminuirBalance(JSON.parse(UsuarioDataBenefactor));
                    // Seteo estado y tipo de contenido
                    res.writeHead(200, { "Content-Type": "application/json" });                
                    res.end(JSON.stringify(Actualizacion)); 
                }                      
            }                             
        }
    }
    /** Se finaliza el codigo para el CRUD de Usuarios */
    /** Se inicia el codigo para el CRUD de Orden de compra */
    if (req.url === "/api/OrdenCompra" && req.method === "GET") {
        // Se obtienen todas las ordenenes de compra registradas.
        const OrdenCompra = await new OrdenCompraControlador().getOrdenCompra();
        // Seteo el estado y el tipo de contenido
        res.writeHead(200, { "Content-Type": "application/json" });
        // Se retorna la data de los usuarios encontrados
        res.end(JSON.stringify(OrdenCompra));
    }
    // /api/OrdenCompra/:id : GET
    else if (req.url.match(/\/api\/OrdenCompra\/([0-9]+)/) && req.method === "GET") {
        try {
            // Se obtiene el id de la url
            const id = req.url.split("/")[3];
            // Obtener Orden Compra
            const OrdenCompra = await new OrdenCompraControlador().getOrdenCompra(id);
            // Seteo el estado y el tipo de contenido
            res.writeHead(200, { "Content-Type": "application/json" });
            // Se retorna la data de la orden de compra
            res.end(JSON.stringify(OrdenCompra));
        } catch (error) {
            // Seteo estado y tipo de contenido
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    }
    // /api/OrdenCompra/:id : DELETE
    else if (req.url.match(/\/api\/OrdenCompra\/([0-9]+)/) && req.method === "DELETE") {
        try {
            // Se obtiene el id de la url
            const id = req.url.split("/")[3];
            // Llama funcion para eliminar usuario
            let message = await new OrdenCompraControlador().deleteOrdenCompra(id);
            // Seteo el estado y el tipo de contenido
            res.writeHead(200, { "Content-Type": "application/json" });
            // Se retorna mensaje del resultado de la peticion
            res.end(JSON.stringify({ message }));
        } catch (error) {
            // Seteo estado y tipo de contenido
            res.writeHead(404, { "Content-Type": "application/json" });
            // Retorno mensaje de error
            res.end(JSON.stringify({ message: error }));
        }
    }
    // /api/OrdenCompra/:id : UPDATE
    else if (req.url === "/api/OrdenCompra" && req.method === "PATCH") {
        try {
            let OrdenCompraData = await getReqData(req);
            // Se llama funcion para actualizar Orden de compra
            let updated_OrdenC = await new OrdenCompraControlador().updateOrdenCompra(JSON.parse(OrdenCompraData));
            // Seteo estado y tipo de contenido
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updated_OrdenC));
        } catch (error) {
             // Seteo estado y tipo de contenido
             res.writeHead(404, { "Content-Type": "application/json" });
             // Retorno mensaje de error
             res.end(JSON.stringify({ message: error }));
        }
    }
    // /api/OrdenCompra/ : POST
    else if (req.url === "/api/OrdenCompra" && req.method === "POST") {
        // Obtengo la data enviada en el request
        let OrdenCompraData = await getReqData(req);
        //busco el usuario para descontar del balance el valor de la orden de compra
        let dataInicialOrden=JSON.parse(OrdenCompraData);        
        const usuario = await new Controlador().getUsuario(dataInicialOrden["IdUsuario"]);
        if(usuario==null){
           // Seteo estado y tipo de contenido
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "El usuario al cual le quiere crear una orden de compra no existe" })); 
        }
        else{
            //valido si el balance del usuario alcanza para crear la orden de compra
            if(dataInicialOrden["Valor"]>usuario["Balance"]){
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "El usuario no tiene el dinero suficiente para generar la orden de compra" })); 
            }
            else{
                // Se llama a la funcion para realizar el insert en bd
                let OrdenCompra = await new OrdenCompraControlador().crearOrdenCompra(JSON.parse(OrdenCompraData));
                const NuevoBalance = parseInt(usuario["Balance"])-parseInt(dataInicialOrden["Valor"]);
                //Disminuir balance de usuario
                const UsuarioData ='{"IdUsuario":'+dataInicialOrden["IdUsuario"]+','+ '"Balance":'+NuevoBalance+"}";                
                let OrdenCompraFinal = await new OrdenCompraControlador().crearOrdenCompra(JSON.parse(OrdenCompraData));                
                let Actualizacion =await new OrdenCompraControlador().updateUsuarioDisminuirBalance(JSON.parse(UsuarioData));
                // Seteo estado y tipo de contenido
                res.writeHead(200, { "Content-Type": "application/json" });                
                res.end(JSON.stringify(OrdenCompraFinal)); 
            }            
        }
    }
    /** Se Finaliza el codigo para el CRUD de Orden de compra */
    // Cuando no se encuentra la ruta
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Servicio no encontrado" }));
    }
});
server.listen(PORT, () => {
    console.log(`Servicio iniciado en puerto: ${PORT}`);
});