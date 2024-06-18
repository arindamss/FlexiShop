import { Component } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { jwtDecode } from 'jwt-decode';
import {MatListModule} from '@angular/material/list';
import { MenuItems } from '../../shared/menu-items';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { AccordionDirective } from '../../../directives/accordion.directive';
import { AccordionanchorDirective } from '../../../directives/accordionanchor.directive';
import { AccordionlinkDirective } from '../../../directives/accordionlink.directive';
// import {Accordion}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, CommonModule, RouterModule, AccordionDirective, AccordionanchorDirective, AccordionlinkDirective ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  providers:[MenuItems]
})
export class SidenavComponent {

  userRole:any;
  token:any=localStorage.getItem('token');
  tokenPayload:any;

  
  isSidebarVisible = true;
  isSubmenuOpen = false;
  isDashboardSelected = false;


  constructor(private sidebarService: SidebarService, public menuItems:MenuItems) {
    this.tokenPayload=jwtDecode(this.token);
    this.userRole=this.tokenPayload?.role
  }

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
