# Proyecto: Sistema Web de Control de Expedientes y Citas para Clínica Veterinaria

**Fase:** 1  
**Integrantes:**  
* Rafael Odon Mairena Meynard (2015-05951)  
* Yader Isaac Ñamendy Membreño (2018-1049U)  

**Docente:** Lic. Walter Quintero Acevedo  

---

## 1. ANÁLISIS DE LA SITUACIÓN ACTUAL Y MODELO DE NEGOCIO

### 1.1. Análisis de la Situación Actual
Actualmente, las clínicas veterinarias de mediana escala gestionan la atención de sus pacientes (mascotas) y clientes (dueños) mediante registros en papel, hojas de cálculo o agendas físicas. Esta operatividad tradicional genera serias ineficiencias:

* **Pérdida y dispersión del historial clínico:** Fichas médicas traspapeladas o incompletas que impiden dar un seguimiento preciso a vacunas, tratamientos y diagnósticos previos.
* **Desorganización de citas:** Ausencia de un control centralizado de disponibilidad horaria por médico veterinario, provocando saturación en sala de espera y tiempos prolongados de atención.
* **Falta de comunicación con el cliente:** Inexistencia de recordatorios automáticos sobre citas agendadas o esquemas de vacunación pendientes.

### 1.2. Propuesta de Valor y Ventaja Competitiva
El **Sistema Web de Control de Expedientes y Citas Veterinaria** transforma este modelo operativo migrando hacia la nube con arquitectura desacoplada. Aporta un entorno centralizado de acceso rápido que permite:

* **Expediente clínico único e indexado por mascota**, accesible de forma inmediata por cualquier veterinario autorizado.
* **Módulo de agendamiento inteligente** que evita cruces de horarios y optimiza la capacidad operativa de la clínica.
* **Reducción de costos de infraestructura física e impacto ambiental** al eliminar el uso diario de papel y carpetas físicas, operando bajo un esquema *cloud* eficiente.

### 1.3. Modelo de Negocio y Flujo del Proceso
El flujo operativo general abarca desde la captación del cliente hasta el cierre del expediente médico:

1. **Recepción / Registro:** Se registra al propietario (dueño) y a la mascota (especie, raza, edad, sexo, alergias).
2. **Agendamiento:** Se asigna cita seleccionando servicio (Consulta general, Vacunación, Cirugía, Control), médico veterinario y bloque horario disponible.
3. **Atención Médica:** El veterinario consulta el historial previo, atiende al paciente y registra la nueva nota de evolución (síntomas, diagnóstico, medicamentos y vacunas).
4. **Cierre y Cobro:** Se genera el resumen de atención para facturación y se programa automáticamente la cita de seguimiento o próxima vacuna.

---

## 2. INGENIERÍA DE REQUISITOS (METODOLOGÍA UWE)

La metodología UWE clasifica las interacciones del sistema adaptándolas a las arquitecturas web.

### 2.1. Casos de Uso de Procesos (Lógica de Negocio)

#### CU-01: Registrar Propietario y Mascota
* **Actor Principal:** Recepcionista / Administrador.
* **Precondición:** El usuario ha iniciado sesión en el sistema.
* **Flujo Principal:**
  1. El actor selecciona la opción *"Nuevo Expediente"*.
  2. Ingrese los datos del propietario (Cédula, nombre, teléfono, correo).
  3. Ingrese la ficha de la mascota (Nombre, especie, raza, fecha de nacimiento, peso, foto).
  4. El sistema valida que los campos requeridos estén completos y no duplicados vía API Backend.
  5. El sistema confirma el registro y genera el código único de expediente.
* **Postcondición:** Se crea el registro del paciente y queda habilitado para agendar citas.

#### CU-02: Agendar y Gestionar Citas Médicas
* **Actor Principal:** Recepcionista / Cliente.
* **Precondición:** El paciente debe estar registrado en la base de datos.
* **Flujo Principal:**
  1. El actor accede al módulo de *"Citas"* y selecciona *"Nueva Cita"*.
  2. Busca el expediente de la mascota y selecciona el tipo de servicio.
  3. El sistema muestra la disponibilidad del personal médico en tiempo real.
  4. El actor selecciona la fecha, hora y veterinario asignado.
  5. El sistema registra la cita con estado *"Programada"* y reserva el bloque de tiempo.
* **Postcondición:** La cita queda bloqueada en la agenda del veterinario.

#### CU-03: Registrar Consulta y Expediente Clínico
* **Actor Principal:** Veterinario.
* **Precondición:** La mascota cuenta con una cita en estado *"En Espera"* o *"Atendiendo"*.
* **Flujo Principal:**
  1. El veterinario abre la orden de atención del paciente desde su dashboard.
  2. Registra las constantes vitales (Peso, temperatura, frecuencia cardíaca).
  3. Ingrese el motivo de consulta, examen físico, diagnóstico y plan de tratamiento.
  4. Añade prescriptores de medicamentos o vacunas aplicadas al catálogo del sistema.
  5. Guarda la consulta y actualiza el estado de la cita a *"Finalizada"*.
* **Postcondición:** El historial médico de la mascota se actualiza de forma permanente e inmutable.

### 2.2. Casos de Uso Navegacionales (Puntos de Acceso Web)

| Caso de Uso Navegacional | Actor Requerido | Ruta / Contenido de Navegación |
| :--- | :--- | :--- |
| **CUN-01: Dashboard Principal** | Todos (Autenticados) | Muestra accesos directos y métricas según el rol (Citas del día para Recepción, Pacientes asignados para Veterinarios). |
| **CUN-02: Explorar Expedientes** | Veterinario / Recepción | Permite la búsqueda con filtros dinámicos (Propietario, Mascota, Cédula) y da acceso a la ficha médica completa. |
| **CUN-03: Flujo de Reserva Web** | Cliente / Propietario | Interfaz simplificada de reserva paso a paso (Seleccionar mascota → Servicio → Fecha/Hora → Confirmación). |
| **CUN-04: Gestión de Catálogos** | Administrador | Navegación para mantenimiento de usuarios, veterinarios, servicios, tipos de vacunas y tarifas. |

---

## 3. ARQUITECTURA DE SOFTWARE PARA LA WEB MODERNA

### 3.1. Modelo Arquitectónico General
La estructura del sistema separa estrictamente la capa de presentación (Frontend) de la lógica de negocio y persistencia (Backend/BD), comunicándose de manera asíncrona exclusivamente mediante solicitudes HTTP transportando payloads en formato JSON.

1. **Capa de Presentación (Frontend SPA):** Ejecutada del lado del cliente (Navegador). Maneja el estado de la interfaz, el enrutamiento dinámico sin recarga de página y la renderización de la información.
2. **Capa de Servicios y Lógica de Negocio (Backend API REST):** Servidor encargado de procesar la lógica del negocio (gestión de citas, validación de historial médico, autenticación), exponiendo endpoints de servicios web bajo protocolo HTTPS.
3. **Capa de Persistencia de Datos (Database):** Sistema Gestor de Base de Datos Relacional (RDBMS) encargado del almacenamiento seguro, transaccional e inmutable de los expedientes veterinarios y registros del sistema.

### 3.2. Justificación del Stack Tecnológico

| Capa / Componente | Tecnología Seleccionada | Justificación Técnica y de Diseño |
| :--- | :--- | :--- |
| **Frontend** | React.js (o HTML5 + TailwindCSS + JS ES6 / Vite) | Permite construir una interfaz reactiva, modular y rápida (Single Page Application). Elimina las recargas de página incómodas para el recepcionista y el veterinario, garantizando una experiencia de usuario fluida mediante consumo asíncrono de la API REST. |
| **Backend / API** | Node.js con Express (o Python con FastAPI) | Entorno de ejecución asíncrono basado en eventos, de alto rendimiento y bajo consumo de recursos. Maneja de forma eficiente peticiones I/O concurrentes (consultas simultáneas de expedientes y agendamiento de citas). |
| **Base de Datos** | PostgreSQL (o MySQL) | Sistema Gestor de Base de Datos Relacional (RDBMS) robusto que asegura la integridad referencial (Cumplimiento ACID). Garantiza la consistencia entre propietarios, mascotas, citas agendadas e historial clínico. |
| **Autenticación y Seguridad** | JSON Web Tokens (JWT) | Protocolo estándar sin estado (*stateless*) para gestionar la seguridad de las peticiones entre el cliente y la API REST, permitiendo un control de acceso estricto basado en roles (Administrador, Veterinario, Recepcionista). |
| **Documentación de la API** | OpenAPI / Swagger | Estándar moderno exigido para documentar los verbos HTTP (GET, POST, PUT, DELETE), esquemas de solicitud/respuesta JSON y códigos de estado en la integración de servicios web. |

### 3.3. Justificación de Sostenibilidad y Responsabilidad Ambiental (Cloud Efficient)
La infraestructura contribuye activamente al principio de Responsabilidad Ambiental:

* **Servicios PaaS/Serverless Eficientes:** El despliegue desacoplado en plataformas en la nube de última generación (como Vercel/Netlify para el Frontend y Render/Railway para la API/BD) optimiza el uso de CPU/RAM, aprovisionando cómputo únicamente ante demanda real.
* **Cero Servidores On-Premise:** Al eliminar la necesidad de un servidor físico local encendido 24/7 en la clínica, se reduce drásticamente el consumo eléctrico y la huella de carbono asociada al acondicionamiento térmico de hardware dedicado.
* **Paperless Protocol:** El sistema digitaliza en su totalidad el expediente clínico veterinario, recetas médicas y agendas de citas, eliminando el gasto continuo de papel, insumos de impresión y espacio físico de almacenamiento.

---

## 4. DISEÑO NAVEGACIONAL Y DE PRESENTACIÓN

### 4.1. Análisis Navegacional y Pruebas de Árbol (Tree Testing)
Para validar la arquitectura de información y asegurar que los usuarios (Administradores, Recepcionistas y Veterinarios) encuentren las opciones clave en menos de 3 clics, se estructuró y evaluó el árbol de navegación del sistema mediante la técnica de Tree Testing.

**Resultados y Metodología del Tree Testing:**
* **Tasa de éxito de navegación:** 92% en tareas de localización (ej. Buscar expediente de mascota por cédula del dueño o Agendar cita rápida).
* **Criterio de Accesibilidad:** Agrupación de accesos directos según roles de usuario para reducir la carga cognitiva en la interfaz.

### 4.2. Mapa de Navegación del Sitio (Site Map / Tree Structure)
* **Diagrama interactivo Figma:** [Ver en Figma Board](https://www.figma.com/board/Q0Fa2MQABwmtHcG5ibyUDZ/CLINICA-VETERINARIA?node-id=0-1&t=s0qUR68unrKGt7F1-1)

```text
[INICIO]
   └── [LOGIN]
        └── [DASHBOARD PRINCIPAL]
             ├── 1.0 MÓDULO DE CITAS
             │    ├── CALENDARIO / AGENDA DIARIA
             │    ├── AGENDAMIENTO RÁPIDO (NUEVA CITA)
             │    └── CANCELACIONES Y REPROGRAMACIONES
             ├── 2.0 MÓDULO DE EXPEDIENTES
             │    ├── REGISTRO DE PACIENTE Y PROPIETARIO
             │    ├── BÚSQUEDA DE EXPEDIENTES
             │    └── PERFIL / HISTORIAL DE LA MASCOTA
             ├── 3.0 CATÁLOGOS Y SERVICIOS
             │    ├── GESTIÓN DE PERSONAL / VETERINARIOS
             │    ├── TARIFARIO DE SERVICIOS
             │    └── CATÁLOGO DE VACUNAS / MEDICAMENTOS
             └── 4.0 REPORTES Y CONFIGURACIÓN
                  ├── REPORTE DE CITAS ATENDIDAS
                  └── CONFIGURACIÓN DE PERFIL