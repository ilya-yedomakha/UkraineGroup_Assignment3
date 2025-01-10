import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reject-bonuses-calculation-window',
  templateUrl: './reject-bonuses-calculation-window.component.html',
  styleUrls: ['./reject-bonuses-calculation-window.component.css']
})
export class RejectBonusesCalculationWindowComponent implements OnInit{


  @Output() close  = new EventEmitter<boolean>();

  ngOnInit(): void {
    
  }

  toClose(){
    this.close.emit(true);
  }

}
