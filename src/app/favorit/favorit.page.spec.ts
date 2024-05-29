import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritPage } from './favorit.page';

describe('FavoritPage', () => {
  let component: FavoritPage;
  let fixture: ComponentFixture<FavoritPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
