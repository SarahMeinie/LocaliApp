import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MBComponent } from './map-box.component';

describe('MBComponent', () => {
  let component: MBComponent;
  let fixture: ComponentFixture<MBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MBComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
