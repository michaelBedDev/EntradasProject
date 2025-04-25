import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-screen flex flex-row-reverse items-center justify-center">
      <h1 className="text-4xl font-bold">
        Welcome to Entradas Proyect
        <Button className="ml-4 ">Get Started</Button>
      </h1>
    </div>
  );
}
