'use strict';

var context, prinny, block, i;

context = nuclear.system.context();

prinny = nuclear.entity.create();

nuclear.component('position').add(prinny, 250, 250);

nuclear.component('sprite').add(prinny).fromAtlas('prinny', 0);
nuclear.component('atlas').add(prinny, 'prinny');
nuclear.component('animations').add(prinny, {
  target: 'prinny',
  animations: ['dancing'],
  defaultAnimation: 'dancing'
});

nuclear.component('velocity').add(prinny);

nuclear.component('collider').add(prinny, {
  width: 74,
  height: 121
});

nuclear.component('rigidbody').add(prinny, {
  mass: 1,
  friction: 0.75
});

nuclear.component('inputs').add(prinny, {
  'UP': function (e, input) {
    nuclear.component('velocity').of(e).y -= 5 * input;
  },
  'DOWN': function (e, input) {
    nuclear.component('velocity').of(e).y += 5 * input;
  },
  'LEFT': function (e, input) {
    nuclear.component('velocity').of(e).x -= 5 * input;
  },
  'RIGHT': function (e, input) {
    nuclear.component('velocity').of(e).x += 5 * input;
  }
});

for (i = 0; i < 10; i += 1) {
  block = nuclear.entity.create();

  nuclear.component('position').add(block, Math.random() * context.WIDTH, Math.random() * context.HEIGHT);

  nuclear.component('collider').add(block, {
    width: Math.random() * 50 | 0 + 25,
    height: Math.random() * 50 | 0 + 25
  });

  nuclear.component('velocity').add(block);

  nuclear.component('rigidbody').add(block, {
    mass: 0.1, friction: 0
  });
}

nuclear.system.priority('kinematic', -2);
nuclear.system.priority('collisions', -1);
