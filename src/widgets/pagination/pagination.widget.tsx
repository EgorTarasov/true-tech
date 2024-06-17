import { observer } from "mobx-react-lite";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { FC } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationWidget: FC<Props> = observer(
  ({ currentPage, totalPages, onPageChange, className }) => {
    const renderPageNumbers = () => {
      const pages = [];

      // If there are less than or equal to 6 pages, show them all
      if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => onPageChange(i)} isActive={i === currentPage}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        if (currentPage > 1) {
          pages.push(
            <PaginationItem key={1}>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
          );
        }

        if (currentPage === 3) {
          pages.push(
            <PaginationItem key={2}>
              <PaginationLink onClick={() => onPageChange(2)}>2</PaginationLink>
            </PaginationItem>
          );
        }

        if (currentPage > 3) {
          pages.push(<PaginationEllipsis key="ellipsis1">...</PaginationEllipsis>);
        }

        pages.push(
          <PaginationItem key={currentPage}>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>
        );

        if (currentPage < totalPages - 1) {
          pages.push(<PaginationEllipsis key="ellipsis2">...</PaginationEllipsis>);
        }

        if (currentPage < totalPages) {
          pages.push(
            <PaginationItem key={totalPages}>
              <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
          );
        }
      }

      return pages;
    };

    return (
      <Pagination className={className}>
        <PaginationContent>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {renderPageNumbers()}
          <PaginationNext
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationContent>
      </Pagination>
    );
  }
);
