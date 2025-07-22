import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const HeaderSkeleton = () => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-0">
    <div>
      <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
    </div>
  </div>
);

export const ContractInfoSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Status and Validation */}
      <div className="flex flex-wrap gap-4">
        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

export const AddendumsSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const RciDistributionSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-72 animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="text-center p-4 border border-gray-200 rounded-lg"
            >
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          {[1, 2, 3].map((row) => (
            <div key={row} className="border-b border-gray-100 p-4">
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((col) => (
                  <div
                    key={col}
                    className="h-4 bg-gray-100 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const BankTransfersSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="text-center p-4 border border-gray-200 rounded-lg"
            >
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200 p-4">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          {[1, 2, 3].map((row) => (
            <div key={row} className="border-b border-gray-100 p-4">
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((col) => (
                  <div
                    key={col}
                    className="h-4 bg-gray-100 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const BackButtonSkeleton = () => (
  <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
);

export const ContractDetailPageSkeleton = () => (
  <div className="space-y-4 lg:space-y-6">
    <BackButtonSkeleton />
    <HeaderSkeleton />
    <ContractInfoSkeleton />
    <AddendumsSkeleton />
    <RciDistributionSkeleton />
    <BankTransfersSkeleton />
  </div>
);
