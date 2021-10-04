import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { OrderPositionInfo } from 'src/app/_model/_input/order-position-info';
import { ModuleService } from 'src/app/_services/module.service';
import { SearchService } from 'src/app/_services/search.service';
import { SharedService } from 'src/app/_services/shared.service';
import { StringService } from 'src/app/_services/string.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  private imSub: Subscription[] = new Array();
  private search$: Subject<string> = new Subject<string>();
  private currentScrollPosition: any;

  public isLoading: boolean = false;
  public searchString: string = '';
  public searchCompleted: boolean = false;
  public orderPositions: OrderPositionInfo[] = new Array();


  constructor(
    private router: Router,
    private searchService: SearchService,
    private stringService: StringService,
    private moduleService: ModuleService,
    private sharedService: SharedService
  ) {
    this.search$
      .pipe(
        debounceTime(500),
        switchMap(searchString => {
          this.isLoading = true;
          return this.searchService.getOrderPositions(searchString, this.orderPositions.length); 
        })
        ).subscribe(ops => {
          this.isLoading = false;
          if (ops.length == 0) {
            this.searchCompleted = true;
            return;
          }
          this.loadIms(ops);
          this.orderPositions.push(...ops);
          console.log(this.orderPositions);
        });
  }

  public ngOnInit(): void {
    this.search$.next('');
  }

  public ngAfterViewInit(): void {
    this.currentScrollPosition = window.pageYOffset;
  }

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  @HostListener("window:scroll", ['$event.target'])
  onContentScrolled(e: any) {
    let scroll = e.documentElement.scrollTop;
    if (scroll > this.currentScrollPosition)
      if (!this.isLoading)
        if (!this.searchCompleted)
          this.search$.next(this.searchString);

    this.currentScrollPosition = scroll;
  }

  public onSearhStringChange($event: string): void {
    this.searchCompleted = false;
    this.unsubscribe();
    this.orderPositions.length = 0;
    this.searchString = $event;
    this.search$.next($event);
  }

  public onPositionCreateBy(positionId: number): void {
    this.sharedService.OrderPositionId = positionId;
    this.router.navigate([`/order-positions/item/new`]);
  }

  private loadIms(orderPositions: OrderPositionInfo[]): void {
    orderPositions.forEach(op => {
      if (op.format.type.id == 1) {
        const sub = this.stringService.getString(op.id).subscribe(s => op.string = s);
        this.imSub.push(sub);
      } else if (op.format.type.id == 2) {
        const sub = this.moduleService.getSample(op.id).subscribe(m => op.module = m);
        this.imSub.push(sub);
      } else if (op.format.type.id == 26) {
        this.loadIms(op.childs);
      }
    })
  }

  private unsubscribe(): void {
    this.imSub.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    })
  }
}
