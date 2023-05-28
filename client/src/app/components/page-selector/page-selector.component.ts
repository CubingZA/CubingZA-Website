import { Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.less']
})
export class PageSelectorComponent {

  faEllipsis = faEllipsis;

  @Input() count: number = 0;
  @Input() page: number = 1;
  @Input() pageSize: number = 100;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  getPageCount(): number {
    return Math.ceil(this.count / this.pageSize);
  }

  isFirst(): boolean {
    return this.page === 1;
  }

  isLast(): boolean {
    return this.page === this.getPageCount();
  }

  shouldShowFirst(): boolean {
    return this.page > 3;
  }

  shouldShowLast(): boolean {
    return this.page < this.getPageCount() - 2;
  }

  getPagesToShow(): number[] {
    const start = this.page > 3 ? this.page - 2 : 1;
    const end = this.page < this.getPageCount() - 2 ? this.page + 2 : this.getPageCount();

    const pages: number[] = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  setPage(page: number): void {
    if (page < 1) {
      page = 1;
    } else if (page > this.getPageCount()) {
      page = this.getPageCount();
    }

    if (page !== this.page) {
      this.page = page;
      this.pageChange.emit(this.page);
    }
  }
}
