
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-full bg-muted rounded animate-pulse" />
      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
      {/* Add more skeleton elements as needed */}
    </div>
  );
}

export default function AdminLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 space-y-2">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      </div>
      <DashboardSkeleton />
    </div>
  );
}