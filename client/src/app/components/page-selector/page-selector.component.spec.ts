import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSelectorComponent } from './page-selector.component';

describe('PageSelectorComponent', () => {
  let component: PageSelectorComponent;
  let fixture: ComponentFixture<PageSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageSelectorComponent]
    });
    fixture = TestBed.createComponent(PageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('isFirst', () => {
    it('should return true if the current page is the first page', () => {
      component.page = 1;
      expect(component.isFirst()).toBeTrue();
    });

    it('should return false if the current page is not the first page', () => {
      component.page = 2;
      expect(component.isFirst()).toBeFalse();
    });
  });

  describe('isLast', () => {
    it('should return true if there is only one page', () => {
      component.page = 1;
      component.count = 1;
      expect(component.isLast()).toBeTrue();
    });

    it('should return false if the current page is not the last page', () => {
      component.page = 1;
      component.count = 10;
      component.pageSize = 5;
      expect(component.isLast()).toBeFalse();
    });

    it('should return true if the current page is the last page', () => {
      component.page = 2;
      component.count = 10;
      component.pageSize = 5;
      expect(component.isLast()).toBeTrue();
    });
  });

  describe('shouldShowFirst', () => {
    it('should return false if the current page is the first page', () => {
      component.page = 1;
      expect(component.shouldShowFirst()).toBeFalse();
    });

    it('should return false if the current page is the third page', () => {
      component.page = 3;
      expect(component.shouldShowFirst()).toBeFalse();
    });

    it('should return true if the current page is the fourth page', () => {
      component.page = 4;
      expect(component.shouldShowFirst()).toBeTrue();
    });
  });

  describe('shouldShowLast', () => {
    it('should return false if there is only one page', () => {
      component.page = 1;
      component.count = 1;
      expect(component.shouldShowLast()).toBeFalse();
    });

    it('should return false if the current page is the last page', () => {
      component.page = 10;
      component.count = 20;
      component.pageSize = 2;
      expect(component.shouldShowLast()).toBeFalse();
    });

    it('should return false if the current page is the third last page', () => {
      component.page = 8;
      component.count = 20;
      component.pageSize = 2;
      expect(component.shouldShowLast()).toBeFalse();
    });

    it('should return true if the current page is the fourth last page', () => {
      component.page = 7;
      component.count = 20;
      component.pageSize = 2;
      expect(component.shouldShowLast()).toBeTrue();
    });
  });

  describe('getPagesToShow', () => {

    describe('when there are very few pages', () => {
      beforeEach(() => {
        component.count = 4;
        component.pageSize = 2;
      });

      it('should return all pages if on the first page', () => {
        component.page = 1;
        expect(component.getPagesToShow()).toEqual([1, 2]);
      });

      it('should return all pages if on the last page', () => {
        component.page = 2;
        expect(component.getPagesToShow()).toEqual([1, 2]);
      });
    });
  });

  describe('when there are a few pages', () => {
    beforeEach(() => {
      component.count = 8;
      component.pageSize = 2;
    });

    it('should return the first 3 pages if on the first page', () => {
      component.page = 1;
      expect(component.getPagesToShow()).toEqual([1, 2, 3]);
    });

    it('should return the last 3 pages if on the last page', () => {
      component.page = 4;
      expect(component.getPagesToShow()).toEqual([2, 3, 4]);
    });

    it('should return all pages if in the middle', () => {
      component.page = 2;
      expect(component.getPagesToShow()).toEqual([1, 2, 3, 4]);
    });
  });

  describe('when there are plenty of pages', () => {
    beforeEach(() => {
      component.count = 20;
      component.pageSize = 2;
    });

    it('should return the first 3 pages if on the first page', () => {
      component.page = 1;
      expect(component.getPagesToShow()).toEqual([1, 2, 3]);
    });

    it('should return the first 5 pages if on the third page', () => {
      component.page = 3;
      expect(component.getPagesToShow()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return the last 3 pages if on the last page', () => {
      component.page = 10;
      expect(component.getPagesToShow()).toEqual([8, 9, 10]);
    });

    it('should return the last 5 pages if on the third last page', () => {
      component.page = 8;
      expect(component.getPagesToShow()).toEqual([6, 7, 8, 9, 10]);
    });

    it('should return the 5 pages centred on the current page if in the middle', () => {
      component.page = 5;
      expect(component.getPagesToShow()).toEqual([3, 4, 5, 6, 7]);
    });
  });

  describe('setPage', () => {
    beforeEach(() => {
      component.count = 10;
      component.pageSize = 2;
    });

    it('should emit the page change event', () => {
      spyOn(component.pageChange, 'emit');
      component.setPage(2);
      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });

    it('should not emit the page change event if the page is the same', () => {
      spyOn(component.pageChange, 'emit');
      component.page = 1;
      component.setPage(1);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should go to the first page if the page is less than 1', () => {
      spyOn(component.pageChange, 'emit');
      component.page = 2;
      component.setPage(-1);
      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });

    it('should go to the last page if the page is greater than the last page', () => {
      spyOn(component.pageChange, 'emit');
      component.setPage(6);
      expect(component.pageChange.emit).toHaveBeenCalledWith(5);
    });

  });
});
