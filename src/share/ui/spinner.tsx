import { LoaderIcon } from "lucide-react";

import { cn } from "@/share/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export function SpinnerCustom({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center h-full py-24", className)}
    >
      <Spinner />
    </div>
  );
}
