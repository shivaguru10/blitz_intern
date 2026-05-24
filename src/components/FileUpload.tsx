import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FileUpload() {
  return (
    <div className="space-y-2">
      <Label htmlFor="file">Optional file upload</Label>
      <Input id="file" name="file" type="file" />
      <p className="text-xs text-muted-foreground">For MVP, upload files to Drive and paste the public file URL.</p>
    </div>
  );
}
