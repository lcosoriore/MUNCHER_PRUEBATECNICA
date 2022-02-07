function getReqData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            // Recibe la data enviada por el cliente
            req.on("data", (chunk) => {
                // Agrega informacion de la version al Body
                body += chunk.toString();
            });
            // Escucha hasta el final de la peticion
            req.on("end", () => {
                // Se devuelven los datos
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}
module.exports = { getReqData };