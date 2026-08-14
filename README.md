# Sistema de Gestión para Distribuidora de Calzado

Sistema empresarial para la gestión de una distribuidora de calzado, desarrollado con .NET y Next.js y disponible como aplicación de escritorio para Windows.

Permite administrar productos, proveedores, clientes, inventario y ventas, además de generar remisiones en PDF.

---

## Características

### 📦 Gestión de productos

- Crear, editar y eliminar productos.
- Registro de referencia, color, curva y proveedor.
- Fotografía por producto.
- Precio de venta.
- Control de existencias.

### 🚚 Gestión de proveedores

- Crear, editar y eliminar proveedores.
- Asociación automática de productos con proveedores.

### 📊 Control de inventario

- Entradas de mercancía.
- Salidas de inventario.
- Registro de movimientos.
- Soporte para registrar cantidades por pares o docenas.
- Búsqueda rápida de productos.
- Visualización de fotografía y datos del producto antes de registrar un movimiento.

### 💰 Gestión de ventas

- Búsqueda inteligente de productos.
- Venta por pares o docenas.
- Validación automática del stock disponible.
- Descuento automático del inventario.
- Cálculo automático del total.
- Historial de ventas.
- Generación de remisiones en PDF.

### 📄 Remisiones

- Generación automática mediante QuestPDF.
- Descarga directa desde la aplicación.

---

# Tecnologías

## Backend

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- MediatR
- CQRS
- Clean Architecture
- QuestPDF

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

---

# Arquitectura

## Backend

```text
backend/src/

Calzado.API
Calzado.Application
Calzado.Domain
Calzado.Infrastructure
```

## Frontend

```text
frontend/src/

app
components
features
lib
```

El backend implementa **Clean Architecture** y el patrón **CQRS**, separando las responsabilidades entre dominio, aplicación, infraestructura y presentación.

---

# Capturas

> (pronto)

---

# Puesta en marcha

Las siguientes instrucciones corresponden al entorno de desarrollo.

## Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run --project src/Calzado.API
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Estado del proyecto

✅ Gestión de productos

✅ Gestión de proveedores

✅ Control de inventario

✅ Registro de ventas

✅ Historial de movimientos

✅ Historial de ventas

✅ Remisiones PDF

✅ Aplicación de escritorio para Windows

✅ Instalador de Windows

✅ Backend .NET incluido en la aplicación

✅ Inicio automático del backend

✅ Migraciones automáticas de base de datos

✅ Creación automática de directorios necesarios

---

# Aplicación de escritorio para Windows

El sistema puede ejecutarse como una aplicación de escritorio independiente mediante Electron.

La aplicación incluye:

- Interfaz administrativa.
- Frontend Next.js.
- Backend ASP.NET Core.
- Inicio automático del backend.
- Conexión con SQL Server.
- Migraciones automáticas de Entity Framework Core.
- Generación automática de la carpeta de archivos necesarios.
- Instalador para Windows mediante NSIS.

## Generar el backend

```bash
cd backend/src/Calzado.API
dotnet publish -c Release -o ../../../release/backend
```

## Generar el frontend

```bash
cd frontend
ELECTRON=true npm run build
```

## Generar el instalador

```bash
cd electron
npm run dist
```

El instalador generado se encuentra en: electron/dist/

# Autor

**Luis Felipe Caro Espinosa**

GitHub: [@lfcarodev](https://github.com/lfcarodev)