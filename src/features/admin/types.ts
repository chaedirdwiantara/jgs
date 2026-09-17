/**
 * The shapes the admin console exchanges with the API.
 *
 * These mirror the entities in `jgs-be` (`src/domain/**`). Keep the two in
 * step: a field renamed there is a field that silently arrives as `undefined`
 * here.
 */

export const applicationStatuses = ["baru", "diproses", "disetujui", "ditolak"] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const statusLabels: Record<ApplicationStatus, string> = {
  baru: "Baru",
  diproses: "Diproses",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

export type StatusCounts = Record<ApplicationStatus, number>;

/** The inbox row — deliberately narrow, so a page of 25 stays small. */
export type ApplicationSummary = {
  id: string;
  referenceCode: string;
  fullName: string;
  whatsapp: string;
  vehicleChoice: string;
  vehicleOther: string | null;
  withDriver: boolean;
  startDate: string;
  durationDays: number;
  status: ApplicationStatus;
  submittedAt: string;
};

export type ApplicationPage = {
  items: ApplicationSummary[];
  nextCursor: string | null;
};

/** A document as the console receives it: a signed URL, valid for minutes. */
export type ApplicationDocument = {
  slot: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  originalName: string;
};

export type ApplicationDetail = ApplicationSummary & {
  email: string;
  address: string;
  gsmNumber: string;
  emergencyNumber: string;
  purpose: string;
  usageLocation: string;
  startTime: string;
  referralSource: string;
  referralSourceOther: string | null;
  internalNote: string;
  documents: ApplicationDocument[];
  updatedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
};

export type ListApplicationsQuery = {
  status?: ApplicationStatus;
  limit?: number;
  cursor?: string;
};

export type UpdateApplicationInput = {
  status?: ApplicationStatus;
  internalNote?: string;
};

export const userRoles = ["owner", "staff"] as const;

export type UserRole = (typeof userRoles)[number];

export const roleLabels: Record<UserRole, string> = {
  owner: "Pemilik",
  staff: "Staf",
};

export const roleDescriptions: Record<UserRole, string> = {
  owner: "Akses penuh, termasuk mengelola pengguna dan menghapus pengajuan.",
  staff: "Mengelola pengajuan dan armada. Tidak dapat mengubah akun.",
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type CreateUserInput = {
  email: string;
  name: string;
  role: UserRole;
  password: string;
};

export type UpdateUserInput = {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  readAt: string | null;
};
