import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class SnackBarService {

    constructor(private snackBar: MatSnackBar) {
    }

    showSnackBar(message: string): void {
        const durationInSeconds = 5000;
        this.snackBar.open(message, 'Ok', {
            duration: durationInSeconds,
            panelClass: 'main-snackbar',
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }
}
