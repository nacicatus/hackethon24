import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {TaskService} from "../task.service";
import {LinkService} from "../link.service";
import {Task} from "../models/Task";
import {Link} from "../models/Link";


import "dhtmlx-gantt";
import {} from "@types/dhtmlxgantt";

declare let gantt: any;

@Component({
    selector: "gantt",
    styles: [
        `
        :host{
            display: block;
            height: 600px;
            position: relative;
            width: 100%;
        }
    `],
    providers: [TaskService, LinkService],
    template: "<div #gantt_here style='width: 100%; height: 100%;'></div>",
})
export class GanttComponent implements OnInit {
    @ViewChild("gantt_here") ganttContainer: ElementRef;

    constructor(private taskService: TaskService, private linkService: LinkService){}

    ngOnInit(){
        gantt.config.xml_date = "%Y-%m-%d %H:%i";

        gantt.config.columns = [
            {name:"text",       label:"FDC",  width:"*", tree:true },
            {name:"text",       label:"Team",  width:"*", tree:true },
            {name:"text",       label:"Feature",  width:"*", tree:true },
            {name:"start_date", label:"Start time", align: "left" },
            {name:"duration",   label:"Duration",   align: "left" },
            {name:"add",        label:"",           width:44 }
        ];


        gantt.init(this.ganttContainer.nativeElement);

        gantt.attachEvent("onAfterTaskAdd", function(id, item){
            this.taskService.insert(this.serializeTask(item))
              .then((response)=> {
                    if (response.id != id) {
                        gantt.changeTaskId(id, response.id);
                    }
                });
        });


        gantt.attachEvent("onAfterTaskUpdate", function(id, item){
            this.taskService.update(this.serializeTask(item));
        });

        gantt.attachEvent("onAfterTaskDelete", function(id){
            this.taskService.remove(id);
        });

        gantt.attachEvent("onAfterLinkAdd", function(id, item){
            this.linkService.insert(this.serializeLink(item))
                .then((response) => {
                    if(response.id != id){
                        gantt.changeLinkId(id, response.id);
                    }
                });
        });

        gantt.attachEvent("onAfterLinkUpdate", function(id, item){
            this.linkService.update(this.serializeLink(item));
        });

        gantt.attachEvent("onAfterLinkDelete", function(id){
            this.linkService.remove(id);
        });

        Promise.all([this.taskService.get(), this.linkService.get()])
            .then(([data, links]) => {
                gantt.parse({data, links});
            });
    }

    private serializeTask(data: any, insert: boolean = false): Task {
        return this.serializeItem(data, insert) as Task;
    }

    private serializeLink(data: any, insert: boolean = false): Link {
        return this.serializeItem(data, insert) as Link;
    }

    private serializeItem(data: any, insert: boolean = false): any {
        var result = {};

        for (let i in data) {
            if (i.charAt(0) == "$" || i.charAt(0) == "_") continue;
            if(insert && i == "id") continue;
            if (data[i] instanceof Date) {
                result[i] = gantt.templates.xml_format(data[i]);
            }
            else {
                result[i] = data[i];
            }
        }

        return result;
    }

}
