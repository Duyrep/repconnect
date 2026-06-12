import { cn } from "@/utils";

export default function Button({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return <button className={cn("cursor-pointer", className)} {...props} />;
}
