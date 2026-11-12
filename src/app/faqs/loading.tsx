import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading FAQs"
      className="container-page py-10 lg:py-16"
    >
      <Skeleton className="mb-3 h-3 w-16" />
      <Skeleton className="mb-8 h-12 w-80 max-w-full lg:h-16" />
      <Skeleton className="mb-8 h-12 w-72 max-w-full rounded-xl" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
