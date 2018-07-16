import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';

import {InMemoryDbService} from 'angular-in-memory-web-api';
import {TreeData} from '../model/tree-data';


const tree: TreeData = {
  name: 'root',
  children: [
    {
      name: 'dept1',
      children: [
        {name: 'dept1group1'},
        {name: 'dept1group2'},
        {
          name: 'dept1grp3',
          children: [
            {name: 'dept1grp3.1'},
            {name: 'dept1grp3.2'},
            {name: 'dept1grp3.3'}
          ]
        }
      ]
    },
    {
      name: 'dept2',
      children: [
        {name: 'dept2grp1'},
        {name: 'dept2grp2'},
        {
          name: 'dept2grp3',
          children: [
            {name: 'dept2grp3.1'},
            {name: 'dept2grp3.2'},
            {name: 'dept2grp3.3'}
          ]
        }
      ]
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() {
  }

  createDb() {
    return {tree};
  }
}
