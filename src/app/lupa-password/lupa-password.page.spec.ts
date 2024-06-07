import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LupaPasswordPage } from './lupa-password.page';

describe('LupaPasswordPage', () => {
  let component: LupaPasswordPage;
  let fixture: ComponentFixture<LupaPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LupaPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
