-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "precioPorPeso" DECIMAL NOT NULL DEFAULT 0,
    "precioPorUnidad" DECIMAL NOT NULL DEFAULT 0
);
INSERT INTO "new_Producto" ("codigo", "id", "nombre", "precioPorPeso", "precioPorUnidad") SELECT "codigo", "id", "nombre", "precioPorPeso", "precioPorUnidad" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
CREATE UNIQUE INDEX "Producto_nombre_key" ON "Producto"("nombre");
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
