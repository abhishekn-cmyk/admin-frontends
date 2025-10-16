import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt=""
      className={cn("h-auto w-20 object-contain", className)}
    />
  );
}
