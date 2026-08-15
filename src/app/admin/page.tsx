import { AdminConsole } from "@/components/admin/admin-console";

/**
 * Fleet management console.
 *
 * Statically exported like the rest of the site: this route ships an empty
 * shell that hydrates and then talks to the fleet API from the browser. That is
 * the supported pattern for `output: "export"` — see
 * `node_modules/next/dist/docs/01-app/02-guides/static-exports.md`.
 */
export default function AdminPage() {
  return <AdminConsole />;
}
