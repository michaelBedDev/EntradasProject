// app/api/supabase-test/[action]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(
  req: NextRequest,
  { params }: { params: { action: string } },
) {
  const { action } = params;
  const body = await req.json();

  switch (action) {
    case "create-user":
      return await insert("usuarios", {
        wallet: body.wallet,
        nombre: body.nombre,
        rol: body.rol,
        email: body.email,
      });

    case "create-event": {
      // buscar el UUID real a partir del wallet
      const { data: usuarios, error: userError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("wallet", body.organizador_wallet)
        .limit(1)
        .maybeSingle();

      if (userError || !usuarios) {
        return NextResponse.json(
          { error: "Organizador no encontrado" },
          { status: 404 },
        );
      }

      return await insert("eventos", {
        titulo: body.titulo,
        descripcion: body.descripcion,
        fecha: body.fecha,
        lugar: body.lugar,
        imagen_uri: body.imagen_uri,
        organizador_id: usuarios.id,
      });
    }

    case "create-ticket-type":
      return await insert("tipo_entradas", {
        evento_id: body.evento_id,
        nombre: body.nombre,
        descripcion: body.descripcion,
        precio: body.precio,
        cantidad: body.cantidad,
        zona: body.zona,
      });

    case "create-ticket":
      return await insert("entradas", {
        wallet: body.wallet,
        tipo_entrada_id: body.tipo_entrada_id,
        token: body.token,
        metadata_uri: body.metadata_uri,
        qr_code: body.qr_code,
        qr_image_uri: body.qr_image_uri,
        estado: body.estado,
        tx_hash: body.tx_hash,
      });

    default:
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  }
}

async function insert(table: string, data: any) {
  const { data: result, error } = await supabase.from(table).insert(data).select();
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ result });
}

//Aquí tengo que crear los tipos en typescript para cada una de las tablas
// y crear un tipo genérico para el body de la función handleInsert
