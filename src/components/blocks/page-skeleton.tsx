import { Skeleton } from "@/components/ui/skeleton";

/** Matches the real page rhythm: hero (text + photo), then card sections. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page">
      <section className="py-7 lg:py-[72px]">
        <div className="container-page grid gap-[18px] lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-[18px]">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-24 w-full max-w-xl lg:h-36" />
            <Skeleton className="h-16 w-full max-w-[520px]" />
            <div className="flex gap-3">
              <Skeleton className="h-[50px] flex-1 rounded-[10px] lg:h-[54px] lg:w-48 lg:flex-none" />
              <Skeleton className="h-[50px] flex-1 rounded-[10px] lg:h-[54px] lg:w-40 lg:flex-none" />
            </div>
          </div>
          <Skeleton className="h-[300px] rounded-2xl lg:h-[480px]" />
        </div>
      </section>
      {[0, 1].map((i) => (
        <section
          key={i}
          className={
            i ? "bg-off-white py-10 lg:py-[88px]" : "py-10 lg:py-[88px]"
          }
        >
          <div className="container-page flex flex-col gap-6 lg:gap-10">
            <Skeleton className="h-8 w-72 lg:h-10" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {[0, 1, 2].map((n) => (
                <Skeleton key={n} className="h-32 rounded-xl lg:h-48" />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
