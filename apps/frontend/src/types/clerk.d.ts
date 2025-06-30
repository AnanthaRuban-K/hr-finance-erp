declare module '@clerk/nextjs' {
  export interface UserPublicMetadata {
    role?: 'admin' | 'hr_manager' | 'finance_manager' | 'supervisor' | 'employee';
    organizationId?: string;
  }
}