# Reglas de Negocio

## Productos

- Un producto pertenece a un único proveedor.
- La combinación Referencia + Color + Curva + Proveedor debe ser única.
- Un producto puede existir sin foto.
- Un producto puede existir sin precio de venta.
- El precio de venta podrá modificarse en cualquier momento.
- Un producto puede crearse sin stock inicial.

## Inventario

- El inventario nunca se modifica manualmente.
- Todo cambio de inventario debe realizarse mediante un movimiento.
- Los tipos de movimiento son:
  - Entrada
  - Salida
  - Devolución
- El stock actual será actualizado automáticamente después de cada movimiento.

## Proveedores

- Un proveedor puede tener muchos productos.
- Una misma referencia puede existir en distintos proveedores.