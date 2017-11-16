import { Injectable } from '@angular/core';
import {Task} from "./models/task";
import {Http} from "@angular/http";
// import {ExtractData, HandleError} from "./service-helper";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class TaskService {
    get(): Promise<Task[]>{
        return Promise.resolve([
            {id: 1, text: "Task #1", start_date: "2017-04-15 00:00", duration: 3, progress: 0.6},
            {id: 2, text: "Task #2", start_date: "2017-04-18 00:00", duration: 3, progress: 0.4}
        ]);
    }
}