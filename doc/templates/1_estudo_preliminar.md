# Estudo preliminar - Anteproxecto

## Descrición do proxecto

Creación de una aplicación web. Un portal para la venta de entradas de eventos, mediante tecnología blockchain.

### Xustificación do proxecto.

La idea surgió a raíz de la curiosidad personal por aprender nuevas tecnologías web y su implementación en el mundo real.
El objetivo principal es experimentar y aprender con nuevos frameworks y tecnologías, enfocándose en lenguajes de programación como JavaScript y Solidity. La idea es simple, pero se pueden realizar múltiples ampliaciones hasta convertirlo en un proyecto complejo. Así pues, a continuación se describirán las funcionalidades del proyecto, desde una versión más básica hasta una versión más avanzada, enfocándose en la escalabilidad y en los fundamentos sólidos para su implementación y despliegue.

### Funcionalidades do proxecto.

#### Funcionalidades mínimas:

-   Conexión de wallet (autenticación de usuario)
-   Publicación de eventos y generación de entradas (por el administrador)
-   Compra de entradas (usuario)
-   Ver mis entradas (usuario)

#### Funcionalidades de una posible ampliación:

-   Buscador de eventos
-   Listado público de eventos y entradas

#### Funcionalidades finales y deseables:

-   **Intercambio libre de entradas (mercado secundario)**: Venta o transferencia de entradas entre usuarios.
-   **Reenvío de entradas**: Transferencia de entradas entre usuarios.
-   **Generación de códigos QR**: Cada entrada tendrá un código QR único para su verificación en el evento.
-   **Metadatos en IPFS**: Almacenamiento descentralizado de metadatos (imágenes, descripciones) de las entradas.

### Estudo de necesidades. Proposta de valor respecto ao que hai no mercado.

El proyecto responde a una necesidad detectada en el mercado: evitar fraudes y reventas abusivas en la compra-venta de entradas.
La propuesta se basa en el uso de tecnología blockchain (estándar ERC-721) para generar entradas únicas, verificables, e imposibles de falsificar o duplicar, además de irreplicables. Esto garantiza la seguridad de los compradores en una plataforma secundaria, ya que una transacción entre particulares no se realizaría hasta que se verifique y libere el pago a través de un contrato inteligente, de forma descentralizada entre ambas partes.

### Persoas destinatarias.

Por una parte, empresas organizadoras de eventos culturales, deportivos, musicales o conferencias.
Además, usuarios particulares interesados en asistir a eventos o en comprar entradas en un mercado secundario de forma segura y legal.

### Promoción.

Se podría promocionar a través de campañas en redes sociales y una comunicación directa con organizadores locales como primeros casos de uso.

### Modelo de negocio.

El modelo se basa en:

-   Cobro por parte del portal a empresas organizadoras por el uso del servicio de emisión y gestión de entradas.
-   Pequeña comisión por transacción entre particulares en el mercado secundario de entradas. Ésta sería tanto para el organizador como para la plataforma.

## Requirimentos

En un primer proyecto, se realizará una aplicación sin base de datos, al guardar los datos de las entradas en una cadena de bloques. No obstante, si se quisiese ampliar las funcionaldades, se detallará el tipo de base de datos a utilizar, así como su tecnología y despliegue.

#### Infraestructura

**Servidor web / Plataforma de despliegue**

-   **Vercel** será utilizado como plataforma de despliegue para el frontend y backend. Esto incluirá un dominio web proporcionado por Vercel.

**Almacenamiento descentralizado (opcional en fases posteriores)**

-   **IPFS (vía Web3.Storage)** _(a futuro)_: se plantea el uso futuro para alojar los metadatos de las entradas: imagen, descripción o información del evento.

---

#### Backend: tecnologías utilizadas

-   **Node.js**: Creación de endpoints de una API a través de Next.js
-   **Ethers.js**: biblioteca de JavaScript para interactuar con la blockchain y llamar a los contratos inteligentes.
-   **Hardhat**: framework para contratos inteligentes en Solidity. Se usará para compilar, probar y desplegar los contratos en la red de pruebas Sepolia.
-   **IPFS SDK** _(a futuro)_: para gestionar la subida de metadatos y archivos a la red descentralizada.

---

#### Frontend: tecnologías utilizadas

-   **Next.js**: framework de React que permite el desarrollo unificado de frontend y backend. Escojo este sistema para su fácil despliegue en la plataforma Vercel, aunque estaría abierto a otros frameworks.
-   **TailwindCSS**: para el uso de interfaces modernas, responsivas y rápidas de implementar.
-   **Ethers.js**: biblioteca de JavaScript para interactuar con la blockchain y llamar a los contratos inteligentes.
-   **Wagmi + RainbowKit**: herramientas especializadas en la conexión de wallets Web3 con excelente experiencia de usuario (UX).

---

#### Base de datos _(opcional para futuras versiones)_

En una etapa posterior del desarrollo, si se requiere persistencia de datos adicional (como usuarios, eventos, estadísticas o administración de contenidos), se plantea el uso de:

-   **Supabase**: backend-as-a-service que ofrece base de datos PostgreSQL, autenticación y almacenamiento de archivos, todo integrado.
-   **PostgreSQL**: como sistema de base de datos relacional que será gestionado a través de Supabase.
