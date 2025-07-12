import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-card border rounded-lg p-4 animate-pulse">
          {/* Header skeleton */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-6 h-4 bg-muted rounded"></div>
                <div className="w-8 h-3 bg-muted rounded"></div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-6 h-4 bg-muted rounded"></div>
                <div className="w-10 h-3 bg-muted rounded"></div>
              </div>
            </div>
            <div className="w-12 h-4 bg-muted rounded"></div>
          </div>

          {/* Title skeleton */}
          <div className="space-y-2 mb-3">
            <div className="w-full h-5 bg-muted rounded"></div>
            <div className="w-3/4 h-5 bg-muted rounded"></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-3">
            <div className="w-full h-4 bg-muted rounded"></div>
            <div className="w-5/6 h-4 bg-muted rounded"></div>
            <div className="w-2/3 h-4 bg-muted rounded"></div>
          </div>

          {/* Tags skeleton */}
          <div className="flex space-x-2 mb-3">
            <div className="w-12 h-6 bg-muted rounded-md"></div>
            <div className="w-16 h-6 bg-muted rounded-md"></div>
            <div className="w-14 h-6 bg-muted rounded-md"></div>
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full"></div>
              <div className="space-y-1">
                <div className="w-16 h-3 bg-muted rounded"></div>
                <div className="w-12 h-3 bg-muted rounded"></div>
              </div>
            </div>
            <div className="w-12 h-3 bg-muted rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;