'use strict';
var ROT;

require('./lib/rot');
ROT = window.ROT;

function Map(config){
  config.progress = config.progress || function(){};
  var data = [],
      height = config.height,
      digger = new ROT.Map.Digger(config.width, height, {
        roomHeight : config.roomHeight,
        roomWidth : config.roomWidth,
      });

  digger.create(function mapProgress(x, y, value){
    data.push(value);
    config.progress(x, y, value);
  });

  var walls, grounds, tiles;

  walls = [];
  grounds = [];
  tiles = [];
  checkWalls(data, tiles, grounds, walls, height);

  this.tiles = tiles;
  this.grounds = grounds;
  this.walls = walls;
  this.data = data;
  this.map = digger;
}

function checkWalls(data, tiles, grounds, walls, height){
  var i, index, type, wall;

  for(i = 0; i < data.length; i++){
    index = data[i];
    wall = {
      x : Math.floor(i / height),
      y : i % height
    };
    if(index === 0){
      wall.type = 'ground';
      grounds.push(wall);
      tiles.push(nuclear.entity('tile').create(wall));
    } else if(index === 1){
      if(testUpperLeft(data, i, height)){
        wall.type = 'upperLeft';
        walls.push(wall);
        tiles.push(nuclear.entity('tile').create(wall));
        data[i] = 2;
      }
      else if(testUpperRight(data, i, height)){
        wall.type = 'upperRight';
        walls.push(wall);
        tiles.push(nuclear.entity('tile').create(wall));
        data[i] = 2;
      }
      else if(testDownLeft(data, i, height)){
        wall.type = 'downLeft';
        walls.push(wall);
        tiles.push(nuclear.entity('tile').create(wall));
        data[i] = 2;
      }
      else if(testDownRight(data, i, height)){
        wall.type = 'downRight';
        walls.push(wall);
        tiles.push(nuclear.entity('tile').create(wall));
        data[i] = 2;
      }
      else{
        type = testWall(data, i, height);
        if(type){
          wall.type = type;
          walls.push(wall);
          tiles.push(nuclear.entity('tile').create(wall));
          data[i] = 2;
        }
      }
    }
  }
}

function testWall(data, i, height){
  if(data[i+1] === 0){
    return 'left';
  } else if(data[i-1] === 0){
    return 'right';
  } else if(data[i+height] === 0){
    return 'up';
  } else if(data[i-height] === 0){
    return 'down';
  }

  return false;
}

function testUpperLeft(data, i, height){
  return(data[i+1] !== 0 && data[i-1] === 0 && data[i+height] !== 0 && data[i-height] === 0);
}

function testUpperRight(data, i, height){
  return(data[i+1] === 0 && data[i-1] !== 0 && data[i+height] !== 0 && data[i-height] === 0);
}

function testDownLeft(data, i, height){
  return(data[i+1] !== 0 && data[i-1] === 0 && data[i+height] === 0 && data[i-height] !== 0);
}

function testDownRight(data, i, height){
  return(data[i+1] === 0 && data[i-1] !== 0 && data[i+height] === 0 && data[i-height] !== 0);
}

module.exports = Map;
