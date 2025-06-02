// API para verificar el rol del usuario
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";

export async function POST(req: Request) {
  /* Esta ruta está protegida por autenticación, pero no la usamos aquí
   * por lo general, los usuarios necesitan estar autenticados para el resto de las rutas
  * pero esta ruta es para verificar el rol de un usuario por su wallet
  * y no requiere autenticación previa.
  *
  // const session = await getServerSession(authOptions);
  // if (!session || !session.supabase) {
  //   return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  // }
  *
  */
  try {
    // Obtener la wallet del cuerpo de la solicitud
    const { wallet } = await req.json();

    if (!wallet) {
      return NextResponse.json({ error: "Se requiere una wallet" }, { status: 400 });
    }

    // Utilizar adminClient para tener permisos completos sobre la tabla de usuarios
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("usuarios")
      .select("wallet, rol")
      .eq("wallet", wallet)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al consultar la base de datos", details: error.message },
        { status: 500 },
      );
    }

    // Si no se encuentra el usuario, devolver rol por defecto
    if (!data) {
      return NextResponse.json({ rol: "usuario" }, { status: 200 });
    }

    // Devolver el rol del usuario
    return NextResponse.json({ wallet: data.wallet, role: data.rol });
  } catch (_error) {
    return NextResponse.json(
      { error: "Error del servidor: " + _error },
      { status: 500 },
    );
  }
}
