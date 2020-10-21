import { WindowRef } from "./winref.service";
import { Component, Inject } from "@angular/core";
import Web3 from "web3";
import { WEB3 } from "./web3.tokens";
import { AppService } from "./app.service";
import { NgxSpinnerService } from "ngx-spinner";
const validatorsData = require("../assets/js/validators.json");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public currentBlock: any = {};
  public currentBlockNumber: string = "000,000,000";
  public validators = [];
  private interval: any;
  private cubeAnimTimeout: any;
  private winRef: WindowRef;
  renderer: any;

  constructor(
    private appService: AppService,
    @Inject(WEB3) private web3: Web3,
    private spinner: NgxSpinnerService,
    private w: WindowRef
  ) {
    this.winRef = w.nativeWindow;
    this.spinner.show();
  }
  showDetails(validator) {
    alert(JSON.stringify(validator));
  }
  ngOnInit() {
    this.retrieveValidator();
    this.web3.eth.getBlock("latest").then((block) => {
      this.currentBlock = block;
      this.currentBlockNumber = this.currentBlock.number
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });

    this.interval = setInterval(() => {
      this.web3.eth.getBlock("latest").then((block) => {
        if (this.currentBlock.number != block.number) {
          this.currentBlock = block;
          this.cubeAnimTimeout = setTimeout(() => {
            this.currentBlockNumber = this.currentBlock.number
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }, 3100);
          (this.winRef as any).currentBlock = this.currentBlock;
        }
      });
    }, 5000);

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  private retrieveValidator() {
    this.appService.retrieveValidators().then((data) => {
      this.validators = data;
      for (var i = 0; i < this.validators.length; i++) {
        this.validators[i]["index"] = i + 1;
      }
      (this.winRef as any).d3Data = setInterval(() => {
        if ((this.winRef as any).data2) {
          (this.winRef as any).data2 = (this.winRef as any).data2.map((q) => {
            let datum = data.find((qq) => qq.name === q.name);
            if (datum) return { ...q, address: datum.address };
            else return q;
          });
          (this.winRef as any).clearInterval((this.winRef as any).d3Data);
        }
      }, 3000);
    });
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
