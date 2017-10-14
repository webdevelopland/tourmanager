import { not, Arc } from "libraryjs";

export class Routing {
  deals:any;
  towns:Array<any>;
  path:any;
  N:any = {};
  fastMap:Array<Array<any>>;
  cheapMap:Array<Array<any>>;
  load(res:any) {
    this.createPaths();
    this.createMaps(res.deals);
  }
  refresh() {
    this.createPaths();
  }
  createPaths() {
    this.path = {};
    for(let i in this.towns) {
      this.path[this.towns[i]] = {
        size: undefined,
        cell: undefined,
        closed: false,
        from: undefined
      };
    }
  }
  createMaps(deals) {
    var towns = [];
    var add = (arr:Array<any>, value:any) => {
      const i = arr.indexOf(value);
      if (i === -1) arr.push(value);
      return; 
    }
    for(let deal of deals) {
      add(towns, deal.departure);
      add(towns, deal.arrival);
    }
    this.towns = towns;

    this.fastMap = [];
    this.cheapMap = [];
    var fullMap = [];
    for(let i in this.towns) {      
      var fastRow = [];
      var cheapRow = [];
      var row = [];
      for(let j in this.towns) {
        if (i===j) {
          fastRow.push(0);
          cheapRow.push(0);
          row.push(0);
          continue;
        }
        fastRow.push(undefined);
        cheapRow.push(undefined);
        row.push([]);
      }
      this.fastMap.push(fastRow);
      this.cheapMap.push(cheapRow);
      fullMap.push(row);
      
      this.N[this.towns[i]] = i;
    }
    
    for(let deal of deals) {
      var i = this.N[deal.arrival];
      var j = this.N[deal.departure];
      if (i === j) continue;
      fullMap[i][j].push({
        price: deal.cost*(1 - deal.discount/100),
        min: parseInt(deal.duration.h)*60 + parseInt(deal.duration.m),
        from: deal.arrival,
        to: deal.departure,
        code: deal.reference,
        transport: deal.transport
      });
    }
    

    for(let i in fullMap) {
      for(let j in fullMap[i]) {
        if (i === j) continue;

        if (fullMap[i][j].length === 0) continue;
        var cheapCell = fullMap[i][j].slice();
        var fastCell = fullMap[i][j].slice();

        cheapCell.sort((a, b) => {
          if (a.price < b.price) return -1;
          else if (a.price > b.price) return 1;
          else return 0;
        });
        this.cheapMap[i][j] = cheapCell[0];

        
        fastCell.sort((a, b) => {
          if (a.min < b.min) return -1;
          else if (a.min > b.min) return 1;
          else return 0;
        });
        this.fastMap[i][j] = fastCell[0];
      }
    }
  }

  cheapStart(from, to) {
    return this.start(from, to, this.cheapMap, (cell) => {
      return cell.price;
    });
  }
  fastStart(from, to) {
    return this.start(from, to, this.fastMap, (cell) => {
      return cell.min;
    });
  }
  private start(from, to, map, handler) {
    this.path[from].size = 0;

    var error = true;
    var open = (n) => {
      this.path[this.towns[n]].closed = true;

      var line = new Arc();
      for(let j in map[n]) {
        if (this.path[this.towns[j]].closed) continue;
        if (not(map[n][j])) continue;

        var cell = map[n][j];
        var current = this.path[this.towns[n]].size + handler(cell);

        if (this.path[this.towns[j]].size === undefined || this.path[this.towns[j]].size > current) {
          this.path[this.towns[j]].size = current;
          this.path[this.towns[j]].cell = cell;
          this.path[this.towns[j]].from = n;
        }

        line.add(j, current.default);
      }
      line.sort((a, b) => {
        if (a.value < b.value) return -1;
        else if (a.value > b.value) return 1;
        else return 0;
      });
      for(let k of line.names) {
        if (k === this.N[to]) {
          error = false;
          return;
        }
        open(k);
        if (!error) return;
      }
    };
    open( this.N[from] );

    error = false;
    if (error) {
      return {
        error: error
      };
    }
    
    var route = [];
    var price = 0;
    var min = 0;
    var A, B = to;
    for(let i=0; i<this.towns.length*this.towns.length; i++) {
      A = this.towns[this.path[B].from];
      
      
      if (not(A)) break;
      var cell = this.path[B].cell;
      price += cell.price;
      min += cell.min;
      route.push(cell);

      B = A;
    }

    return {
      error: error,
      min: min,
      price: price,
      route: route
    };
  }
}