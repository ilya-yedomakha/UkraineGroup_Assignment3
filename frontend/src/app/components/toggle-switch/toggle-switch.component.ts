import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.css']
})
export class ToggleSwitchComponent {
    @Input() toggleState: 'confirm' | 'none' | 'reject';
    @Output() stateChanged = new EventEmitter<'confirm' | 'none' | 'reject'>();

    setState(state: 'confirm' | 'none' | 'reject'): void {
        this.toggleState = state;
        this.stateChanged.emit(this.toggleState); // Emit the updated state
    }
}
