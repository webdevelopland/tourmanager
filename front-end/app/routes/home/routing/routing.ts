import { not, Arc } from "libraryjs"; //small third-party library with Dictionary and "existing check" function.

//To find shortest path was used Dijkstra's algorithm.
//https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm

export class Routing {
  towns:Array<any>; //All available towns
  path:any; //shortes way is saved here
  N:any = {}; //just lib to fast access to key of town
  fastMap:Array<Array<any>>; //map for fastest way
  cheapMap:Array<Array<any>>; //map for cheapest way
  load(res:any) { // <-- launch here
    this.saveDeals(res.deals);
    this.createPaths();
  }
  refresh() { //refresh vars after recent search
    this.createPaths();
  }

  saveDeals(deals) { //Save deals in vars
    this.createTowns(deals);
    this.createMaps(deals); 
  }
  createPaths() { //empty pattern for future path
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
  createTowns(deals) {
    //List of all towns
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
  }

  createMaps(deals) {
    var fullMap = this.iniMaps();
    fullMap = this.convertDealsIntoMap(deals, fullMap);
    this.sortMap(fullMap);
  }
  iniMaps() { //Let's create empty maps first
    this.fastMap = [];
    this.cheapMap = [];
    var fullMap = [];
    for(let i in this.towns) {      
      var fastRow = [];
      var cheapRow = [];
      var row = [];
      for(let j in this.towns) {
        //We add zeros in [x:x] cells, and undefined in everything else
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
      
      this.N[this.towns[i]] = i; //the lib. I told about it there from above
    }

    return fullMap;
  }
  convertDealsIntoMap(deals, fullMap) {
    // Important part. Data from json is converted in a map
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

    return fullMap;
  }
  sortMap(fullMap) {
    //When basic map has been created. We can sort it and create cheap map and fast map.
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

  //when "search" button is pushed. Оne of these functions starts
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
    // Ok. Now serios. It's the most main part of all app
    // The path is searched here
    this.path[from].size = 0; //Path at start has zero length
    var error = true; //If we won't able to find destination, error remain true

    //Oh oh! Recursive function!
    var open = (n) => {
      this.path[this.towns[n]].closed = true; //If we visited a town, no need to return
      var line = new Arc(); //Don't worry. It's just an associative array
      for(let j in map[n]) {
        //Let's see all branches of the graph
        if (this.path[this.towns[j]].closed) continue; //that's mean we already was here. No need to calc anymore
        if (not(map[n][j])) continue; //No branch. It's ok
        var cell = map[n][j];
        var current = this.path[this.towns[n]].size + handler(cell);
        //If new path has less size (price or duration) we choose it
        if (this.path[this.towns[j]].size === undefined || this.path[this.towns[j]].size > current) {
          this.path[this.towns[j]].size = current;
          this.path[this.towns[j]].cell = cell;
          this.path[this.towns[j]].from = n;
        }
        line.add(j, current);
      }
      //Choose most shortest
      line.sort((a, b) => {
        if (a.value < b.value) return -1;
        else if (a.value > b.value) return 1;
        else return 0;
      });
      for(let k of line.names) {
        if (k === this.N[to]) {
          //We found destination and shortest way. Cheers!
          error = false;
          return;
        }
        open(k); //Repeat!
        if (!error) return;
      }
    };
    open( this.N[from] );

    return this.buildFinalPath(to, error);
  }
  
  buildFinalPath(to, error) {
    if (error) {
      return {
        error: error
      };
    }
    
    //Let's run most shortest path and get the result
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