import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CountUp } from 'countup.js';
import * as echarts from 'echarts';
import { Subscription } from 'rxjs';
import { PaymentService } from 'src/app/_services/payment.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {
  private bSub: Subscription;
  private totalBalance: number;
  private totalBalanceCountUp: CountUp;
  private rdvBalance: number;
  private rdvBalanceCountUp: CountUp;
  private ckpBalance: number;
  private ckpBalanceCountUp: CountUp;

  public myChart: echarts.ECharts;
  public option = {
    tooltip: {
      trigger: 'item',
      show: true,
      showContent: true
    },
    legend: {
      show: false
    },
    color: [
      "#9fdbe6",
      "#36a4e2"
    ],
    series: [
      {
        name: 'Баланс',
        type: 'pie',
        radius: ['60%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        stillShowZeroSum: false,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: null,
        height: null,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: '16',
            fontWeight: 'normal'
          }
        },
        labelLine: {
          show: false
        },
        data: [
        ]
      }
    ]
  };

  public get TotalBalance(): number {
    return this.totalBalance ? this.totalBalance : 0;
  }

  public set TotalBalance(value: number) {
    if (this.totalBalance !== value) {
      this.totalBalance = value;
      this.totalBalanceCountUp && this.totalBalanceCountUp.update(value);
    }
  }

  public get RdvBalance(): number {
    return this.rdvBalance ? this.rdvBalance : 0;
  }

  public set RdvBalance(value: number) {
    if (this.rdvBalance !== value) {
      this.rdvBalance = value;
      this.rdvBalanceCountUp && this.rdvBalanceCountUp.update(value);
    }
  }

  public get CkpBalance(): number {
    return this.ckpBalance ? this.ckpBalance : 0;
  }

  public set CkpBalance(value: number) {
    if (this.ckpBalance !== value) {
      this.ckpBalance = value;
      this.ckpBalanceCountUp && this.ckpBalanceCountUp.update(value);
    }
  }

  constructor(
    private paymentService: PaymentService) {

    this.refreshBalances();
    setInterval(() => this.refreshBalances(), 60000);
  }

  public ngOnInit(): void {

    let chartDom = document.getElementById('chart');
    if (chartDom) {
      this.myChart = echarts.init(chartDom);
    }

    this.totalBalanceCountUp = new CountUp('total-balance', 0);
    if (!this.totalBalanceCountUp.error) {
      this.totalBalanceCountUp.options.separator = ' ';
      this.totalBalanceCountUp.options.decimal = ',';
      this.totalBalanceCountUp.options.prefix = ' ';
      this.totalBalanceCountUp.start();
    } else {
      console.error(this.totalBalanceCountUp.error);
    }

    this.rdvBalanceCountUp = new CountUp('rdv-balance', 0);
    if (!this.rdvBalanceCountUp.error) {
      this.rdvBalanceCountUp.options.separator = ' ';
      this.rdvBalanceCountUp.options.decimal = ',';
      this.rdvBalanceCountUp.options.prefix = ' ';
      this.rdvBalanceCountUp.start();
    } else {
      console.error(this.rdvBalanceCountUp.error);
    }

    this.ckpBalanceCountUp = new CountUp('ckp-balance', 0);
    if (!this.ckpBalanceCountUp.error) {
      this.ckpBalanceCountUp.options.separator = ' ';
      this.ckpBalanceCountUp.options.decimal = ',';
      this.ckpBalanceCountUp.options.prefix = ' ';
      this.ckpBalanceCountUp.start();
    } else {
      console.error(this.ckpBalanceCountUp.error);
    }
  }

  public ngOnDestroy(): void {
    if (this.bSub) {
      this.bSub.unsubscribe();
    }
  }

  public refreshBalances(): void {
    this.bSub = this.paymentService.getBalances().subscribe(
      balances => {
        const sortedBalances = balances.sort((a, b) => a.supplierLegalPersonName < b.supplierLegalPersonName ? -1 : 1);
        
        this.TotalBalance = sortedBalances.reduce((a, b) => a + b.balanceSum, 0);
        this.RdvBalance = sortedBalances[0].balanceSum;
        this.CkpBalance = sortedBalances[1].balanceSum;

        for (let i in sortedBalances) {
          const balance = sortedBalances[i]
          this.option.series[0].data[i] = {
            name: balance.supplierLegalPersonName,
            value: balance.balanceSum
          }
        }

        this.option && this.myChart.setOption(this.option);
  });
}

}
