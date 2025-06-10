// "use client";
export default function RolesPage() {
  return <div>En construcción...</div>;
}

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Shield, Users, Calendar, MapPin, Ticket } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { useState } from "react";
// import { EventoStatus } from "@/features/eventos/services/types";

// // Datos de ejemplo
// const administradores = [
//   {
//     id: "1",
//     nombre: "Admin Principal",
//     email: "admin@example.com",
//     wallet: "0x123...abc",
//     fechaRegistro: "2024-01-01",
//   },
//   {
//     id: "2",
//     nombre: "Admin Secundario",
//     email: "admin2@example.com",
//     wallet: "0x456...def",
//     fechaRegistro: "2024-01-15",
//   },
// ];

// const organizadores = [
//   {
//     id: "1",
//     nombre: "Rock Productions",
//     email: "rock@example.com",
//     wallet: "0x789...ghi",
//     fechaRegistro: "2024-02-01",
//     eventosCreados: 5,
//     eventos: [
//       {
//         id: "1",
//         titulo: "Concierto de Rock",
//         fecha: "2024-03-15",
//         ubicacion: "Sala Rock",
//         estado: EventoStatus.APROBADO,
//         entradasVendidas: 150,
//         entradasTotales: 200,
//       },
//       {
//         id: "2",
//         titulo: "Festival de Música",
//         fecha: "2024-04-20",
//         ubicacion: "Parque Central",
//         estado: EventoStatus.PENDIENTE,
//         entradasVendidas: 0,
//         entradasTotales: 500,
//       },
//     ],
//   },
//   {
//     id: "2",
//     nombre: "Cine Club",
//     email: "cine@example.com",
//     wallet: "0x012...jkl",
//     fechaRegistro: "2024-02-15",
//     eventosCreados: 3,
//     eventos: [
//       {
//         id: "3",
//         titulo: "Festival de Cine",
//         fecha: "2024-04-20",
//         ubicacion: "Cine Central",
//         estado: EventoStatus.APROBADO,
//         entradasVendidas: 75,
//         entradasTotales: 100,
//       },
//     ],
//   },
//   {
//     id: "3",
//     nombre: "Arte Moderno",
//     email: "arte@example.com",
//     wallet: "0x345...mno",
//     fechaRegistro: "2024-03-01",
//     eventosCreados: 2,
//     eventos: [
//       {
//         id: "4",
//         titulo: "Exposición de Arte",
//         fecha: "2024-03-10",
//         ubicacion: "Galería Moderna",
//         estado: EventoStatus.CANCELADO,
//         entradasVendidas: 0,
//         entradasTotales: 50,
//       },
//     ],
//   },
// ];

// const getBadgeVariant = (estado: string) => {
//   switch (estado) {
//     case EventoStatus.APROBADO:
//       return "default";
//     case EventoStatus.PENDIENTE:
//       return "secondary";
//     case EventoStatus.CANCELADO:
//       return "destructive";
//     default:
//       return "outline";
//   }
// };

// export default function RolesPage() {
//   const [setSelectedOrganizador] = useState<org>();

//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Gestión de Roles</h2>
//       </div>
//       <Tabs defaultValue="administradores" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="administradores" className="flex items-center gap-2">
//             <Shield className="h-4 w-4" />
//             Administradores
//           </TabsTrigger>
//           <TabsTrigger value="organizadores" className="flex items-center gap-2">
//             <Users className="h-4 w-4" />
//             Organizadores
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="administradores">
//           <Card>
//             <CardHeader>
//               <CardTitle>Administradores del Sistema</CardTitle>
//               <CardDescription>
//                 Lista de usuarios con rol de administrador
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Nombre</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Wallet</TableHead>
//                     <TableHead>Fecha de Registro</TableHead>
//                     <TableHead className="text-right">Acciones</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {administradores.map((admin) => (
//                     <TableRow key={admin.id}>
//                       <TableCell className="font-medium">{admin.nombre}</TableCell>
//                       <TableCell>{admin.email}</TableCell>
//                       <TableCell>{admin.wallet}</TableCell>
//                       <TableCell>
//                         {new Date(admin.fechaRegistro).toLocaleDateString("es-ES", {
//                           day: "numeric",
//                           month: "long",
//                           year: "numeric",
//                         })}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <Button variant="outline" size="sm">
//                           Editar
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//         <TabsContent value="organizadores">
//           <Card>
//             <CardHeader>
//               <CardTitle>Organizadores Registrados</CardTitle>
//               <CardDescription>
//                 Lista de usuarios con rol de organizador
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Nombre</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Wallet</TableHead>
//                     <TableHead>Fecha de Registro</TableHead>
//                     <TableHead>Eventos Creados</TableHead>
//                     <TableHead className="text-right">Acciones</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {organizadores.map((org) => (
//                     <TableRow key={org.id}>
//                       <TableCell className="font-medium">
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button
//                               variant="link"
//                               className="p-0 h-auto font-medium"
//                               onClick={
//                                 () => setSelectedOrganizador(org)}>
//                               {org.nombre}
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-w-3xl">
//                             <DialogHeader>
//                               <DialogTitle>Eventos de {org.nombre}</DialogTitle>
//                               <DialogDescription>
//                                 Lista de eventos creados por este organizador
//                               </DialogDescription>
//                             </DialogHeader>
//                             <div className="grid gap-4">
//                               {org.eventos.map((evento) => (
//                                 <Card key={evento.id}>
//                                   <CardHeader>
//                                     <div className="flex items-center justify-between">
//                                       <CardTitle className="text-lg">
//                                         {evento.titulo}
//                                       </CardTitle>
//                                       <Badge
//                                         variant={getBadgeVariant(evento.estado)}>
//                                         {evento.estado}
//                                       </Badge>
//                                     </div>
//                                   </CardHeader>
//                                   <CardContent>
//                                     <div className="grid gap-2">
//                                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                         <Calendar className="h-4 w-4" />
//                                         {new Date(evento.fecha).toLocaleDateString(
//                                           "es-ES",
//                                           {
//                                             day: "numeric",
//                                             month: "long",
//                                             year: "numeric",
//                                           },
//                                         )}
//                                       </div>
//                                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                         <MapPin className="h-4 w-4" />
//                                         {evento.ubicacion}
//                                       </div>
//                                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                         <Ticket className="h-4 w-4" />
//                                         {evento.entradasVendidas} /{" "}
//                                         {evento.entradasTotales} entradas vendidas
//                                       </div>
//                                     </div>
//                                   </CardContent>
//                                 </Card>
//                               ))}
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                       </TableCell>
//                       <TableCell>{org.email}</TableCell>
//                       <TableCell>{org.wallet}</TableCell>
//                       <TableCell>
//                         {new Date(org.fechaRegistro).toLocaleDateString("es-ES", {
//                           day: "numeric",
//                           month: "long",
//                           year: "numeric",
//                         })}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="secondary">{org.eventosCreados}</Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="outline" size="sm">
//                             Editar
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="text-red-600">
//                             Revocar
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
