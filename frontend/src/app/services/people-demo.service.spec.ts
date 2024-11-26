import { TestBed } from '@angular/core/testing';

import { PeopleDemoService } from './people-demo.service';

describe('PeopleDemoService', () => {
    let service: PeopleDemoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PeopleDemoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
