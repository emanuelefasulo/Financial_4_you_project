import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,

  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  activeIndex: number = 1;
  isTargetPage = false;
  footerInfos: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setActiveItem();
    this.http.get<any>('https://datausa.io/api/data?drilldowns=Nation&measures=Population').subscribe({
      next: data => {
        if (data && Array.isArray(data.data)) {
          this.footerInfos = data.data.map((item: any) =>
            `${item.Nation}: Popolazione ${item.Population} (${item.Year})`
          );
        } else {
          this.footerInfos = ['Nessun dato disponibile'];
        }
      },
      error: err => {
        this.footerInfos = ['Errore nel recupero dati'];
        console.error(err);
      }
    });
    
  }

  setActiveItem(): void {
    const path = window.location.pathname.split('/').pop() || 'home';
    switch (path) {
      case 'dashboard':
        this.activeIndex = 0;
        break;
      case 'home':
        this.activeIndex = 1;
        break;
      case 'components':
        this.activeIndex = 2;
        break;
      case 'calendar':
        this.activeIndex = 3;
        break;
      case 'charts':
        this.activeIndex = 4;
        break;
      case 'documents':
        this.activeIndex = 5;
        break;
      default:
        this.activeIndex = 1;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setActiveItem();
  }
}
