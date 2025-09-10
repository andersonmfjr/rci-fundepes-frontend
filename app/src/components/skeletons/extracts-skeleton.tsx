import { Card, CardContent } from "../ui/card";

export function ExtractsFilterSkeleton() {
  return (
    <fieldset className="border rounded-md pb-5 pt-1 px-4">
      <legend className="font-bold mb-2 text-lg">Filtros</legend>
      <div className="flex gap-4  lg:gap-10 flex-col lg:flex-row">
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
      </div>
    </fieldset>
  );
}

export function ExtractsTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="animate-pulse">
          <div className="border-b border-gray-200 p-4">
            <div className="grid grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
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
}

export function ExtractDetailsSkeleton() {
  return (
    <div>
      <div className="flex-col flex gap-4">
        <div className="space-y-1 max-w-56">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
        </div>
        <div className="space-y-1 max-w-56">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
        </div>
        <div className="space-y-1 max-w-56">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
        </div>
        <div className="space-y-1 max-w-56">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
      <hr className="my-3" />
      <h2 className="bg-gray-200 animate-pulse h-8 mb-4 rounded max-w-56" />
      <Card>
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="border-b border-gray-200 p-4">
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="border-b border-gray-100 p-4">
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((col) => (
                    <div key={col} className="h-4 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
