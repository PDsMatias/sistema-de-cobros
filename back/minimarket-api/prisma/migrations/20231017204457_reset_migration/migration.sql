-- CreateTable
CREATE TABLE "Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "precioPorPeso" DECIMAL NOT NULL DEFAULT 0,
    "precioPorUnidad" DECIMAL NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Producto_nombre_key" ON "Producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");
