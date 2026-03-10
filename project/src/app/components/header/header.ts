import { Component, ElementRef, HostListener } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, CollapseDirective, AsyncPipe],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
  public isCollapsed : boolean = true;

  constructor(
    private elementRef: ElementRef,
    public authService: AuthService,
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isCollapsed = true;
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isCollapsed = true;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isCollapsed = true;
        this.router.navigate(['/login']);
      }
    });
  }
}
