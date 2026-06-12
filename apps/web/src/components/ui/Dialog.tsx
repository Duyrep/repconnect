import * as RXDialog from "@radix-ui/react-dialog";
import Button from "./Button";
import { cn } from "@/utils";
import React from "react";

export function Dialog(props: RXDialog.DialogProps) {
  return <RXDialog.Root {...props} />;
}

export function DialogTrigger({
  children,
  ...props
}: RXDialog.DialogTriggerProps) {
  return (
    <RXDialog.Trigger {...props} asChild>
      <Button>{children}</Button>
    </RXDialog.Trigger>
  );
}

export function DialogPortal({ ...props }: RXDialog.DialogPortalProps) {
  return <RXDialog.Portal {...props} />;
}

export function DialogOverlay({ ...props }: RXDialog.DialogOverlayProps) {
  return <RXDialog.Overlay {...props} />;
}

export function DialogContent({
  children,
  className,
  ...props
}: RXDialog.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed overflow-auto top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm">
        <RXDialog.Content
          aria-describedby={undefined}
          className={cn("bg-surface-a10 rounded-md p-4", className)}
          {...props}
        >
          {children}
        </RXDialog.Content>
      </div>
    </DialogPortal>
  );
}

export function DialogTitle({
  className,
  ...props
}: RXDialog.DialogTitleProps) {
  return (
    <RXDialog.Title
      {...props}
      className={cn(
        className,
        "pb-2 text-center border-b border-surface-a30 text-xl font-bold",
      )}
    />
  );
}

export function DialogDescription({
  ...props
}: RXDialog.DialogDescriptionProps) {
  return <RXDialog.Description {...props} />;
}

export function DialogFooter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("pt-2 border-t border-surface-a30", className)}>
      {children}
    </div>
  );
}

export function DialogClose({ children, ...props }: RXDialog.DialogCloseProps) {
  return (
    <RXDialog.Close {...props} asChild>
      <Button className="bg-primary-a0 px-3 py-2 rounded-md">
        <b>Close</b>
      </Button>
    </RXDialog.Close>
  );
}
