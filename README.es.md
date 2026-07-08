# Complemento de servidor MCP para Cocos Creator

🌐 [简体中文](README.md) · [English](README.EN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · **Español** · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md)

Un completo complemento de servidor MCP (Protocolo de Contexto de Modelo) para Cocos Creator 3.8+, que permite a los asistentes de IA interactuar con el editor de Cocos Creator mediante un protocolo estandarizado. Instalación y uso con un solo clic, sin necesidad de entornos ni configuraciones complicadas. Ya se han probado el cliente de Claude, Claude CLI y Cursor; en teoría, otros editores también deberían ser totalmente compatibles.

**🚀 ¡Ahora se ofrecen 50 potentes herramientas fusionadas, logrando un 99% de control del editor!**

## La versión PRO ya se ha actualizado a la 1.7.8

| Tipo | Enlace |
|------|------|
| **Vista previa en video** | [Video en Bilibili](https://www.bilibili.com/video/BV1rTAXzuEH3/) |
| **Prueba gratuita** | [Enlace de prueba de vberai Cocos Creator MCP Pro, versión 3.x](https://www.vberai.com/game-engines/cocos) |
| **Prueba gratuita** | [Enlace de prueba de vberai Cocos Creator MCP Pro, versión 2.x](https://www.vberai.com/game-engines/cocos2x) |
| **Lienzo de diseño IA** | [VberAI Studio —— La primera plataforma de diseño nativa de IA para juegos del mundo](https://studio.vberai.com) |
| **Sitio web oficial** | [Sitio web oficial de VberAI vberai.com](https://www.vberai.com) |

## Características de la versión Cocos MCP 3.x Pro

> 🚀 La versión Pro está creada y mantenida continuamente por **VberAI** —— [Prueba la versión Pro ahora](https://www.vberai.com/game-engines/cocos) ｜ [Ver demostración en video](https://www.bilibili.com/video/BV1rTAXzuEH3/)

Un complemento MCP (Protocolo de Contexto de Modelo) de nivel profesional creado específicamente para **Cocos Creator 3.8.6+**, que permite a los asistentes de IA controlar directamente el editor mediante un protocolo estandarizado. **16 herramientas de nivel de intención** cubren **231 operaciones**, abarcando **12 grandes módulos de capacidades** y recorriendo todo el flujo de desarrollo de Cocos Creator 3.x. Adopta el protocolo Streamable HTTP, junto con un diseño optimizado de Token, que ahorra más Token y ofrece llamadas más estables, y admite la configuración con un solo clic de los principales clientes de IA (Cursor, Claude, Windsurf, etc.).

| Herramientas de nivel de intención | Operaciones cubiertas | Módulos cubiertos | Protocolo de comunicación |
|:---:|:---:|:---:|:---:|
| **16** | **231** | **12 grandes módulos** | **Streamable HTTP** |

### Los doce grandes módulos de capacidades

| Módulo | Núm. de operaciones | Descripción |
|------|---:|------|
| Gestión de escenas | 24 | Apertura, guardado, creación y cambio de escenas; consulta de jerarquía y capturas; admite operaciones de deshacer y ejecución de scripts. |
| Operaciones de nodos | 18 | CRUD completo de nodos; admite modificación por lotes, montaje de scripts, detección de tipo de nodo y operaciones de portapapeles. |
| Sistema de componentes | 8 | Adición, eliminación, consulta y modificación de componentes, así como configuración de propiedades; admite la vinculación de eventos de clic y la configuración de eventos por lotes. |
| Sistema de prefabs | 13 | Creación, instanciación y cambio de modo de edición de prefabs; admite aplicar/revertir cambios y validación de prefabs. |
| Gestión de recursos | 19 | Consulta, búsqueda, CRUD e importación de recursos; admite análisis de dependencias y conversión entre UUID y rutas. |
| Control del editor | 33 | Operaciones de nivel de editor como configuración del proyecto, registros, preferencias, compilación y vista previa. |
| Vista de escena | 32 | Gizmo, cámara, cuadrícula e imágenes de referencia, que proporcionan contexto del viewport y control con reconocimiento de límites. |
| Construcción de UI y plantillas | 13 | Creación de componentes de UI con un clic, construcción de una jerarquía de nodos completa a partir de un árbol JSON y múltiples plantillas de UI integradas. |
| Sistema de animación | 39 | Edición de fotogramas clave, ajuste de curvas, eventos de animación, aplicación de preajustes y gestión de animación de huesos Spine. |
| Consulta de base de conocimientos | 8 | Base de conocimientos integrada con propiedades de componentes, reglas de diseño de UI, patrones de diseño y mejores prácticas, que permite a la IA asistir el desarrollo con precisión. |
| Validación y capturas | 6 | Verificación del diseño de la escena, validación de referencias de recursos y análisis de jerarquía, junto con validación de regresión mediante capturas de escena. |
| Fuentes y Label | 9 | Gestión de recursos de fuentes y operaciones de Label con texto enriquecido, cubriendo la configuración de composición tipográfica. |

#### Características inteligentes

- **Resolución inteligente de rutas** — Todos los parámetros de nodo aceptan UUID, ruta (como `Canvas/Panel/Button`) o nombre, con resolución automática
- **Detección automática de UI** — Al crear un nodo bajo un nodo padre de UI, se añade automáticamente `cc.UITransform`
- **Contexto del viewport** — Al crear/modificar nodos se devuelve la resolución de diseño y el rango visible, con advertencia automática al salirse de los límites
- **Base de conocimientos integrada** — La IA puede consultar la tabla de propiedades de componentes, las reglas del sistema de coordenadas, los patrones de diseño y otros conocimientos
- **Constructor de escenas** — Describe la jerarquía completa de la UI mediante JSON y constrúyela con una sola llamada; gestiona automáticamente la configuración de Canvas/Camera/componentes
- **Sistema de imágenes de referencia** — Superpone bocetos de diseño de UI en la vista de escena, para que la IA construya la interfaz observando el diseño
- **Caché del árbol de nodos** — Caché con TTL de 2 segundos que evita consultas repetidas, invalidada automáticamente tras operaciones de cambio
- **Operaciones atómicas** — builder/composite utilizan un mecanismo de snapshot, con reversión automática en caso de fallo

### Versión Pro frente a versión de código abierto

| Función | Versión de código abierto | Versión Pro |
|------|:---:|:---:|
| Protocolo de comunicación | Protocolo HTTP | **Streamable HTTP** |
| Optimización de Token | Diseño básico | Diseño optimizado, ahorra más Token y es más estable |
| Método de código de operación | ✕ | ✅ |
| Configuración con un clic | ✕ | ✅ |
| Personalización de herramientas | ✕ | ✅ |
| Herramientas de nivel de reconocimiento de intenciones | Herramientas básicas | 16 tipos, cubriendo 231 operaciones |
| Creación de escenas de una sola vez | ✕ | ✅ |
| Base de conocimientos integrada | ✕ | ✅ |
| Sistema de animación / Spine | ✕ | ✅ 39 operaciones de animación |

---

## 🌐 Acerca de VberAI —— Plataforma de productividad para juegos nativa de IA

**VberAI** es una **plataforma de productividad para juegos nativa de IA** dirigida a desarrolladores de juegos, equipos de arte y equipos de contenido, y es también quien desarrolla y mantiene la versión Pro de este complemento Cocos MCP. VberAI es actualmente el **único proveedor que ofrece complementos MCP simultáneamente para los tres motores principales: Unity, Godot y Cocos Creator**, y ha creado tres líneas de productos en torno a la idea de «integrar realmente la IA en el pipeline de producción de juegos»:

- **🎮 Complementos MCP para motores de juego** —— Ejecuta un servicio MCP dentro del editor del motor, permitiendo que clientes de IA como Claude Desktop, Claude Code, Cursor, Windsurf y Cline lean y operen directamente escenas, componentes, recursos, animaciones y scripts.
- **🎨 AI Studio** —— Un lienzo de diseño de juegos nativo de IA que importa desde PSD / Figma / proyectos del motor por un lado, y exporta escenas y prefabs de Unity / Cocos / Godot por el otro.
- **✂️ IA de recorte súper potente (AI Super Matting)** —— Recorte de imágenes con un clic desde el navegador, con precisión a nivel de cabello y salida de canal Alpha real, con facturación por uso.

### Familia de complementos MCP para motores

| Complemento | Descripción |
|------|------|
| **Unity MCP** | Complemento MCP de nivel empresarial que cubre escena / GameObject / componentes / prefabs / materiales / animación / Shader, compatible con Unity 2022.3+ y Unity 6 |
| **Cocos MCP 3.x Pro** | Versión Pro de este proyecto, 16 herramientas de nivel de intención / 231 operaciones, Cocos Creator 3.8.6+, Streamable HTTP |
| **Cocos MCP 2.x Pro** | Diseñado a medida para proyectos antiguos de Cocos Creator 2.4.x+ (proyectos en línea de la versión 2.x que aún están en operación) |
| **Godot MCP** | Completamente gratuito, código abierto bajo licencia MIT, 100+ comandos de herramientas que cubren 21 sistemas, Godot 4.x, compatible con GDScript y C# |


---

## 🎨 VberAI Studio —— La primera plataforma de diseño nativa de IA para juegos del mundo

> **Una plataforma de diseño nativa de IA creada para los juegos.** Compatible desde su base con los motores Unity, Cocos y Godot, con numerosas herramientas de IA de alta frecuencia y flujos de automatización que permiten la generación de arte, el cambio de skin con un clic, la gestión de assets y la entrega integrada desde el boceto de diseño hasta el motor, además del reflujo inverso hacia el motor, conectando por completo todo el pipeline de desarrollo «Diseño con IA → IA del motor de juego».
>
> 👉 **[Entra ahora a AI Studio](https://studio.vberai.com)** ｜ [Más información](https://www.vberai.com/studio)


### Pipeline de producción completo

**Importar diseño y assets del proyecto → Generación y edición de alta frecuencia con IA → Entrega al motor basada en componentes → Sincronización en tiempo real con el motor mediante Engine MCP → Reflujo inverso del motor**

En conjunto con este complemento Cocos MCP, después de que AI Studio reescribe escenas, prefabs, componentes y recursos artísticos en el proyecto, Engine MCP permite que la IA continúe completando scripts, configuración de componentes, gestión de recursos y depuración dentro de Cocos Creator, formando un ciclo de desarrollo de extremo a extremo —— lo que aumenta enormemente la eficiencia del equipo, e incluso permite que una sola persona sea todo un equipo.

**🔗 Enlaces relacionados**: [Sitio web oficial de VberAI](https://www.vberai.com) ｜ [AI Studio](https://studio.vberai.com) ｜ [IA de recorte súper potente](https://www.vberai.com/ai-studio/bg-removal) ｜ [Precios de la plataforma](https://www.vberai.com/pricing) ｜ Contacto de soporte: support@vberai.com

---


## Registro de cambios de la versión de código abierto

## 🚀 Actualización importante v1.5.4

## Demostración en video de la versión actual de código abierto

[<img width="503" height="351" alt="视频演示" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

- **Simplificación y refactorización de herramientas**: Se consolidaron las 150+ herramientas originales en 50 herramientas centrales de alta reutilización y alta cobertura, eliminando todo el código redundante e ineficaz, lo que mejora enormemente la facilidad de uso y el mantenimiento.
- **Unificación de códigos de operación**: Todas las herramientas adoptan el modelo de "código de operación + parámetros", lo que simplifica enormemente el proceso de llamada de la IA, mejora la tasa de éxito de las llamadas de la IA, reduce el número de llamadas de la IA y disminuye el consumo de token en un 50%.
- **Mejora integral de la funcionalidad de prefabs**: Se corrigieron y perfeccionaron por completo todas las funciones centrales de creación, instanciación, sincronización y referencias de prefabs, con soporte para relaciones de referencia complejas, alineado al 100% con el formato oficial.
- **Vinculación de eventos y finalización de funciones antiguas**: Se completaron e implementaron la vinculación de eventos y otras funciones antiguas de nodos/componentes/recursos, con todos los métodos totalmente alineados con la implementación oficial.
- **Optimización de interfaces**: Todos los parámetros de las interfaces son más claros, la documentación es más completa, y a la IA le resulta más fácil entender y llamar.
- **Optimización del panel del complemento**: La interfaz del panel es más sencilla y las operaciones son más intuitivas.
- **Mejora de rendimiento y compatibilidad**: La arquitectura general es más eficiente, compatible con todas las versiones de Cocos Creator 3.8.6 y superiores.


## Sistema de herramientas y códigos de operación

- Todas las herramientas se nombran con el patrón "categoría_operación", los parámetros utilizan un Schema unificado y admiten el cambio entre múltiples códigos de operación (action), lo que mejora enormemente la flexibilidad y la escalabilidad.
- Las 50 herramientas centrales cubren todas las operaciones del editor: escena, nodo, componente, prefab, recursos, proyecto, depuración, preferencias, servidor, difusión de mensajes, entre otras.
- Ejemplo de llamada a una herramienta:

```json
{
  "tool": "node_lifecycle",
  "arguments": {
    "action": "create",
    "name": "MyNode",
    "parentUuid": "parent-uuid",
    "nodeType": "2DNode"
  }
}
```

---

## Principales categorías de funciones (algunos ejemplos)

- **scene_management**: Gestión de escenas (obtener/abrir/guardar/crear/cerrar escena)
- **node_query / node_lifecycle / node_transform**: Consulta, creación, eliminación y cambio de propiedades de nodos
- **component_manage / component_script / component_query**: Adición/eliminación de componentes, montaje de scripts, información de componentes
- **prefab_browse / prefab_lifecycle / prefab_instance**: Exploración, creación, instanciación y sincronización de prefabs
- **asset_manage / asset_analyze**: Importación y eliminación de recursos, análisis de dependencias
- **project_manage / project_build_system**: Ejecución del proyecto, compilación, información de configuración
- **debug_console / debug_logs**: Gestión de consola y registros
- **preferences_manage**: Preferencias
- **server_info**: Información del servidor
- **broadcast_message**: Difusión de mensajes


### v1.4.0 - 26 de julio de 2025

#### 🎯 Corrección importante de funcionalidad
- **Corrección completa de la función de creación de prefabs**: Se resolvió por completo el problema de pérdida de referencias de tipo componente/nodo/recurso al crear prefabs
- **Manejo correcto de referencias**: Se implementó un formato de referencia totalmente coherente con el de los prefabs creados manualmente
  - **Referencias internas**: Las referencias de nodos y componentes dentro del prefab se convierten correctamente al formato `{"__id__": x}`
  - **Referencias externas**: Las referencias de nodos y componentes fuera del prefab se establecen correctamente como `null`
  - **Referencias de recursos**: Las referencias a recursos como prefabs, texturas y sprite frames conservan completamente el formato UUID
- **Normalización de la API de eliminación de componentes/scripts**: Ahora, al eliminar un componente/script, es obligatorio pasar el cid del componente (el campo type); no se puede usar el nombre del script ni el nombre de la clase. La IA y el usuario deben primero usar getComponents para obtener el campo type (cid) y luego pasarlo a removeComponent. Esto permite eliminar con un 100% de precisión todos los tipos de componentes y scripts, siendo compatible con todas las versiones de Cocos Creator.

#### 🔧 Mejoras centrales
- **Optimización del orden de índices**: Se ajustó el orden de creación de objetos del prefab para garantizar la coherencia con el formato estándar de Cocos Creator
- **Soporte de tipos de componentes**: Se amplió la detección de referencias de componentes para admitir todos los tipos de componentes que comienzan con cc. (Label, Button, Sprite, etc.)
- **Mecanismo de mapeo de UUID**: Se perfeccionó el sistema de mapeo de UUID interno a índices, garantizando que las relaciones de referencia se establezcan correctamente
- **Estandarización del formato de propiedades**: Se corrigió el orden y formato de las propiedades de los componentes, eliminando errores de análisis del motor

#### 🐛 Corrección de errores
- **Corrección de error de importación de prefabs**: Se resolvió el error `Cannot read properties of undefined (reading '_name')`
- **Corrección de compatibilidad del motor**: Se resolvió el error `placeHolder.initDefault is not a function`
- **Corrección de sobrescritura de propiedades**: Se evita que propiedades clave como `_objFlags` sean sobrescritas por los datos del componente
- **Corrección de pérdida de referencias**: Se garantiza que todos los tipos de referencias se guarden y carguen correctamente

#### 📈 Mejoras de funcionalidad
- **Conservación completa de propiedades de componentes**: Todas las propiedades de los componentes, incluidas las propiedades privadas (como _group, _density, etc.)
- **Soporte de estructura de nodos hijos**: Se maneja correctamente la estructura jerárquica del prefab y las relaciones de nodos hijos
- **Manejo de propiedades de transformación**: Se conservan la posición, rotación, escala e información de jerarquía de los nodos
- **Optimización de la información de depuración**: Se añadieron registros detallados del manejo de referencias para facilitar el seguimiento de problemas

#### 💡 Avances técnicos
- **Identificación de tipos de referencia**: Distingue de forma inteligente entre referencias internas y externas, evitando referencias inválidas
- **Compatibilidad de formato**: Los prefabs generados son 100% compatibles en formato con los prefabs creados manualmente
- **Integración con el motor**: Los prefabs pueden montarse normalmente en la escena, sin ningún error en tiempo de ejecución
- **Optimización de rendimiento**: Se optimizó el proceso de creación de prefabs, mejorando la eficiencia de procesamiento de prefabs grandes

**🎉 Ahora la función de creación de prefabs está completamente operativa, con soporte para relaciones de referencia de componentes complejas y estructuras de prefab completas.**

### v1.3.0 - 25 de julio de 2024

#### 🆕 Nuevas funciones
- **Panel de gestión de herramientas integrado**: Se añadió directamente en el panel de control principal una funcionalidad integral de gestión de herramientas
- **Sistema de configuración de herramientas**: Se implementó la habilitación/deshabilitación selectiva de herramientas, con soporte para configuración persistente
- **Carga dinámica de herramientas**: Se mejoró la función de descubrimiento de herramientas, capaz de cargar dinámicamente las 158 herramientas disponibles en el servidor MCP
- **Gestión de estado de herramientas en tiempo real**: Se añadió actualización en tiempo real del conteo y estado de las herramientas, reflejándose de inmediato al alternar una herramienta individual
- **Persistencia de configuración**: Guarda y carga automáticamente la configuración de herramientas entre sesiones del editor

#### 🔧 Mejoras
- **Interfaz de panel unificada**: Se fusionó la gestión de herramientas en el panel principal del servidor MCP como una pestaña, eliminando la necesidad de un panel separado
- **Configuración del servidor mejorada**: Se mejoró la gestión de la configuración del servidor, con mejores funciones de persistencia y carga
- **Integración con Vue 3**: Se actualizó a la Composition API de Vue 3, ofreciendo mejor reactividad y rendimiento
- **Mejor manejo de errores**: Se añadió un manejo de errores integral, incluyendo un mecanismo de reversión para operaciones fallidas
- **UI/UX mejorados**: Se mejoró el diseño visual, incluyendo separadores adecuados, estilos de bloque distintivos y fondos de modal no transparentes

#### 🐛 Corrección de errores
- **Corrección de persistencia de estado de herramientas**: Se resolvió el problema de que el estado de las herramientas se reiniciara al cambiar de pestaña o reabrir el panel
- **Corrección de carga de configuración**: Se corrigieron problemas de carga de la configuración del servidor y de registro de mensajes
- **Corrección de interacción de casillas de verificación**: Se resolvió el problema de desmarcado de casillas y se mejoró la capacidad de respuesta
- **Corrección de desplazamiento del panel**: Se garantizó el correcto funcionamiento del desplazamiento en el panel de gestión de herramientas
- **Corrección de comunicación IPC**: Se resolvieron diversos problemas de comunicación IPC entre el frontend y el backend

#### 🏗️ Mejoras técnicas
- **Arquitectura simplificada**: Se eliminó la complejidad de múltiples configuraciones, centrándose en la gestión de una única configuración
- **Mejor seguridad de tipos**: Se mejoraron las definiciones de tipos e interfaces de TypeScript
- **Sincronización de datos mejorada**: Mejor sincronización entre el estado de la UI del frontend y el gestor de herramientas del backend
- **Depuración mejorada**: Se añadieron funciones integrales de registro y depuración

#### 📊 Información estadística
- **Total de herramientas**: Aumentó de 151 a 158 herramientas
- **Categorías**: 13 categorías de herramientas, con cobertura integral
- **Control del editor**: Se logró una cobertura del 98% de las funciones del editor

### v1.2.0 - Versión anterior
- Lanzamiento inicial, con 151 herramientas
- Funcionalidad básica del servidor MCP
- Operaciones de escena, nodo, componente y prefab
- Herramientas de control de proyecto y depuración



## Uso rápido

**Configuración de Claude CLI:**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp（usa el número de puerto que hayas configurado）
```

**Configuración del cliente de Claude:**

```
{

  "mcpServers": {

		"cocos-creator": {

 		"type": "http",

		"url": "http://127.0.0.1:3000/mcp"

		 }

	  }

}
```

**Configuración de MCP para Cursor u otros similares a VS**

```
{

  "mcpServers": { 

   "cocos-creator": {
      "url": "http://localhost:3000/mcp"
   }
  }

}
```

## Características funcionales

### 🎯 Operaciones de escena (scene_*)
- **scene_management**: Gestión de escenas - obtener la escena actual, abrir/guardar/crear/cerrar escena, con soporte para consulta de lista de escenas
- **scene_hierarchy**: Jerarquía de escena - obtener la estructura completa de la escena, con soporte para incluir información de componentes
- **scene_execution_control**: Control de ejecución - ejecutar métodos de componentes, scripts de escena, sincronización de prefabs

### 🎮 Operaciones de nodos (node_*)
- **node_query**: Consulta de nodos - buscar nodos por nombre/patrón, obtener información de nodos, detectar tipo 2D/3D
- **node_lifecycle**: Ciclo de vida del nodo - crear/eliminar nodos, con soporte para preinstalación de componentes e instanciación de prefabs
- **node_transform**: Transformación de nodos - modificar nombre, posición, rotación, escala, visibilidad y otras propiedades del nodo
- **node_hierarchy**: Jerarquía de nodos - mover, duplicar, pegar nodos, con soporte para operaciones de estructura jerárquica
- **node_clipboard**: Portapapeles de nodos - operaciones de copiar/pegar/cortar nodos
- **node_property_management**: Gestión de propiedades - restablecer propiedades de nodo, propiedades de componentes, propiedades de transformación

### 🔧 Operaciones de componentes (component_*)
- **component_manage**: Gestión de componentes - agregar/eliminar componentes del motor (cc.Sprite, cc.Button, etc.)
- **component_script**: Componentes de script - montar/eliminar componentes de script personalizados
- **component_query**: Consulta de componentes - obtener lista de componentes, información detallada, tipos de componentes disponibles
- **set_component_property**: Configuración de propiedades - establecer uno o varios valores de propiedades de componentes

### 📦 Operaciones de prefabs (prefab_*)
- **prefab_browse**: Exploración de prefabs - listar prefabs, ver información, validar archivos
- **prefab_lifecycle**: Ciclo de vida del prefab - crear prefab a partir de un nodo, eliminar prefab
- **prefab_instance**: Instancia de prefab - instanciar en la escena, desvincular, aplicar cambios, restaurar al original
- **prefab_edit**: Edición de prefabs - entrar/salir del modo de edición, guardar prefab, probar cambios

### 🚀 Control de proyecto (project_*)
- **project_manage**: Gestión de proyecto - ejecutar el proyecto, compilar el proyecto, obtener información y configuración del proyecto
- **project_build_system**: Sistema de compilación - controlar el panel de compilación, verificar el estado de compilación, gestionar el servidor de vista previa

### 🔍 Herramientas de depuración (debug_*)
- **debug_console**: Gestión de consola - obtener/limpiar registros de consola, con soporte para filtrado y límites
- **debug_logs**: Análisis de registros - leer/buscar/analizar archivos de registro del proyecto, con soporte para coincidencia de patrones
- **debug_system**: Depuración del sistema - obtener información del editor, estadísticas de rendimiento, información del entorno

### 📁 Gestión de recursos (asset_*)
- **asset_manage**: Gestión de recursos - importar/eliminar recursos por lotes, guardar metadatos, generar URL
- **asset_analyze**: Análisis de recursos - obtener relaciones de dependencia, exportar el inventario de recursos
- **asset_system**: Sistema de recursos - actualizar recursos, consultar el estado de la base de datos de recursos
- **asset_query**: Consulta de recursos - consultar recursos por tipo/carpeta, obtener información detallada
- **asset_operations**: Operaciones de recursos - crear/copiar/mover/eliminar/guardar/reimportar recursos

### ⚙️ Preferencias (preferences_*)
- **preferences_manage**: Gestión de preferencias - obtener/establecer las preferencias del editor
- **preferences_global**: Configuración global - gestionar la configuración global y los ajustes del sistema

### 🌐 Servidor y difusión (server_* / broadcast_*)
- **server_info**: Información del servidor - obtener el estado del servidor, detalles del proyecto, información del entorno
- **broadcast_message**: Difusión de mensajes - escuchar y difundir mensajes personalizados

### 🖼️ Imágenes de referencia (referenceImage_*)
- **reference_image_manage**: Gestión de imágenes de referencia - agregar/eliminar/gestionar imágenes de referencia en la vista de escena
- **reference_image_view**: Vista de imágenes de referencia - controlar la visualización y edición de imágenes de referencia

### 🎨 Vista de escena (sceneView_*)
- **scene_view_control**: Control de la vista de escena - controlar herramientas Gizmo, sistema de coordenadas, modo de vista
- **scene_view_tools**: Herramientas de la vista de escena - gestionar las diversas herramientas y opciones de la vista de escena

### ✅ Herramientas de validación (validation_*)
- **validation_scene**: Validación de escena - validar la integridad de la escena, verificar recursos faltantes
- **validation_asset**: Validación de recursos - validar referencias de recursos, verificar la integridad de los recursos

### 🛠️ Gestión de herramientas
- **Sistema de configuración de herramientas**: Habilitar/deshabilitar herramientas de forma selectiva, con soporte para múltiples conjuntos de configuración
- **Persistencia de configuración**: Guardar y cargar automáticamente la configuración de herramientas
- **Importación y exportación de configuración**: Soporte para importar y exportar la configuración de herramientas
- **Gestión de estado en tiempo real**: Actualización y sincronización en tiempo real del estado de las herramientas

### 🚀 Ventajas principales
- **Unificación de códigos de operación**: Todas las herramientas se nombran con el patrón "categoría_operación", con un Schema de parámetros unificado
- **Alta reutilización**: 50 herramientas centrales cubren el 99% de las funciones del editor
- **Compatible con IA**: Parámetros claros, documentación completa, llamadas sencillas
- **Optimización de rendimiento**: Reduce el consumo de tokens en un 50% y mejora la tasa de éxito de las llamadas de la IA
- **Totalmente compatible**: Alineado al 100% con la API oficial de Cocos Creator

## ⚠️ Lectura obligatoria antes de instalar (importante)

> **Antes de la primera instalación o de una actualización, asegúrese de eliminar los dos archivos `mcp-server.json` y `tool-manager.json` que se encuentran en el directorio `settings/` del proyecto actual; de lo contrario, ¡la visualización de la lista de herramientas del complemento presentará anomalías!**
>
> Rutas de los archivos: `tu-proyecto/settings/mcp-server.json` y `tu-proyecto/settings/tool-manager.json`
> Después de eliminar estos dos archivos, vuelva a abrir el panel del complemento para que todo funcione con normalidad.

## Instrucciones de instalación

### 1. Copiar los archivos del complemento

Copie toda la carpeta `cocos-mcp-server` al directorio `extensions` de su proyecto de Cocos Creator; también puede importar el proyecto directamente en el administrador de extensiones:

```
tu-proyecto/
├── assets/
├── extensions/
│   └── cocos-mcp-server/          <- Coloca el complemento aquí
│       ├── source/
│       ├── dist/
│       ├── package.json
│       └── ...
├── settings/
└── ...
```

### 2. Instalar dependencias

```bash
cd extensions/cocos-mcp-server
npm install
```

### 3. Compilar el complemento

```bash
npm run build
```

### 4. Habilitar el complemento

1. Reinicie Cocos Creator o actualice las extensiones
2. El complemento aparecerá en el menú de extensiones
3. Haga clic en `Extensión > Cocos MCP Server` para abrir el panel de control

## Modo de uso

### Iniciar el servidor

1. Abra el panel del servidor MCP desde `Extensión > Cocos MCP Server`
2. Configure los ajustes:
   - **Puerto**: puerto del servidor HTTP (predeterminado: 3000)
   - **Inicio automático**: inicia el servidor automáticamente al arrancar el editor
   - **Registro de depuración**: habilita registros detallados para la depuración durante el desarrollo
   - **Número máximo de conexiones**: número máximo de conexiones concurrentes permitidas

3. Haga clic en "Iniciar servidor" para comenzar a aceptar conexiones

### Conectar el asistente de IA

El servidor expone un endpoint HTTP en `http://localhost:3000/mcp` (o el puerto que haya configurado).

Los asistentes de IA pueden conectarse mediante el protocolo MCP y acceder a todas las herramientas disponibles.


## Desarrollo

### Estructura del proyecto
```
cocos-mcp-server/
├── source/                    # Archivos fuente de TypeScript
│   ├── main.ts               # Punto de entrada del complemento
│   ├── mcp-server.ts         # Implementación del servidor MCP
│   ├── settings.ts           # Gestión de configuración
│   ├── types/                # Definiciones de tipos de TypeScript
│   ├── tools/                # Implementación de herramientas
│   │   ├── scene-tools.ts
│   │   ├── node-tools.ts
│   │   ├── component-tools.ts
│   │   ├── prefab-tools.ts
│   │   ├── project-tools.ts
│   │   ├── debug-tools.ts
│   │   ├── preferences-tools.ts
│   │   ├── server-tools.ts
│   │   ├── broadcast-tools.ts
│   │   ├── scene-advanced-tools.ts (integrado en node-tools.ts y scene-tools.ts)
│   │   ├── scene-view-tools.ts
│   │   ├── reference-image-tools.ts
│   │   └── asset-advanced-tools.ts
│   ├── panels/               # Implementación de paneles de UI
│   └── test/                 # Archivos de prueba
├── dist/                     # Salida de JavaScript compilado
├── static/                   # Recursos estáticos (iconos, etc.)
├── i18n/                     # Archivos de internacionalización
├── package.json              # Configuración del complemento
└── tsconfig.json             # Configuración de TypeScript
```

### Compilar desde el código fuente

```bash
# Instalar dependencias
npm install

# Compilación de desarrollo (modo de vigilancia)
npm run watch

# Compilación de producción
npm run build
```

### Añadir una nueva herramienta

1. Cree una nueva clase de herramienta en `source/tools/`
2. Implemente la interfaz `ToolExecutor`
3. Añada la herramienta a la inicialización de `mcp-server.ts`
4. La herramienta se expondrá automáticamente a través del protocolo MCP

### Soporte de TypeScript

El complemento está escrito íntegramente en TypeScript y ofrece:
- Verificación estricta de tipos habilitada
- Definiciones de tipos completas para todas las API
- Soporte de IntelliSense durante el desarrollo
- Compilación automática a JavaScript

## Solución de problemas

### Problemas comunes

1. **El servidor no se inicia**: verifique la disponibilidad del puerto y la configuración del firewall
2. **Las herramientas no funcionan**: asegúrese de que la escena esté cargada y de que el UUID sea válido
3. **Errores de compilación**: ejecute `npm run build` para comprobar errores de TypeScript
4. **Problemas de conexión**: verifique la URL HTTP y el estado del servidor

### Modo de depuración

Habilite el registro de depuración en el panel del complemento para obtener registros de operaciones detallados.

### Uso de herramientas de depuración

```json
{
  "tool": "debug_get_console_logs",
  "arguments": {"limit": 50, "filter": "error"}
}
```

```json
{
  "tool": "debug_validate_scene",
  "arguments": {"checkMissingAssets": true}
}
```

## Requisitos del sistema

- Cocos Creator 3.8.6 o superior
- Node.js (incluido con Cocos Creator)
- TypeScript (instalado como dependencia de desarrollo)

## Licencia

Este complemento está destinado a su uso en proyectos de Cocos Creator, y el código fuente se incluye completo, por lo que puede usarse con fines de aprendizaje e intercambio. No está cifrado. Es posible utilizarlo para su propio desarrollo y optimización secundarios; sin embargo, ni el código de este proyecto ni ningún código derivado de él pueden utilizarse con fines comerciales ni ser revendidos. Si necesita un uso comercial, póngase en contacto conmigo.

## Contáctame para unirte al grupo
<img alt="image" src="https://github.com/user-attachments/assets/a276682c-4586-480c-90e5-6db132e89e0f" width="400" height="400" />
