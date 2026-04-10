import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function AlertDialog({ children, ...props }: { children?: React.ReactNode; open?: boolean; onOpenChange?: (v: boolean) => void }) {
  return <>{children}</>;
}

function AlertDialogTrigger({ children, onClick }: { children?: React.ReactNode; onClick?: () => void }) {
  return <div onClick={onClick}>{children}</div>;
}

function AlertDialogPortal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function AlertDialogOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="alert-dialog-overlay" className={cn("fixed inset-0 z-50 bg-black/50", className)} {...props} />;
}

function AlertDialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <div data-slot="alert-dialog-content"
        className={cn("bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg", className)}
        {...props} />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="alert-dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 data-slot="alert-dialog-title" className={cn("text-lg font-semibold", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p data-slot="alert-dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function AlertDialogAction({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(buttonVariants(), className)} {...props} />;
}

function AlertDialogCancel({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(buttonVariants({ variant: "outline" }), className)} {...props} />;
}

export {
  AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger,
  AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle,
  AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
};
