# Análise: Requirimentos do sistema

Este documento describe os requirimentos para o \[nome do proxecto\] especificando que funcionalidade ofrecerá e de que xeito.

## 1. Descrición xeral

Descrición xeral do proxecto. Describir de forma xeral e clara que vai realizar a aplicación, sen entrar nos detalles internos (que datos se procesan, de que tipo son, etc).

## 2. Funcionalidades

Describir con detalle e precisión que operacións se van poder realizar a través da aplicación informática, indicando que actores interveñen en cada caso.

Enumeralas, de maneira que na fase de deseño se poida crear o caso de uso correspondente a cada funcionalidade.

Cada función ten uns datos de entrada e uns datos de saída. Entre os datos de entrada e de saída, realízase un proceso, que debe ser explicado.

Exemplo:
Acción | Entrada | Saída
------ | ------- | -----
Alta cliente | nome, apelidos, dni, cidade, provincia | id
Modificar cliente | id, nome, apelidos, dni, cidade, provincia | -
Eliminar cliente | id | -

## 3. Requirimentos funcionais

A finalidade desta sección é a especificación detallada dos requirimentos da aplicación web:

* Infraestructura: dominio web, servidor web dedicado, servidor de base de datos, almacenamento, memoria, ...
* Backend: tecnoloxías usadas.
* Frontend: tecnoloxías usadas.

## 4. Tipos de usuarios

Describir os tipos de usuario que poderán acceder ao noso sistema. Habitualmente os tipos de usuario veñen definidos polas funcionalidades ás cales teñen acceso. En termos xerais existen moitos grupos de usuarios: anónimos, novos, rexistrados, bloqueados, confirmados, verificados, administradores, etc.

## 5. Contorna operacional

Neste apartado deben describirse os recursos necesarios, dende o punto de vista do usuario, para poder operar coa aplicación web. Habitualmente consiste nun navegador web actualizado e unha conexión a internet.

Se é necesario algún hardware ou software adicional, deberá indicarse.

## 6. Normativa

Investigarase que normativa vixente afecta ao desenvolvemento do proxecto e de que maneira. O proxecto debe adaptarse ás esixencias legais dos territorios onde vai operar.

Habitualmente a lexislación que se inclúe en proxectos informáticos tratan os seguintes temas:

* Protección de datos.
* Propiedade intelectual.
* Seguridade.
* Comercio electrónico.
* Riscos laborais.
* Impacto ambiental.

### Lei de protección de datos

Pola natureza dos sistema de información, unha lei que se vai a ter que mencionar de forma obrigatoria é la *Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDPGDD)*. O ámbito da LOPDPGDD é nacional. Se a túa aplicación está pensada para operar a nivel europeo, tamén se debe facer referencia á *General Data Protection Regulation (GDPR)*. Na documentación debes afirmar que o teu proxecto cumpre coa normativa vixente.

Para cumplir a LOPDPGDD e/ou GDPR debes ter un apartado na web onde indiques quen é o responsable do tratamento dos datos e para que fins se van utilizar. Habitualmente esta información estructúrase nos seguintes apartados:

* Aviso legal.
* Política de privacidade.
* Política de cookies.

É acosenjable ver [ejemplos de webs](https://www.spotify.com/es/legal/privacy-policy/) que conteñan textos legais referenciando a LOPDPGDD ou GDPR.

>Completa tamén os documentos: [planificación](a2_planificacion.md) e [orzamento](a3_orzamento.md).
