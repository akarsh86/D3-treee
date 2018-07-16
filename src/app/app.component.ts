import {Component, OnInit} from '@angular/core';
import {TreeData} from './model/tree-data';
import {LoggingService} from './service/logging.service';
import {TreeService} from './service/tree.service';

import {D3Tree} from './d3-tree';

import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  private d3Tree: D3Tree = new D3Tree();
  public rootNode: TreeData = null;

  constructor(
    private log: LoggingService,
    private treeService: TreeService
  ) {
  }

  ngOnInit(): void {

    this.treeService.getTree().subscribe(
      data => {
        this.rootNode = data;

        this.log.log('Tree data:');
        this.log.log(this.rootNode);

        this.d3Tree.showTree(this.rootNode, '#d3data');
      }
    );

  }


}
