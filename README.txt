REMATE MUEBLES — LANDINGS OFICINISTAS + MAYORISTAS

ARCHIVOS
- index.html: landing para oficinistas, empresas y personas que equipan o renuevan su espacio.
- b2c.html: landing para mayoristas y revendedores. El nombre se conserva por solicitud del proyecto.
- thankyou.html: confirmación compartida, Calendly y redirección a WhatsApp.
- styles.css: estilos compartidos.
- script.js: navegación, popup, formularios, FAQ, scroll, fecha y thank you.
- assets/: logo derivado del archivo .ai, favicon e imágenes optimizadas.

AJUSTES DE ESTA VERSIÓN
- Se intercambió la asignación de archivos: oficinistas ahora es index.html y mayoristas es b2c.html.
- Se añadieron placeholders a todos los campos de texto, correo, teléfono, número y fecha.
- El campo de fecha conserva el selector nativo del navegador y muestra “dd/mm/aaaa” cuando está vacío.
- Las reseñas de oficinistas ahora incluyen fotografías reales de producto e instalación proporcionadas para Remate.
- Se corrigió el comportamiento responsivo del hero sin modificar sus copys.
- Se sustituyó el icono del botón flotante por el glifo completo de WhatsApp.
- La página de agradecimiento devuelve al usuario a la landing correcta según el formulario enviado.

CONFIGURACIÓN PENDIENTE
1. Abre script.js.
2. Sustituye:
   const CALENDLY_URL = "";
   por la URL real, por ejemplo:
   const CALENDLY_URL = "https://calendly.com/usuario/evento";

El embed de Calendly ya está implementado. Mientras la URL permanezca vacía,
thankyou.html muestra [DATO PENDIENTE: URL DE CALENDLY].

FORMULARIOS
Los formularios guardan los datos en sessionStorage y navegan a thankyou.html.
Para enviar leads a CRM, correo o base de datos se debe conectar un endpoint
real dentro del evento submit de script.js.

PRUEBA LOCAL
Ejecuta un servidor local en esta carpeta:
python -m http.server 8000

Después abre:
http://localhost:8000/index.html
http://localhost:8000/b2c.html

Para revisar thankyou.html sin la redirección automática:
http://localhost:8000/thankyou.html?noRedirect=1

DATOS DE CONTACTO INCLUIDOS
WhatsApp: 33 1985 6883
Teléfono: 33 1454 0787
Correo: infoventas@rematemuebles.com
Dirección: Av. Agustín Yáñez #1293, Col. Moderna, Guadalajara, Jal.
Horario: lunes a viernes de 9:30 a. m. a 7:00 p. m.;
sábado de 10:30 a. m. a 3:00 p. m.
