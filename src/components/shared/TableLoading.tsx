import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

export default function TableLoading() {
  return (
    <>
      <Skeleton className="mt-5 h-10" />
      {[1, 2, 3, 4, 5].map((t) => (
        <div className="space-y-3" key={t}>
          <Separator />
          <Separator />
          <Skeleton className="mt-5 h-8" />
        </div>
      ))}
    </>
  );
}
