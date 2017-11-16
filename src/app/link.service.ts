import { Injectable } from '@angular/core';
import {Link} from "./models/link";
import {Http} from "@angular/http";
// import {ExtractData, HandleError} from "./service-helper";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LinkService {
    get(): Promise<Link[]> {
        return Promise.resolve([
            {id: 1, source: 1, target: 2, type: "0"}
        ]);
    }
}
