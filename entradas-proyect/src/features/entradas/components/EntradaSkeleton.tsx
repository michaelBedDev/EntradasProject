import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EntradaSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="w-full">
        <div className="w-full h-64">
          <Skeleton className="h-full w-full" />
        </div>
        <CardHeader className="px-5 py-4">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-6 w-1/3 mt-3" />
        </CardContent>
        <CardFooter className="flex justify-between gap-3 px-5 py-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </CardFooter>
      </div>
    </Card>
  );
}
