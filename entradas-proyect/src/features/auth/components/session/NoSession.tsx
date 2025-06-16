export function NoSession({ noSessionText }: { noSessionText: string }) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl text-center">
      <h1 className="text-2xl font-bold mb-4">{noSessionText}</h1>
      <p className="text-muted-foreground mb-6">¿Seguro que has iniciado sesión?</p>
      <div className="flex justify-center">
        <appkit-button />
      </div>
    </div>
  );
}
