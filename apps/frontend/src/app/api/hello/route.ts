// apps/frontend/src/app/api/hello/route.ts
export const dynamic = 'force-static';

export async function GET() {
  return Response.json({ message: 'Hello World' });
}