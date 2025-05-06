# URL da páxina web

# Prototipos realizados

## Prototipo 1

### Data:

6 -05- 2025

### Descrición:

Se implementa la conexión de wallet mediante RainbowKit y autenticación con SIWE (Sign-In With Ethereum), integrada con Supabase para la gestión de sesiones (a través de NextAuth) y usuarios. Además, se incluye la infraestructura básica del frontend con Next.js y TailwindCSS, utilizando componentes reutilizables que serán reorganizados y ampliados en versiones posteriores del prototipo.

## Prototipo 2

### Data:

### Descrición:

## Prototipo Final

### Data:

### Descrición:

# Retos e Innovación

## Reto número 1

La propia naturaleza del proyecto representa un reto debido a la integración de tecnologías modernas distintas a las tratadas en clase. Sin embargo, uno de los mayores desafíos hasta ahora ha sido la autenticación.

Reto número 1
Implementación de autenticación mediante SIWE, Supabase y NextAuth.

Se utilizó la librería next-auth en combinación con SIWE, RainbowKit y Supabase. El usuario firma un mensaje con su wallet para validar su identidad, generando un JWT que se almacena en la sesión de Next.js y, por otro lado, un JWT personalizado para Supabase. Esta integración supuso un reto importante debido a la complejidad del flujo: hubo que gestionar simultáneamente cookies, tokens y firmas en un entorno con wagmi actualizado y el nuevo App Router de Next.js. Además, la documentación oficial de RainbowKit no cubría completamente esta combinación, lo que llevó a consultar numerosos repositorios en GitHub, PRs y foros para lograr una implementación funcional y estable.

### Motivación

Se buscaba evitar el uso de autenticación tradicional mediante usuario y contraseña, optando por una solución moderna basada en identidad blockchain.

### Descrición

## Reto número 2

### Motivación

### Descrición
