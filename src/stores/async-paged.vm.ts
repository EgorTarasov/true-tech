import { makeAutoObservable } from "mobx";

export class AsyncPagedViewModel<T> {
  items: T[] = [];
  pageSize: number;
  currentPage: number = 1;
  loading: boolean = true;
  fetchItems: (offset: number, limit: number) => Promise<T[]>;

  constructor(
    fetchItems: (offset: number, limit: number) => Promise<T[]>,
    pageSize: number = 50,
  ) {
    this.pageSize = pageSize;
    this.fetchItems = fetchItems;
    makeAutoObservable(this);
    this.loadPage(this.currentPage);
  }

  get totalPages(): number {
    // Total pages calculation needs an async total count fetch or needs to be computed differently.
    // Placeholder as an example, assuming we don't have total item count.
    return 99999999;
  }

  get paginatedItems(): T[] {
    return this.items;
  }

  async setPage(page: number): Promise<void> {
    if (page >= 1) {
      this.currentPage = page;
      await this.loadPage(page);
    }
  }

  async nextPage(): Promise<void> {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      await this.loadPage(this.currentPage);
    }
  }

  async prevPage(): Promise<void> {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      await this.loadPage(this.currentPage);
    }
  }

  async goToFirstPage(): Promise<void> {
    this.currentPage = 1;
    await this.loadPage(this.currentPage);
  }

  async goToLastPage(): Promise<void> {
    this.currentPage = this.totalPages;
    await this.loadPage(this.currentPage);
  }

  async updateItems(newItems: T[]): Promise<void> {
    this.items = newItems;
    this.currentPage = 1;
    await this.loadPage(this.currentPage);
  }

  private async loadPage(page: number): Promise<void> {
    this.loading = true;
    const offset = (page - 1) * this.pageSize;
    this.items = [];
    try {
      const items = await this.fetchItems(offset, this.pageSize);
      this.items = items;
    } finally {
      this.loading = false;
    }
  }
}
