export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR";
    message: string;
    details: Record<string, string[]>;
  };
}

// user auth models

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt?: string;
}
export interface AuthSession {
  user: User;
  token: string;
}

// ==========================================
export type Role = "OWNER" | "ADMIN" | "MEMBER";

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  createdAt: string;
  user: User;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  createdAt: string;
  members?: OrganizationMember[];
  currentUserRole?: Role;
  userRole?: Role;
  role?: Role;
}

export interface OrganizationInvite {
  id: string;
  email: string;
  organizationId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  token: string;
  expiresAt: string;
  createdAt: string;
}

// ==========================================
// 4. Board, Section, Issue & Comment Models
// ==========================================
export interface Comment {
  id: string;
  content: string;
  issueId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface IssueAssignee {
  id: string;
  issueId: string;
  userId: string;
  user: User;
}

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  order: number;
  dueDate: string | null;
  sectionId: string;
  createdAt: string;
  updatedAt: string;
  assignees: IssueAssignee[];
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface Section {
  id: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  issues: Issue[];
}

export interface Board {
  id: string;
  title: string;
  backgroundColor: string;
  isClosed: boolean;
  organizationId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  creator?: User;
  sections?: Section[];
}