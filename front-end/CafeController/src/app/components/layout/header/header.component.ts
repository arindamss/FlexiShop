import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbar, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private sidebarService: SidebarService) {}

  toggleSidebar() {
  // Check if the button click event is registered
    this.sidebarService.toggleSidebar();
    console.log("I am clicked");
    
    // Check if the visibility state is changing
  }

}
