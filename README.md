# JYS Raíces — Sitio nuevo (fuera de Wasi)

Esta es la versión real del sitio, conectada a tu propia base de datos (Supabase).
Ya tiene tu logo... bueno, aún no — tus datos de contacto reales sí están cargados.
Sigue estos pasos EN ORDEN. Ninguno requiere escribir código.

## Antes de empezar
Ya hiciste esta parte:
- ✅ Cuenta de Supabase creada (proyecto "JYSraices")
- ✅ Cuenta de Vercel creada

## Paso 1 — Preparar la base de datos
1. Entra a tu proyecto en supabase.com → menú izquierdo → **SQL Editor** → **New query**.
2. Abre el archivo `supabase-schema.sql` (te lo compartí antes), copia TODO su contenido y pégalo ahí.
3. Dale clic a **Run**. Deberías ver "Success. No rows returned".
4. Ve a **Storage** (menú izquierdo) → **New bucket** → nombre exacto: `property-photos` → activa **Public bucket** → **Create bucket**.
5. Vuelve al **SQL Editor**, abre otra vez `supabase-schema.sql`, y corre solo la parte de abajo (las 3 políticas de `storage.objects`) — puede que ya la hayas corrido si copiaste todo el archivo, en ese caso omite este paso.

## Paso 2 — Crear tu usuario y el de tus asesores
1. En Supabase, ve a **Authentication** → **Users** → **Add user** → **Create new user**.
2. Pon tu correo y una contraseña. Marca "Auto Confirm User" para que no tenga que confirmar por correo.
3. Repite lo mismo para cada asesor (máximo 2 por ahora, según lo que hablamos).
4. Guarda esas contraseñas en un lugar seguro — son el acceso al panel de administración del sitio.

## Paso 3 — Subir el código a GitHub (para conectarlo a Vercel)
1. Ve a github.com → crea una cuenta gratis si no tienes.
2. Botón verde **New** → nombre del repositorio: `jys-raices-site` → **Create repository**.
3. En la pantalla que aparece, busca el enlace **"uploading an existing file"** y haz clic.
4. Arrastra TODOS los archivos y carpetas de este proyecto ahí (todo lo que está en esta carpeta, incluyendo la carpeta `src`).
5. Abajo, escribe un mensaje como "primera versión" y dale a **Commit changes**.

## Paso 4 — Conectar con Vercel
1. Entra a vercel.com → **Add New** → **Project**.
2. Elige **Import Git Repository** y selecciona `jys-raices-site`.
3. Vercel va a detectar que es un proyecto Vite automáticamente. No cambies nada ahí.
4. Antes de darle a "Deploy", despliega **Environment Variables** y agrega estas dos (los valores están en `.env.example`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Dale clic a **Deploy**. En 1-2 minutos te da un link tipo `jys-raices-site.vercel.app` — ese es tu sitio real, público, funcionando.

## Paso 5 — Probarlo
1. Abre el link que te dio Vercel.
2. Haz clic en "Gestionar propiedades" → inicia sesión con el correo y contraseña que creaste en el Paso 2.
3. Agrega una propiedad de prueba con una foto. Si aparece en la página principal, todo quedó bien conectado.

## Cuándo quieras reemplazar a Wasi (más adelante, no ahora)
Cuando decidas dar el salto:
1. En Vercel → tu proyecto → **Settings** → **Domains** → agrega `jysraices.com`.
2. Vercel te va a dar unos registros DNS para poner donde compraste el dominio.
3. Cuando eso propague (unas horas), tu dominio real mostrará este sitio en vez de Wasi.
Este paso no se toca hasta que tú digas que sí.

## Si algo falla
- Pantalla en blanco o "No se pudo conectar": revisa que las dos variables de entorno en Vercel estén escritas exactamente igual a como aparecen en `.env.example`.
- No puedes iniciar sesión: confirma que el usuario esté creado en Supabase → Authentication → Users, y que hayas marcado "Auto Confirm User".
- Las fotos no suben: revisa que el bucket se llame exactamente `property-photos` y que sea público.

Cualquier error, mándame una captura de pantalla y seguimos desde ahí.
