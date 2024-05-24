import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataBukuPage } from './data-buku.page';

describe('DataBukuPage', () => {
  let component: DataBukuPage;
  let fixture: ComponentFixture<DataBukuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DataBukuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
