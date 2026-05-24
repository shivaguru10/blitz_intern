"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { submitWorkAction, type ActionState } from "@/app/actions/student";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/FileUpload";
import type { Task } from "@/lib/types";

const initialState: ActionState = { ok: false, message: "" };

export function SubmitWorkModal({ task, disabled }: { task: Task; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(submitWorkAction, initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      setOpen(false);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" disabled={disabled}>
          Submit Work
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        <form action={(formData) => startTransition(() => formAction(formData))} className="grid gap-4">
          <input type="hidden" name="taskId" value={task.id} />
          {!task.is_mandatory ? (
            <>
              <Field label="GitHub repository URL" name="githubUrl" placeholder="https://github.com/..." />
              <Field label="Live project URL" name="liveUrl" placeholder="https://..." />
            </>
          ) : null}
          <Field
            label={task.is_mandatory || task.is_final_task ? "LinkedIn post URL" : "LinkedIn post URL"}
            name="linkedinUrl"
            placeholder="https://www.linkedin.com/posts/..."
            required={task.is_mandatory || task.is_final_task}
          />
          <Field label="Google Drive / file URL" name="driveUrl" placeholder="https://drive.google.com/..." />
          <div className="space-y-2">
            <Label htmlFor={`notes-${task.id}`}>Notes</Label>
            <Textarea id={`notes-${task.id}`} name="notes" placeholder="Add context for the reviewer" />
          </div>
          <FileUpload />
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, name, placeholder, required }: { label: string; name: string; placeholder: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="url" placeholder={placeholder} required={required} />
    </div>
  );
}
