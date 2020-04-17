# Análise: Requerimentos do sistema

Este documento describe os requirimentos para o \[nome do proxecto\] especificando qué funcionalidade ofrecerá e de que xeito.

## 1. Descrición xeral

Descrición Xeral do proxecto.

## 2. Funcionalidades

Describir que operacións se van poder realizar a través da nosa aplicación informática, indicando que actores interveñen en cada caso.
Enumeralas, de maneira que na fase de deseño poidamos crear o caso de uso correspondente a cada funcionalidade. Ademais, engade as variables coas que se van a traballar.

Exemplo:
- Xestión de clientes na BD
	+ Crear cliente (nome, apelidos, dni, cidade, provincia)
	+ Modificar cliente (id, nome, apelidos, dni, cidade, provincia)
	+ Eliminar cliente (id)
- Xestión de pedidos.
	+ Crear pedido (id, nome_produto, data)
	+ Eliminar pedido (id)
- ...
 
## 3. Requerimentos non funcionais

Requerimentos relativos a rendemento, seguridade, etc. se procede.

## 4. Tipos de usuarios

Tipos de usuario que poderán acceder ó noso sistema, poderán diferenciarse polos permisos sobre os datos, pantallas que se lles mostran, etc.

Exemplo:

- Usuario xerente, que terá acceso a ...
- Usuario técnico, que poderá...
 
## 5. Entorno operacional

### 5.1. Dominio

Indica os dominios que se van a empregar.

### 5.2. Hardware

Indicar elementos hardware que se usarán. Por exemplo: ordenador para desenvolver a aplicación, smartphone para probar a aplicación na súa versión móbil, servidor web, servidor de bases de datos, CDN, etc.

### 5.3. Software

Indicar software que haberá que instalar en cada elemento hardware. Por exemplo: aplicacións de desenvolvemento, aplicacións para o servidor, etc.

## 6. Interfaces externos

Indicar como se comunicará o noso software co exterior. Os diferentes tipos son:

- De usuario. Por exemplo: as diferentes vistas da apliación, comandos de terminal, etc.
- Hardware. Por exemplo: un lector de código de barras.
- Software. Por exemplo: unha API.

## 7. Melloras futuras

É posible que o noso proxecto se centre en resolver un problema concreto que se poderá ampliar no futuro con novas funcionalidades, novas interfaces, etc.