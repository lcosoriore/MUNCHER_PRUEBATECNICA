-- CreateTable
CREATE TABLE `usuarios` (
    `IdUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Correo` VARCHAR(191) NOT NULL,
    `Balance` INTEGER NOT NULL,

    PRIMARY KEY (`IdUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenCompra` (
    `IdOrdenCompra` INTEGER NOT NULL AUTO_INCREMENT,
    `IdUsuario` INTEGER NOT NULL,
    `Producto` VARCHAR(191) NOT NULL,
    `Valor` INTEGER NOT NULL,

    PRIMARY KEY (`IdOrdenCompra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
