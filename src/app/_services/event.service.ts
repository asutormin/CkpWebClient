import {Injectable, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';

export enum EventType {
  AdvGraphics_Changed
}

export class EmitEvent {
  id: number;
  value: any;
  sender: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private behaviorSubject$: BehaviorSubject<EmitEvent> = new BehaviorSubject(new EmitEvent());

  emit(type: EventType, value: any, sender: any) {
    const emitEvent = new EmitEvent();
    emitEvent.id = type;
    emitEvent.value = value;
    emitEvent.sender = sender;
    this.behaviorSubject$.next(emitEvent);
  }

  on(event: EventType, subscriber: any): Observable<any> {
    return this.behaviorSubject$.pipe(
      filter((e: EmitEvent) => e.id === event && e.sender !== subscriber),
      map((e: EmitEvent) => e.value));
  }
}
