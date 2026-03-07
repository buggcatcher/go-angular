import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CollapseDirective } from 'ngx-bootstrap/collapse';

@Component({
    selector: 'app-header',
    imports: [RouterLink, CollapseDirective],
    templateUrl: './header.html',
    styleUrl: './header.css'
})
export class Header {
  public isCollapsed : boolean = true;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isCollapsed = true;
    }
  }
}
