export enum UserRole {
  ADMIN = 'ADMIN',
  RESEARCHER = 'RESEARCHER',
  COLLABORATOR = 'COLLABORATOR',
  VIEWER = 'VIEWER',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date | string;
  lastLoginAt: Date | string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  preferences?: Record<string, unknown>;
}
