import { Component } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  
  isSidebarVisible = true;
  isSubmenuOpen = false;
  isDashboardSelected = false;


  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.sidebarService.toggleSidebar(); // Toggle sidebar state
  }


  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }


  selectDashboard() {
    this.isDashboardSelected = true;
  }

}
