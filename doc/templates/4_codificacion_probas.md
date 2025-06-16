# URL da páxina web

[Entradas Project](https://entradas-project.vercel.app/)

# Prototipos realizados

## Prototipo 1

### Data:

6 - 05 - 2025

### Descrición:

Se implementa la conexión de wallet mediante RainbowKit y autenticación con SIWE (Sign-In With Ethereum), integrada con Supabase para la gestión de sesiones (a través de NextAuth) y usuarios. Además, se incluye la infraestructura básica del frontend con Next.js y TailwindCSS, utilizando componentes reutilizables que serán reorganizados y ampliados en versiones posteriores del prototipo.

## Prototipo 2

### Data:

20 - 05 - 2025

### Descrición:

Migración de la autenticación de la biblioteca RainbowKit a Reown Appkit, debido a las posibilidades que ofrece. Depuración de la gestión de sesiones y la implementación de la autenticación de Supabase a través de sus RLS con la integración de NextAuth v4.

Diseño de Navbar, Footer y Landing page, y de la interfaz de eventos, así como una primera conexión con la base de datos a través de la generación de datos de prueba de eventos y entradas.
Creación de primeros endpoints en la API para la obtención de datos de la base de datos.
Visualización de los eventos en la interfaz y de las entradas de cada usuario a través de peticiones a la API.

## Prototipo Final

### Data:

10 - 06 - 2025

### Descrición:

Implementación de la compra de entradas, diseño final de las interfaces de administrador y organizador así como unas posibles interfaces de estadísticas.

Creación de endpoints en la api para el resto de datos necesarios, migración de algunos endpoints a Server Actions de Next.js

Gestión de los estados del fetching de datos en el cliente, con Skeletons, Toast y spinners en caso de carga.

Gestión de seguridad de roles en los enlaces, de tal forma que solo los organizadores puedan acceder a las pestañas de organizador, administrador a administrador, etc.

Implementación de la creación de eventos, edición y eliminación a través de formularios.
Creación de un bucket para almacenar las imágenes de eventos en Supabase, así como el manejo de subida de archivos

Implementación de la gestión de roles y solicitudes de eventos.

# Retos e Innovación

La propia naturaleza del proyecto representa un reto debido a la integración de tecnologías modernas distintas a las tratadas en clase.

## Reto número 1

Implementación de autenticación mediante SIWE, Supabase y NextAuth.

### Motivación

Se buscaba evitar el uso de autenticación tradicional mediante usuario y contraseña, optando por una solución moderna basada en identidad blockchain.

### Descrición

Se utilizó la librería next-auth en combinación con SIWE, RainbowKit (luego migrada a Appkit) y Supabase. El usuario firma un mensaje con su wallet para validar su identidad, generando un JWT que se almacena en la sesión de Next.js y, por otro lado, un JWT personalizado para Supabase. Esta integración supuso un reto importante debido a la complejidad del flujo: hubo que gestionar simultáneamente cookies, tokens y firmas en un entorno con wagmi actualizado y el nuevo App Router de Next.js. Además, la documentación oficial de RainbowKit no cubría completamente esta combinación, lo que llevó a consultar numerosos repositorios en GitHub, PRs y foros para lograr una implementación funcional y estable.

## Reto número 2

Debido a las posibilidades de Next.js, división de obtención de datos en el cliente o en el servidor (ServerSideRendering)

### Motivación

Mejoras en la navegación y en los tiempos de carga de la aplicación

### Descrición

Si bien es cierto que Next.js ofrecía el SSR, en muchas ocasiones se tuvo que manejar una lógica con custom Hooks de react para la obtención de datos en el lado del cliente, y manejar la obtención de datos con estados como Loading o error. Lo cual a priori no supone una dificultad añadida a la de el aprendizaje de estas tecnologías y cómo implementan el fetching de datos, sin embargo la verdadera dificultad surge con la obtención de datos de la sesión de NextAuth para la verificación del rol del usuario, con su determinado tiempo de carga. La suma de la gestión de los dos estados de peticiones de información, sumado a la inexperiencia en un principio es lo que supuso un desafío en el manejo y la visualización de datos en el lado del cliente.
