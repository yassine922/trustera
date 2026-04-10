import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Accordion({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="accordion" className={className} {...props} />;
}

function AccordionItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="accordion-item" className={cn("border-b last:border-b-0", className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button data-slot="accordion-trigger"
      className={cn("flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline w-full text-left", className)}
      {...props}>
      {children}
      <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 transition-transform duration-200" />
    </button>
  );
}

function AccordionContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="accordion-content" className="overflow-hidden text-sm" {...props}>
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
