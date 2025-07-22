import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardHeader className="pb-2">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <Card>
    <CardContent className="p-0">
      <div className="animate-pulse">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="grid grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        {/* Rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="border-b border-gray-100 p-4">
            <div className="grid grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((col) => (
                <div key={col} className="h-4 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const HeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <div className="h-8 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
    </div>
  </div>
);

export const FiltersSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
    </CardContent>
  </Card>
);

export const ContractsPageSkeleton = () => (
  <div className="container mx-auto py-6 space-y-6">
    <HeaderSkeleton />
    <StatsSkeleton />
    <FiltersSkeleton />
    <TableSkeleton />
  </div>
);
