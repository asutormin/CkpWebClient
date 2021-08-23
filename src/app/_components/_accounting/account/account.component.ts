import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from '../../../_services/account.service';
import { AccountInfo } from '../../../_model/_input/account-info';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public account$: Observable<AccountInfo>;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountService
  ) { }

  ngOnInit() {
    this.account$ = this.route.params
      .pipe(switchMap((params: Params) => {
        return this.accountsService.get(params.id);
      }));
  }

  public onDownload() {
    this.account$.subscribe(account => {
      this.accountsService.download(account.id).subscribe(x => {
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        const newBlob = new Blob([x], { type: 'application/vnd.openxmlformats' });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);

        const link = document.createElement('a');
        link.href = data;
        link.download = `Счёт (с печатью)_${account.number}.docx`;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout(() => {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);

      });
    });
  }
}
