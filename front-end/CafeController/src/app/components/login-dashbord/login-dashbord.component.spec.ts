import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDashbordComponent } from './login-dashbord.component';

describe('LoginDashbordComponent', () => {
  let component: LoginDashbordComponent;
  let fixture: ComponentFixture<LoginDashbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginDashbordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginDashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
