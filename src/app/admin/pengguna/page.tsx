import { UserManager } from "@/components/admin/users/user-manager";

export const metadata = { title: "Pengguna" };

/**
 * Console accounts. Owner-only.
 *
 * The sidebar hides this link from staff, but the page itself is a static file
 * anyone can open — so the guarantee is the API's: every `/users` route is
 * rejected with 403 for a non-owner, and this screen shows that as its error
 * state rather than pretending to be the gate.
 */
export default function AdminPenggunaPage() {
  return <UserManager />;
}
