import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtfChartComponent } from './etf-chart.component';

describe('EtfChartComponent', () => {
  let component: EtfChartComponent;
  let fixture: ComponentFixture<EtfChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtfChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EtfChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
