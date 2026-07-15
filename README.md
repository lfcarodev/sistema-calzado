# Sistema de Gestión para Distribuidora de Calzado

Sistema empresarial para la gestión de inventario, ventas y remisiones desarrollado para una distribuidora de calzado.

## Tecnologías

### Backend

- .NET 10
- ASP.NET Core Web API
- Clean Architecture
- CQRS
- MediatR
- Entity Framework Core
- SQL Server
- QuestPDF

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Funcionalidades

- Gestión de productos
- Gestión de proveedores
- Gestión de clientes
- Control de inventario
- Movimientos de stock
- Registro de ventas
- Descuento automático de inventario
- Generación de remisiones PDF
- Descarga profesional de remisiones

## Arquitectura

### Backend

```text
backend/src/

Calzado.API
Calzado.Application
Calzado.Domain
Calzado.Infrastructure
```

### Frontend

```text
frontend/src/

app
features
components
lib
```

El proyecto sigue los principios de **Clean Architecture**, separación de responsabilidades y el patrón **CQRS**.

## Puesta en marcha

### Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run --project src/Calzado.API
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Estado del proyecto

Actualmente el sistema incluye:

- Backend completamente funcional.
- Frontend administrativo desarrollado con Next.js.
- Integración completa entre frontend y backend.
- Generación y descarga de remisiones en PDF.

## Autor

**@lfcarodev**