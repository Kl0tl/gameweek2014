'use strict';

var context;

context = nuclear.system.context();
context.buffers = [];

context.dests = [
  document.getElementById('main').getContext('2d'),
  document.getElementById('top-buffer').getContext('2d'),
  document.getElementById('dynamic-buffer').getContext('2d'),
  document.getElementById('bottom-buffer').getContext('2d'),
];

document.getElementById('main').getContext('2d').imageSmoothingEnabled = false;
for(var i = 1; i < context.dests.length; i++){
  context.dests[i].imageSmoothingEnabled = false;
  var entity = nuclear.entity.create();

  nuclear.component('position').add(entity, 0, 0);

  nuclear.component('sprite').add(entity, {
    buffer : context.dests[i].canvas,
    anchorX: 0,
    anchorY: 0,
    index : 100000-i,
    relativeCamera : true
  });

  context.buffers.push(entity);
}

context.WIDTH = 500;
context.HEIGHT = 500;

context.colliders = nuclear.query([
  'collider from game.collisions',
  'position from game.transform'
].join(' '), {
  enabled : true
}).entities;
