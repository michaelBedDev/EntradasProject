// API para verificar el rol del usuario
import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/adminClient";

export async function POST(req: Request) {
  try {
    // Obtener la wallet del cuerpo de la solicitud
    const { wallet } = await req.json();

    if (!wallet) {
      return NextResponse.json({ error: "Se requiere una wallet" }, { status: 400 });
    }

    // Normalizar la wallet a minúsculas para búsqueda
    const normalizedWallet = wallet.toLowerCase().trim();

    console.log("[API] Verificando rol para wallet normalizada:", normalizedWallet);

    // Utilizar adminClient para tener permisos completos sobre la tabla de usuarios
    const supabase = getSupabaseClient();

    // Primero, obtener la estructura de la tabla para depuración
    const { data: tableInfo } = await supabase.from("usuarios").select("*").limit(1);

    console.log(
      "[API] Estructura de la tabla usuarios:",
      tableInfo ? Object.keys(tableInfo[0]) : "No se pudo obtener",
    );

    // Intentar encontrar el usuario con la wallet exacta
    console.log("[API] Buscando coincidencia exacta para wallet:", normalizedWallet);

    // Consultar el usuario por wallet - primera consulta exacta
    let { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("wallet", normalizedWallet)
      .single();

    // Si no se encuentra, intentar con una búsqueda más flexible
    if (error && error.code === "PGRST116") {
      console.log(
        "[API] No se encontró coincidencia exacta, probando búsqueda insensible a mayúsculas/minúsculas",
      );

      // Obtener todos los usuarios para buscar manualmente (en ambiente de desarrollo esto es aceptable)
      const { data: allUsers, error: allUsersError } = await supabase
        .from("usuarios")
        .select("*");

      if (allUsersError) {
        console.error("[API] Error al obtener todos los usuarios:", allUsersError);
      } else if (allUsers && allUsers.length > 0) {
        console.log("[API] Usuarios totales encontrados:", allUsers.length);

        // Mostrar wallets disponibles para depuración
        console.log(
          "[API] Wallets disponibles:",
          allUsers.map((u) => u.wallet),
        );

        // Buscar manualmente un usuario cuya wallet coincida ignorando mayúsculas/minúsculas
        const foundUser = allUsers.find(
          (u) => u.wallet && u.wallet.toLowerCase() === normalizedWallet,
        );

        if (foundUser) {
          console.log("[API] Usuario encontrado con búsqueda manual:", foundUser);
          data = foundUser;
          error = null;
        }
      }
    }

    if (error) {
      console.error("[API] Error final al buscar usuario:", error);

      // Si no se encuentra el usuario, devolver rol por defecto
      if (error.code === "PGRST116") {
        console.log(
          "[API] No existe el usuario con esta wallet, devolviendo rol por defecto",
        );
        return NextResponse.json({ role: "usuario" });
      }

      return NextResponse.json(
        { error: "Error al buscar el usuario", details: error.message },
        { status: 500 },
      );
    }

    if (!data) {
      console.log(
        "[API] No se encontraron datos del usuario, asignando rol por defecto",
      );
      return NextResponse.json({ role: "usuario" });
    }

    console.log("[API] Usuario encontrado:", {
      id: data.id,
      wallet: data.wallet,
      rol: data.rol,
    });

    // Devolver el rol del usuario
    return NextResponse.json({ role: data.rol });
  } catch (error) {
    console.error("[API] Error del servidor:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
