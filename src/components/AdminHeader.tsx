import { adminLogoutAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

export function AdminHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-5 py-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Blitz Admin</p>
        <h1 className="text-2xl font-black">{title}</h1>
      </div>
      <form action={adminLogoutAction}>
        <Button variant="outline" type="submit">Logout</Button>
      </form>
    </header>
  );
}
