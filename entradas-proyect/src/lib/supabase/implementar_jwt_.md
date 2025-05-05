Perfecto. Vamos a implementar el **flujo reforzado**, donde generas el JWT de Supabase **justo después de que el usuario firme con su wallet (SIWE)** — es decir, en el momento exacto en que verificas la firma del mensaje.

Así evitarás usar `getServerSession()` para firmar el JWT y te proteges contra el robo de la sesión.

---

## ✅ ¿Dónde ocurre la verificación del mensaje SIWE?

En tu `authOptions.ts`, dentro de la función `authorize()` del `CredentialsProvider`.

Ahí es donde validas la firma del usuario con Viem:

```ts
const valid = await publicClient.verifySiweMessage({
  message: credentials.message,
  signature: credentials.signature,
  domain: parsedMessage.domain,
  nonce: parsedMessage.nonce,
});
```

Este es el **momento ideal** para generar el JWT de Supabase, porque:

* Has validado que el usuario es quien dice ser.
* Tienes la dirección de su wallet (`parsedMessage.address`).

---

## 🛠 Paso a paso para integrarlo

### 1. Añade tu función de generación del JWT

En `lib/supabase/jwt.ts`:

```ts
import jwt from "jsonwebtoken";

export function generateSupabaseJWT(wallet: string) {
  return jwt.sign(
    {
      wallet, // o sub: wallet, si usas auth.uid()
      exp: Math.floor(Date.now() / 1000) + 60 * 15, // duración corta
    },
    process.env.SUPABASE_JWT_SECRET!,
    { algorithm: "HS256" }
  );
}
```

---

### 2. Llama a esa función **en el `authorize()`** justo después de verificar la firma

```ts
import { generateSupabaseJWT } from "@/lib/supabase/jwt";

const valid = await publicClient.verifySiweMessage(...);

if (valid && parsedMessage.address) {
  const baseUser = {
    id: parsedMessage.address,
    address: parsedMessage.address,
    supabaseToken: generateSupabaseJWT(parsedMessage.address), // 👈 aquí
  };

  const additionalData = await config?.onSuccess?.(parsedMessage.address);

  return {
    ...baseUser,
    ...additionalData,
  };
}
```

---

### 3. Asegúrate de **incluir el token en la sesión de NextAuth**

En el callback de `jwt()` y `session()`:

```ts
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.address = user.address;
      token.supabaseToken = user.supabaseToken;
    }
    return token;
  },
  async session({ session, token }) {
    return {
      ...session,
      address: token.address,
      supabaseToken: token.supabaseToken, // 👈 aquí
    };
  },
}
```

---

### 4. Ahora, desde el **frontend**, puedes acceder a `session.supabaseToken`:

```ts
const { data: session } = useSession();

const token = session?.supabaseToken;
```

Y usarlo directamente en un cliente Supabase:

```ts
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});
```

---

## ✅ Ventajas de este enfoque:

* El JWT de Supabase **solo se genera tras una firma real de wallet**.
* No depende de que haya sesión persistente (ni cookies seguras).
* Protege contra robo de sesión: si alguien copia la cookie, **no puede generar el JWT**.

---
