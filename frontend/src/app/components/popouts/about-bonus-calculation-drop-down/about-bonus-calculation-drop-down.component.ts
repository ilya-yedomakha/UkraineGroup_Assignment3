import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-about-bonus-calculation-drop-down',
    templateUrl: './about-bonus-calculation-drop-down.component.html',
    styleUrls: ['./about-bonus-calculation-drop-down.component.css'],
    animations: [
        trigger('fadeToggle', [
            state('visible', style({ opacity: 1, height: '*' })),
            state('hidden', style({ opacity: 0, height: '0px', overflow: 'hidden' })),
            transition('hidden <=> visible', [
                animate('300ms ease-in-out')
            ])
        ])
    ]
})
export class AboutBonusCalculationDropDownComponent implements OnInit {

    isVisible = false;

    ngOnInit(): void {}

    toggleVisibility(): void {
        this.isVisible = !this.isVisible;
    }
}
