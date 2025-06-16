"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users } from "lucide-react";
import { useState } from "react";
import RequireAdmin from "@/features/auth/components/guards/RequireAdmin";
import { useUsuariosPorRol } from "@/features/auth/hooks/useUsuariosPorRol";
import { RolUsuario } from "@/types/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { showToastError, showToastSuccess } from "@/lib/utils/toast";

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState<RolUsuario>(RolUsuario.ADMINISTRADOR);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const { usuarios, isLoading, error, refetch, actualizarRol } =
    useUsuariosPorRol(activeTab);

  const handleActualizarRol = async (usuarioId: string, nuevoRol: RolUsuario) => {
    try {
      setProcesandoId(usuarioId);
      const success = await actualizarRol(usuarioId, nuevoRol);
      if (success) {
        showToastSuccess({
          title: "Rol actualizado correctamente",
          description: `El usuario ahora tiene el rol de ${nuevoRol}`,
        });
        refetch();
      }
    } catch (error) {
      showToastError({
        title: "Error al actualizar el rol",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar el rol del usuario",
      });
    } finally {
      setProcesandoId(null);
    }
  };

  if (error) {
    return (
      <RequireAdmin>
        <div className="container mx-auto py-12 px-8 max-w-7xl">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4 text-xl">{error}</div>
          </div>
        </div>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin>
      <div className="container mx-auto py-12 px-8 max-w-7xl">
        <div className="mb-12 mt-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Gestión de roles
          </h1>
        </div>
        <Tabs
          defaultValue={RolUsuario.ADMINISTRADOR}
          className="space-y-4"
          onValueChange={(value) => setActiveTab(value as RolUsuario)}>
          <TabsList>
            <TabsTrigger
              value={RolUsuario.ADMINISTRADOR}
              className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administradores
            </TabsTrigger>
            <TabsTrigger
              value={RolUsuario.ORGANIZADOR}
              className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Organizadores
            </TabsTrigger>
          </TabsList>
          <TabsContent value={RolUsuario.ADMINISTRADOR}>
            <Card>
              <CardHeader>
                <CardTitle>Administradores del Sistema</CardTitle>
                <CardDescription>
                  Lista de usuarios con rol de administrador
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: Math.max(usuarios.length || 2, 2) }).map(
                        (_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-48" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-8 w-20 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                ) : usuarios.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay administradores registrados
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuarios.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">
                            {admin.nombre || "Sin nombre"}
                          </TableCell>
                          <TableCell>{admin.email || "Sin email"}</TableCell>
                          <TableCell>{admin.wallet}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 cursor-pointer"
                              onClick={() =>
                                handleActualizarRol(admin.id, RolUsuario.USUARIO)
                              }
                              disabled={procesandoId === admin.id}>
                              Revocar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value={RolUsuario.ORGANIZADOR}>
            <Card>
              <CardHeader>
                <CardTitle>Organizadores Registrados</CardTitle>
                <CardDescription>
                  Lista de usuarios con rol de organizador
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: Math.max(usuarios.length || 2, 2) }).map(
                        (_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-48" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-8 w-20 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                    </TableBody>
                  </Table>
                ) : usuarios.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay organizadores registrados
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usuarios.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell className="font-medium">
                            {org.nombre || "Sin nombre"}
                          </TableCell>
                          <TableCell>{org.email || "Sin email"}</TableCell>
                          <TableCell>{org.wallet}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 cursor-pointer"
                              onClick={() =>
                                handleActualizarRol(org.id, RolUsuario.USUARIO)
                              }
                              disabled={procesandoId === org.id}>
                              Revocar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAdmin>
  );
}
