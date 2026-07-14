# Remate Muebles — Landings de conversión

## Archivos

- `index.html`: landing B2B para mayoristas, revendedores y proyectos.
- `b2c.html`: landing B2C para oficina, renovación y home office.
- `thankyou.html`: confirmación, WhatsApp y espacio de Calendly.
- `styles.css`: estilos compartidos, mobile-first.
- `script.js`: navegación, modal, formularios, carruseles, FAQ y redirecciones.
- `assets/`: logotipos, favicon e imágenes optimizadas.

## Dato pendiente antes de publicar

En `script.js`, reemplaza:

```js
const CALENDLY_URL = "";
```

por el enlace oficial de Calendly de Remate Muebles:

```js
const CALENDLY_URL = "https://calendly.com/USUARIO/EVENTO";
```

No se colocó una URL inventada.

## Formularios

El demo guarda los datos en `sessionStorage` y redirige a `thankyou.html`.  
Para producción, conecta el `submit` de `#leadForm` con el CRM, webhook o backend correspondiente antes de redirigir.

## Pruebas recomendadas

1. Abrir `index.html` y `b2c.html`.
2. Probar menú móvil, anclas, tabs, FAQ y todos los CTA.
3. Enviar ambos formularios.
4. Verificar el resumen en `thankyou.html`.
5. Confirmar mensaje prellenado y número de WhatsApp.
6. Conectar Calendly.
7. Probar en iPhone, Android y escritorio.
8. Validar políticas, cobertura y cualquier afirmación comercial antes de publicar.

Dinametra — dinametra.com
