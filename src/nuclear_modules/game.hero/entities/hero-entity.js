'use strict';

module.exports = function heroEntity(hero, options) {
  var animations, velocity, direction;

  nuclear.component('position').add(hero, options.x, options.y);

  nuclear.component('atlas').add(hero, 'hero');

  nuclear.component('sprite').add(hero, {
    scale: 4,
    width: 64,
    height: 120,
    dest : 3,
    dynamic : true
  });

  console.log('new hero entity', hero);

  animations = nuclear.component('animations').add(hero, 'idleface', [
    'idleback',
    'idleface',
    'idleleft',
    'idleright',
    'walkback',
    'walkface',
    'walkleft',
    'walkright'
  ]);

  nuclear.component('collider').add(hero, {
    width: 64,
    height: 60,
    offsetY : 20,
    mask : 'hero'
  });

  nuclear.component('rigidbody').add(hero, {
    mass: 1, friction: 0.75
  });

  nuclear.component('name').add(hero, options.name);
  
  velocity = nuclear.component('velocity').add(hero);
  direction = {
    x : 0,
    y : 1
  };
  nuclear.component('inputs').add(hero, {
    FIRE: function onFire(e, input) {
      if(input){
        var position = nuclear.component('position').of(e);
        nuclear.component('attack').of(e).to(position, {
          x : position.x+direction.x,
          y: position.y+direction.y
        });
      }
    },
    UP: function onUpHeroHandler(e, input) {
      velocity.y -= 2.5 * input;
      if (input){
        animations.play('walkback');
        direction.x = 0;
        direction.y = -1;
      }
      else if (animations.currentAnimation === 'walkback') animations.play('idleback');
    },
    DOWN: function onDownHeroHandler(e, input) {
      velocity.y += 2.5 * input;
      if (input){
        animations.play('walkface');
        direction.x = 0;
        direction.y = 1;
      } 
      else if (animations.currentAnimation === 'walkface') animations.play('idleface');
    },
    LEFT: function onLeftHeroHandler(e, input) {
      velocity.x -= 2.5 * input;
      if (input) {
        animations.play('walkleft');
        direction.x = -1;
        direction.y = 0;
      }
      else if (animations.currentAnimation === 'walkleft') animations.play('idleleft');
    },
    RIGHT: function onRightHeroHandler(e, input) {
      velocity.x += 2.5 * input;
      if (input){
        animations.play('walkright');
        direction.x = 1;
        direction.y = 0;
      }
      else if (animations.currentAnimation === 'walkright') animations.play('idleright');
    }
  });

    console.log(hero);
    console.log(options);
    console.log(nuclear.component('life').add(hero, 100, options.life || 100, function(){
        //death anim
        //new level
        //new ghost
    }, function(){
        //feedbacks
    }));
    var attack = nuclear.component('attack').add(hero, {
      w : 50,
      h : 90,
      offset : 30,
      impulse : 10,
      damages : 100,
      cooldown : 100,
      mask : 'hero',
      onEnter : function(other){
        if(nuclear.component('states').of(other)){
            nuclear.component('life').of(other).less(attack.damages);
        }
      },
      onExit : function(){}
    });
};
