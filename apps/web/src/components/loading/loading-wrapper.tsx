import { Suspense } from "react";

interface LoadingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LoadingWrapper({
  children,
  fallback,
}: LoadingWrapperProps) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}
