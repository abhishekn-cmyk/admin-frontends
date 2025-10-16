"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav role="navigation" aria-label="pagination" className={cn("flex items-center justify-center space-x-2", className)}>
      {children}
    </nav>
  );
}

export function PaginationContent({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center space-x-2">{children}</div>;
}

export function PaginationItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function PaginationPrevious({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-1 rounded-md border text-sm hover:bg-gray-100",
        className
      )}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Previous
    </button>
  );
}

export function PaginationNext({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center px-3 py-1 rounded-md border text-sm hover:bg-gray-100",
        className
      )}
    >
      Next
      <ChevronRight className="h-4 w-4 ml-1" />
    </button>
  );
}
