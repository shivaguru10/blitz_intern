"use client";

import { Button } from "@/components/ui/button";

export function ConfirmDialog({ label, onConfirm }: { label: string; onConfirm: () => void }) {
  return (
    <Button
      type="button"
      variant="destructive"
      onClick={() => {
        if (window.confirm("Are you sure?")) onConfirm();
      }}
    >
      {label}
    </Button>
  );
}
