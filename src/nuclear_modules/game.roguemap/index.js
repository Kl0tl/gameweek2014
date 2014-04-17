'use strict';
var roguemap, Template, config, Map;

Template = require('./template');
Map = require('./map');
config = require('./config');

roguemap = nuclear.module('roguemap', []);

roguemap.component('map', function(entity, config){
  return new Map(config);
});

roguemap.component('rooms_manager', function(entity, data){
  return data;
});

roguemap.component('room', function(entity, data){
  var room = {};

  room.position = {
    x : data._x1,
    y : data._y1
  };

  room.width = data._x2-data._x1;
  room.height = data._y2-data._y1;
  room.size = room.width*room.height;

  return room;
});

roguemap.component('template', function(entity, data){
  var template = new Template(entity, data.position, data.width, data.height, data.config);

  return template;
});

roguemap.entity('room', function(entity, data){
  var room   = nuclear.component('room').add(entity, data),
      ranges = roguemap.config('ranges'),
      templates = roguemap.config('templates'),
      range, valid, u, template;
  for(var x in ranges){
    range = ranges[x];
    valid = false;
    for(u = range[0]; u < range[1]; u++){
      if(room.size === u){
        valid = true;
        template = templates[x];
        nuclear.component('template').add(entity, {
          config : template,
          width : room.width,
          height : room.height,
          position : room.position
        });
      }
    }
    if(valid){
      break;
    }
  }
});

roguemap.entity('map', function(entity, data){
  var map = nuclear.component('map from roguemap').add(entity, data.mapData);
  var digger = map.map;
  console.log(digger);
  var rooms = [];
  for(var i = 0; i < digger._rooms.length; i++){
    var room = digger._rooms[i];
    rooms.push(roguemap.entity('room').create(room));
    if(i === 0){
      map.start = {
        x : room._x1+1,
        y : room._y1+1
      };
    } else if(i === digger._rooms.length-1){
      map.end = {
        x : room._x1+1,
        y : room._y1+1
      };
    }
  }

  nuclear.component('rooms_manager from roguemap').add(entity, rooms);
});

roguemap.entity('tile', function(entity, data){
  var resolution = roguemap.config('resolution'),
      bundles = roguemap.config('bundles'),
      bundleName = roguemap.config('currentBundle'),
      currentBundle = bundles[bundleName];

  if(currentBundle && currentBundle[data.type]){
    var w, h, x, y, sprite, atlas;

    var frame = currentBundle[data.type][Math.round(Math.random()*(currentBundle[data.type].length-1))];
    var index = frame.index;
    w = frame.w || 1;
    h = frame.h || 1;
    x = frame.x || 0;
    y = frame.y || 0;

    nuclear.component('position from game.transform').add(entity, data.x*resolution+x, data.y*resolution+y);

    atlas = nuclear.component('atlas from game.rendering').add(entity, bundleName);

    sprite = nuclear.component('sprite from game.rendering').add(entity, {
        dest : frame.dest,
        anchorX : frame.aX || 0,
        anchorY : frame.aY || 0,
        frame : index,
        scale : 4,
        width : resolution*w,
        height : resolution*h,
        dynamic : true
    });

    nuclear.system('renderer from game.rendering').once(entity);

    nuclear.component('sprite').remove(entity);

    if(frame.collider){
      nuclear.component('velocity').add(entity);
      nuclear.component('rigidbody').add(entity, {
        mass : Infinity
      });
      nuclear.component('collider').add(entity, {
        width : frame.collider.w,
        height : frame.collider.h,
        offsetX : frame.collider.x,
        offsetY : frame.collider.y,
        mask : 'wall'
      });
      nuclear.component('camera-sensor').add(entity, ['collider', 'rigidbody', 'velocity']);
    }
    if(frame.occluder){
      nuclear.component('occluder').add(entity, [
        frame.occluder.x || 0, frame.occluder.y || 0,
        frame.occluder.w+(frame.occluder.x || 0), frame.occluder.y || 0,
        frame.occluder.w+(frame.occluder.x || 0),  frame.occluder.h+(frame.occluder.y || 0),
        frame.occluder.x || 0,  frame.occluder.h+(frame.occluder.y || 0)
      ]);
    }
  }
});

roguemap.component('slot', function(entity, data){
  var i, component, configs;
  if(data.data && data.data.atlas){
    nuclear.component('atlas').add(entity, data.data.atlas);
    nuclear.component('sprite').add(entity, {
      dest : data.data.sprite.dest,
      frame : data.data.sprite.frame[Math.round(Math.random()*(data.data.sprite.frame.length-1))],
      scale : data.data.sprite.scale,
      width : data.data.sprite.width,
      height : data.data.sprite.height,
      dynamic : data.data.sprite.dynamic,
    });
  }
  if(data.components){
    for(i = 0; i < data.components.length; i++){
      component = data.components[i];
      configs = data.data[component];

      component = nuclear.component(component);
      configs[0] = entity;
      component.add.apply(component, configs);
    }
  }
  console.log(data);
  for(i in data.entities){
    data.entities[i].x = nuclear.component('position').of(entity).x;
    data.entities[i].y = nuclear.component('position').of(entity).y;
    nuclear.entity(i).create(data.entities[i]);
  }
  return data;
});

roguemap.entity('slot', function(entity, data){
  var slots = roguemap.config('slots'),
      slot  = slots[data.type[Math.round(Math.random()*(data.type.length-1))]],
      resolution = roguemap.config('resolution');

  slot = {
    components : slot.components,
    data : slot.data,
    position : data.position,
    bundle : data.bundle,
    template : data.template,
    entities : slot.entities
  };

  nuclear.component('position').add(entity, data.position.x*resolution, data.position.y*resolution);
  nuclear.component('slot').add(entity, slot);
});

roguemap.config(config || {
  templates : {},
  ranges : {},
  slots : {},
  resolution : 20,
  bundles : {},
  currentBundle : 'stone'
});

module.exports = roguemap;
