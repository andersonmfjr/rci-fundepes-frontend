import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ExtractPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function ExtractPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ExtractPaginationProps) {
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex justify-center mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              {...(currentPage != 1 && {
                onClick: () => onPageChange(Math.max(1, currentPage - 1)),
              })}
              data-enabled={currentPage != 1}
              className="data=[enabled=false]=pointer-events-none data-[enabled=false]:opacity-50 data-[enabled=true]:cursor-pointer"
            >
              Anterior
            </PaginationPrevious>
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              {...(currentPage != totalPages &&
                !!totalPages && {
                onClick: () =>
                  onPageChange(Math.min(totalPages, currentPage + 1)),
              })}
              data-enabled={currentPage != totalPages && !!totalPages}
              className="data=[enabled=false]=pointer-events-none data-[enabled=false]:opacity-50 data-[enabled=true]:cursor-pointer"
            >
              Próxima
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
