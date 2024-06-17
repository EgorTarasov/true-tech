import { makeAutoObservable } from "mobx";

export class PagedViewModel<T> {
  items: T[];
  pageSize: number;
  currentPage: number;
  loading = true;

  constructor(items: T[], pageSize: number = 10) {
    this.items = items;
    this.pageSize = pageSize;
    this.currentPage = 1;

    makeAutoObservable(this);
  }

  get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  get paginatedItems(): T[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.items.slice(start, end);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  }

  goToFirstPage(): void {
    this.currentPage = 1;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
  }

  updateItems(newItems: T[]): void {
    this.items = newItems;
    this.currentPage = 1;
  }
}
