# Deseño

## Casos de uso

A continuación se describen los principales casos de uso de la aplicación. Cada caso de uso representa una funcionalidad del sistema. Los diagramas de casos de uso han sido elaborados siguiendo las funcionalidades mínimas y ampliables indicadas previamente, diferenciando los actores implicados (usuarios, organizadores, administradores) y las interacciones que realizan.

En la carpeta `img/diagrams` se incluyen los diagramas creados con **draw.io**.

## Deseño de interface de usuarios

El diseño moderno de la aplicación comienza con una **landing page** que presenta el propósito del proyecto y ofrece un botón de llamada a la acción para abrir la aplicación.

Una vez dentro, la interfaz se basa en un **layout principal** compuesto por una **barra lateral** y un **header** que incluye el botón de conexión a la wallet, utilizado para la autenticación del usuario.

Dependiendo del rol que tenga el usuario, se mostrarán diferentes secciones reutilizables adaptadas a sus permisos y funcionalidades.

---

### 1. Landing Page

- Página pública con botón "Abrir aplicación". Muestra información general.

---

### 2. Layout base de la aplicación (una vez conectado)

- Header con botón de conexión a la wallet.
- Sidebar dinámico según el rol del usuario.
- Compactable y situado en la parte izquierda de la pantalla en vista de escritorio.
- Este diseño se reutiliza en todas las páginas internas.

---

### Menú lateral por rol

#### Rol: Usuario comprador

- Dashboard
- Mis Entradas
- Explorar Eventos
- Ajustes

#### Rol: Organizador

- Dashboard
- Mis Eventos
- Publicar Evento
- Solicitud de Publicación (si no está verificado)
- Ajustes

#### Rol: Administrador

- Dashboard
- Solicitudes de Organizadores
- Solicitudes de Eventos
- Organizadores Registrados
- Gestión de Roles
- Informes / Logs
- Ajustes

---

### Pantallas por rol

Estas pantallas serán implementadas como componentes reutilizables. Aunque el diseño del dashboard será idéntico para usuarios y administradores, la información mostrada se adaptará dinámicamente según el rol del usuario.

#### Usuario

- **Dashboard**: próximos eventos, recomendaciones.
- **Mis entradas**: listado de entradas con metadatos. Incluye un apartado para enviar entradas si se desea.
- **Explorar eventos**: búsqueda y listado de eventos combinados.
- **Detalles del evento**: información ampliada y opción de compra.
- **Compra de entrada**: proceso de pago (modal).
- **Portal de reventa de entradas** (opcional).
- **Ajustes**: idioma, wallet conectada, preferencias.

#### Organizador

- **Dashboard**: métricas de sus eventos.
- **Mis eventos**: listado con opciones de edición.
- **Publicar evento**: formulario para crear nuevos eventos.
- **Solicitud de publicación**: si el sistema requiere validación previa.
- **Ajustes**: igual que el usuario, sin acceso a la compra.

#### Administrador

- **Dashboard**: resumen general y estadísticas.
- **Solicitudes de organizadores**: revisión y gestión.
- **Solicitudes de eventos**: aprobación o rechazo.
- **Organizadores registrados**: listado general.
- **Gestión de roles**: añadir/eliminar permisos `ADMIN`.
- **Informes / Logs**: visualización básica del uso del sistema.
- **Ajustes**: configuración general del administrador.

## Diagrama de Bases de Datos

A continuación se describe el modelo entidad-relación que representa la estructura de la base de datos implementada en PostgreSQL mediante Supabase.

La base de datos está compuesta por cinco tablas principales: **USUARIO**, **EVENTO**, **TIPO_ENTRADA**, **ENTRADA** y **ASIENTO**.

### Relaciones entre tablas

- **USUARIO**

  - Almacena únicamente información de las wallets de los **administradores** y **organizadores**.
  - Tiene una relación **1:N con EVENTO**, es decir, un usuario puede organizar múltiples eventos.
  - Si se elimina un usuario, los eventos que haya creado **no se eliminan**.

- **EVENTO**

  - Contiene los datos generales de cada evento.
  - Tiene una relación **1:N con TIPO_ENTRADA**.
  - Si se elimina un evento, **se eliminan en cascada** sus tipos de entrada, entradas y asientos asociados, lo que representa que el evento fue cancelado o no llegó a celebrarse.

- **TIPO_ENTRADA**

  - Define las distintas categorías de entradas para un evento (por ejemplo, general, VIP, etc.).
  - Mantiene una relación **1:N con ENTRADA**: cada tipo de entrada debe tener al menos una entrada asociada.
  - Al eliminar un tipo de entrada, **se eliminan también** las entradas vinculadas a él.

- **ENTRADA**

  - Representa cada entrada emitida, e incluye referencias tanto al **tipo de entrada** como al **asiento** (si aplica).
  - Si el evento no tiene asientos asignados, la entrada **no se relaciona con ningún registro en la tabla ASIENTO**.

- **ASIENTO**
  - Modela los asientos específicos de los eventos que los requieran.
  - Tiene una relación **1:1 con ENTRADA**, es decir, cada asiento está vinculado a una única entrada.
  - Solo se crean registros en esta tabla si el evento tiene asientos numerados.

### Diseño visual de la base de datos

![Estructura final da base de datos](doc/img/Estructura_final_DB.png)

### Script de ejemplo de creación de la BD

```sql

CREATE TABLE public.asientos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  fila text,
  numero text,
  ocupado boolean DEFAULT false,
  entrada_id uuid UNIQUE,
  CONSTRAINT asientos_pkey PRIMARY KEY (id),
  CONSTRAINT asientos_entrada_id_fkey FOREIGN KEY (entrada_id) REFERENCES public.entradas(id)
);
CREATE TABLE public.entradas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  wallet text NOT NULL,
  metadata_uri text NOT NULL,
  qr_code text NOT NULL,
  qr_image_uri text,
  estado text DEFAULT 'activa'::text CHECK (estado = ANY (ARRAY['ACTIVA'::text, 'USADA'::text, 'CANCELADA'::text])),
  tx_hash text,
  tipo_entrada_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT entradas_pkey PRIMARY KEY (id),
  CONSTRAINT entradas_tipo_entrada_id_fkey FOREIGN KEY (tipo_entrada_id) REFERENCES public.tipos_entrada(id)
);
CREATE TABLE public.eventos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  lugar text NOT NULL,
  imagen_uri text,
  organizador_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  status text DEFAULT 'pendiente'::text CHECK (status = ANY (ARRAY['PENDIENTE'::text, 'APROBADO'::text, 'RECHAZADO'::text, 'CANCELADO'::text])),
  fecha_inicio timestamp with time zone NOT NULL,
  fecha_fin timestamp with time zone NOT NULL,
  categoria character varying,
  CONSTRAINT eventos_pkey PRIMARY KEY (id),
  CONSTRAINT eventos_organizador_id_fkey FOREIGN KEY (organizador_id) REFERENCES public.usuarios(id)
);
CREATE TABLE public.tipos_entrada (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  precio numeric NOT NULL,
  cantidad_disponible integer NOT NULL CHECK (cantidad_disponible > 0),
  zona text,
  CONSTRAINT tipos_entrada_pkey PRIMARY KEY (id),
  CONSTRAINT tipo_entrada_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id)
);
CREATE TABLE public.usuarios (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  wallet text NOT NULL,
  email text UNIQUE,
  nombre text,
  rol text NOT NULL CHECK (rol = ANY (ARRAY['organizador'::text, 'administrador'::text])),
  CONSTRAINT usuarios_pkey PRIMARY KEY (id)
);

```

### Sincronización on-chain / off-chain

La información clave registrada on-chain se sincroniza con la base de datos off-chain a través de eventos emitidos por el contrato inteligente. Por ejemplo, cuando cambia el propietario de una entrada en la blockchain, se actualiza automáticamente el campo `wallet` correspondiente en la tabla **ENTRADA**.

### Almacenamiento de metadatos en IPFS

Para el almacenamiento de los metadatos de las entradas, se utilizará el sistema de archivos distribuido **IPFS**. Esto permite que los metadatos estén accesibles directamente desde la blockchain, sin depender de la base de datos. De esta forma, cada entrada es **completa en sí misma**, conteniendo toda la información relevante (evento, tipo, asiento, fecha, etc.) referenciada mediante una URI.

Para el almacenamiento de los metadatos, se utilizará el almacenamiento IPFS para que puedan ser accesibles por la blockchain sin necesidad de una base de datos, y que la entrada sea completa en sí misma. (completa)

## Anexo: imágenes de casos de uso

![Imagen casos de uso](doc/img/diagrams/diagramas_casos_de_uso_miguel_caamano.drawio.png)
