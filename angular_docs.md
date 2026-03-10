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

## Observables

an Observable is a stream of events or data. They are often returned from Angular methods, such as the http.get and the myinputBox.valueChanges.

Subscribing "kicks off" the observable stream. Without a subscribe (or an async pipe) the stream won't start emitting values. It's similar to subscribing to a newspaper or magazine ... you won't start getting them until you subscribe.

The subscribe method takes in an observer. An observer has three methods:

    The method to process each time an item is emitted from the observable.

    The method to process any error that occurs.

    The method to clean up anything when the observer completes. This last one is seldom used when working with Angular's observables.
