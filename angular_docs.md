Services are reusable pieces of code that can be shared across your Angular application. They typically handle data fetching, business logic, or other functionality that multiple components need to access.

ng generate service CUSTOM_NAME

service example

// 📄 src/app/basic-data-store.ts
import {Injectable} from '@angular/core';
@Injectable({providedIn: 'root'})
export class BasicDataStore {
  private data: string[] = [];
  addData(item: string): void {
    this.data.push(item);
  }
  getData(): string[] {
    return [...this.data];
  }
}

Injecting a service
link

Once you've created a service with providedIn: 'root', you can inject it anywhere in your application using the inject() function from @angular/core.