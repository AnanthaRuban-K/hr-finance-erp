
// ...existing code...
export async function updateUserRole(userId: string, role: string, organizationId?: string) {
  try {
    const res = await fetch(`https://api.clerk.dev/v1/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY!}`,
      },
      body: JSON.stringify({
        public_metadata: {
          role,
          organizationId,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update user: ${res.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error };
  }
}
// ...existing code...