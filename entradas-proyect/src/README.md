# Estructura del Proyecto

Este directorio contiene el código fuente principal de la aplicación. La estructura está organizada de la siguiente manera:

## Directorios Principales

### `/app`

Contiene las rutas y páginas de la aplicación usando el App Router de Next.js 13+.

### `/components`

Componentes reutilizables de la aplicación:

- `ui/`: Componentes de interfaz de usuario básicos
- `layout/`: Componentes de diseño global
- `shared/`: Componentes compartidos entre features

### `/features`

Módulos funcionales de la aplicación, cada uno con su propia estructura interna:

- `auth/`: Autenticación y gestión de usuarios
- `eventos/`: Gestión de eventos
- `entradas/`: Gestión de entradas
- `organizer/`: Panel de control del organizador
- `landing/`: Página principal y marketing

### `/lib`

Utilidades y configuraciones globales:

- `hooks/`: Hooks personalizados globales
- `utils/`: Funciones de utilidad
- `schemas/`: Esquemas de validación
- `supabase/`: Configuración de Supabase

### `/types`

Definiciones de tipos globales de TypeScript.

## Convenciones

1. Cada feature debe tener su propio README.md explicando su propósito y estructura
2. Los componentes específicos de una feature deben estar dentro de su directorio correspondiente
3. Los componentes reutilizables deben estar en `/components`
4. Las utilidades específicas de una feature deben estar en su directorio `lib/`
5. Los tipos específicos de una feature deben estar en su directorio `types/`
