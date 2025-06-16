# Análise: Requirimentos do sistema

## Descrición xeral

La aplicación propuesta consiste en un portal web para la venta de entradas a eventos, haciendo uso de la tecnología blockchain. A través de esta plataforma, los organizadores podrán publicar eventos y emitir entradas que, en una versión futura, se convertirán en tokens únicos (NFTs). Por su parte, los usuarios podrán consultar eventos, comprar entradas, transferirlas y, más adelante, también venderlas o comprarlas en un mercado secundario de forma segura y transparente. La idea es garantizar la autenticidad de las entradas y evitar su falsificación o duplicación mediante el uso de contratos inteligentes en la blockchain, además de asegurar transacciones seguras entre particulares.

Actualmente, aunque no ha dado tiempo a implementar toda la funcionalidad blockchain, la aplicación ya establece una primera conexión con la red de pruebas (testnet), que se utiliza para autenticar a los usuarios a través de su wallet o billetera digital. Esto sienta las bases para una integración completa en futuras versiones.

El sistema está diseñado para ser escalable, permitiendo funcionalidades básicas en una primera versión y ampliaciones posteriores.

---

## Funcionalidades

A continuación se detallan las funcionalidades principales de la aplicación, organizadas por bloques e indicando los actores implicados, los datos de entrada y salida, así como los procesos realizados.

---

### Funcionalidades mínimas

#### 1. Conexión de wallet (autenticación)

- **Actores:** Usuario (organizador, administrador o comprador)
- **Entrada:** Solicitud de conexión de wallet (por ejemplo, Metamask)
- **Proceso:** Verificación de conexión mediante firma criptográfica
- **Salida:** Usuario autenticado con dirección de wallet visible en la interfaz

#### 2. Publicación de eventos y generación de entradas

- **Actores:** Organizador (en un futuro, bajo previa autorización del administrador)
- **Entrada:** Nombre del evento, descripción, fecha, número de entradas, lugar, precio
- **Proceso:** El organizador crea un evento a través del cual los usuarios podrán comprar sus entradas. Del mismo modo que la tokenización de entradas, se desplegará un contrato en blockchain por cada evento en actualizaciones futuras. La publicación del evento debe ser aprobada por un administrador para evitar cualquier uso fraudulento.
- **Salida:** Evento publicado en la interfaz y entradas tokenizadas en la blockchain

> Nota: En un futuro, el evento no será publicado en la blockchain hasta que un administrador lo verifique y lo publique mediante una transacción autorizada. Esto proporciona mayor seguridad, evita publicaciones fraudulentas y garantiza que todos los eventos en la blockchain han sido revisados y aprobados. Véase funcionalidades ampliables.

#### 3. Compra de entradas

- **Actores:** Usuario registrado
- **Entrada:** Selección de evento y número de entradas, confirmación de transacción
- **Proceso:** Envío de la transacción a la base de datos. En un futuro, transacción blockchain y transferencia del NFT al comprador
- **Salida:** Entrada recibida en la wallet del usuario

#### 4. Consulta de mis entradas

- **Actores:** Usuario registrado
- **Entrada:** Solicitud para ver las entradas asociadas a su wallet
- **Proceso:** Consulta de las entradas asociadas a la wallet conectada
- **Salida:** Listado de entradas compradas, con metadatos visibles

#### 5. Listado público de eventos

- **Actores:** Usuario (anónimo o registrado)
- **Entrada:** Solicitud para ver todos los eventos disponibles en la plataforma
- **Proceso:** Consulta y visualización de todos los eventos disponibles (obtenidos de una base de datos)
- **Salida:** Listado de eventos con datos relevantes (nombre, fecha, lugar)

#### 6. Buscador de eventos

- **Actores:** Usuario (anónimo o registrado)
- **Entrada:** Términos de búsqueda (nombre del evento, fecha, categoría, etc.)
- **Proceso:** Filtrado de los eventos disponibles en la base de datos y en blockchain.
- **Salida:** Resultados de búsqueda con detalles de cada evento

#### 7. Reenvío de entradas entre usuarios (transferencia directa)

- **Actores:** Usuario remitente, usuario receptor
- **Entrada:** Selección de la entrada (NFT) a transferir, dirección de wallet destino, confirmación por parte del remitente
- **Proceso:** Ejecución de una transacción en la blockchain llamando a la función `safeTransferFrom` del contrato ERC-721
- **Salida:** Entrada transferida a la wallet del nuevo propietario

---

### Funcionalidades deseables y ampliables

#### 8. Reventa de entradas entre usuarios (mercado secundario)

- **Actores:** Usuario vendedor, usuario comprador
- **Entrada (vendedor):** Selección de la entrada a poner en venta, precio
- **Entrada (comprador):** Selección de la entrada, confirmación de compra, envío de fondos
- **Proceso:**
  - El vendedor lista la entrada en un marketplace mediante contrato inteligente
  - El comprador interactúa con el contrato para efectuar la compra, que gestiona el pago y la transferencia automáticamente
- **Salida:**
  - Entrada transferida automáticamente al comprador
  - Fondos entregados al vendedor tras confirmación en la blockchain

> En una primera versión de la aplicación, los organizadores podrán publicar eventos directamente. Sin embargo, en fases posteriores, se implementará un sistema en el contrato inteligente para que **solo los administradores** puedan ejecutar la publicación definitiva en blockchain. Las funcionalidades descritas a continuación se corresponden con la implementación de este sistema.

#### 9. Verificación de Organizador

- **Actores:** Usuario (potencial organizador), Administrador
- **Entrada:** Formulario de verificación con documentos (identificación, registro de empresa, etc.) y correo electrónico
- **Proceso:**
  1. El usuario solicita convertirse en organizador
  2. Verifica su correo electrónico a través de un enlace enviado
  3. Sube documentos de verificación
  4. Se aplica un CAPTCHA para prevenir spam automático
  5. El administrador realiza una revisión manual
- **Salida:**
  - Si se aprueba, el usuario obtiene acceso a las herramientas de organizador
  - Si se rechaza, el usuario recibe una notificación explicando los motivos

#### 10. Vista de Gestión de Solicitudes de Organizadores

- **Actores:** Administrador
- **Entrada:** Solicitudes enviadas por usuarios que desean ser organizadores
- **Proceso:**
  - El administrador accede a un panel con todas las solicitudes pendientes
  - Puede ver datos del solicitante y sus documentos
  - Decide si acepta o rechaza la solicitud
- **Salida:**
  - Solicitud aceptada → el usuario pasa a ser organizador
  - Solicitud rechazada → el usuario se mantiene como usuario registrado y es notificado
  - Registro del estado de la solicitud como "aceptada" o "rechazada"

#### 11. Listado de Organizadores de Eventos

- **Actores:** Administrador
- **Entrada:** Solicitud para ver todos los organizadores registrados en la plataforma
- **Proceso:** Consulta a la base de datos para obtener la lista de organizadores, con opción de filtrado por estado (activo/inactivo) o por cantidad de eventos creados
- **Salida:** Listado con:
  - Nombre del organizador
  - Correo electrónico (si aplica)
  - Estado (activo/inactivo)
  - Número de eventos creados
  - Acciones disponibles: ver eventos, editar o eliminar organizador

#### 12. Vista para Aceptar Solicitudes de Eventos

- **Actores:** Administrador
- **Entrada:** Solicitud de publicación de evento enviada automáticamente por el organizador
- **Proceso:**
  - El administrador revisa la solicitud, con opción de aprobar o rechazar:
    - Si aprueba: el evento se publica y se generan las entradas llamando al contrato inteligente
    - Si rechaza: el organizador recibe una notificación con los motivos
- **Salida:**
  - Evento publicado o solicitud rechazada con justificación
  - Registro del estado de la solicitud como "aceptada" o "rechazada"

#### 13. Gestión de permisos para la publicación en blockchain

- **Actores:** Administrador
- **Entrada:** Dirección de la wallet a añadir o eliminar del rol de administradores
- **Proceso:**
  - En la primera versión, los organizadores pueden crear eventos y publicarlos desde la interfaz
  - En una versión futura, se limitará el acceso al contrato inteligente que publica eventos en la blockchain
  - Solo los administradores podrán ejecutar esta acción
  - Esto se implementará mediante un sistema de roles (`AccessControl` de OpenZeppelin), que restringirá funciones como `crearEvento()` o `mintEntrada()` a las direcciones con rol `ADMIN`
- **Salida:**
  - Wallet añadida o eliminada del rol `ADMIN` en el contrato
  - Acceso a la interfaz de administración habilitado o restringido

## Tipos de usuarios

La aplicación contará con los siguientes tipos de usuarios:

- **Usuario anónimo:** Puede consultar eventos públicos y buscar eventos, pero no puede comprar ni gestionar entradas.
- **Usuario registrado:** Usuario que ha conectado su wallet; puede comprar entradas, consultar sus entradas y participar en el mercado secundario.
- **Organizador:** Usuario registrado autorizado para publicar eventos y emitir entradas.
- **Administrador:** Puede moderar contenidos, gestionar permisos y realizar tareas de supervisión.

---

## Normativa

Este proyecto deberá adaptarse a la normativa vigente en materia de protección de datos y comercio electrónico. Las principales normativas que afectan al sistema son:

### LOPDGDD y GDPR

- **LOPDGDD**: Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (ámbito español).
- **GDPR**: Reglamento General de Protección de Datos (ámbito europeo).

El sistema debe garantizar:

- La existencia de un **responsable del tratamiento de datos**, cuyos datos aparecerán en el aviso legal.
- Una **política de privacidad** clara que indique qué datos se recogen, con qué finalidad y cómo se almacenan.
- Una **política de cookies**, si la web utiliza cookies técnicas o de terceros.
- **Consentimiento explícito** por parte de los usuarios cuando proceda.
- **Derecho de acceso, rectificación, cancelación y oposición** por parte del usuario (ARCO).

### Mecanismos de cumplimiento

- Inclusión de enlaces en el sitio web a:
  - Aviso legal
  - Política de privacidad
  - Política de cookies
- Control del acceso a datos personales
- No almacenamiento de datos personales en la primera versión del proyecto
- Uso de wallets como sistema de autenticación descentralizado, sin necesidad de registro convencional

---

## Enlaces

> _Los enlaces a documentos legales o a la política de privacidad se incluirán en el momento del despliegue de la aplicación en Vercel._
