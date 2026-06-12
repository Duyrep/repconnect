import { cn } from "@/utils";

export default function Input({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        "border border-surface-a30 rounded-md px-4 py-2 outline-none",
        className,
      )}
    />
  );
}
