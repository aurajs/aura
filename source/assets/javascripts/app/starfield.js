$(function(){
  var mobile_viewport = true;

  var jqContainer = $('#particles');
  var stats;
  var camera, scene, renderer, particle;
  var mouseX = 0, mouseY = 0;

  var sceneWidth = window.innerWidth;
  var sceneHeight = jqContainer.height();
  var halfX = sceneWidth / 2;
  var halfY = sceneHeight / 2;

  var BIG_PARTICLES_SIZE = 100;
  var BIG_PARTICLES_COUNT = 20;

  var SMALL_PARTICLES_SIZE = 1;
  var SMALL_PARTICLES_COUNT = 50;

  var PARTICLE_BASE_SIZE = 32;

  var showStats = false;

  var win = $(window);

  init();
  animate();


  win.smartresize(function(){ toggleAnimation()});
  function toggleAnimation(){
    mobile_viewport = (win.width()>767)?false:true;
  }

  function init() {

    container = jqContainer.get(0);

    camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, 1, 5000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    var createParticles = function createParticles(count, size, lifespan){
      for ( var i = 0; i < count; i++ ) {
        particle = new THREE.Particle(
          new THREE.ParticleBasicMaterial({
            map: new THREE.Texture(generateSprite(size)),
            blending: THREE.AdditiveBlending
            })
          );
        var life  = lifespan*(Math.random()*2 + 1);
        var delay = lifespan*Math.random();
        initParticle( particle, delay, life, size);
        scene.add( particle );
      }
    };

    createParticles(BIG_PARTICLES_COUNT, BIG_PARTICLES_SIZE , 10000);
    createParticles(SMALL_PARTICLES_COUNT, SMALL_PARTICLES_SIZE, 5000);


    renderer = new THREE.CanvasRenderer();

    renderer.setSize( sceneWidth, sceneHeight );
    renderer.sortElements = false;
    renderer.setClearColorHex( 0x26c1c5, 1.00 );

    container.appendChild( renderer.domElement );

    if (showStats){
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      container.appendChild( stats.domElement );
    }

    toggleAnimation();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    // No touch events for now.
    // document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    // document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );
  }

  function onWindowResize() {
    sceneWidth = window.innerWidth;
    // sceneHeight = window.innerHeight;
    halfX = sceneWidth / 2;
    halfY = sceneHeight / 2;
    camera.aspect = sceneWidth / sceneHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( sceneWidth, sceneHeight );
  }

  function generateSprite(size) {
    var seed = Math.random();
    var canvas = document.createElement( 'canvas' );
    var cSize = seed * size + PARTICLE_BASE_SIZE;
    var cWidth = canvas.width = cSize;
    var cHeight = canvas.height = cSize;

    var halfHeight = cSize/2;
    var halfWidth = halfHeight;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( halfWidth, halfHeight, 0, halfWidth, halfHeight, halfWidth );

    var randomInt = function(){
      return parseInt(Math.random()*255, 10);
    };
    var randomColor = function(size){
      // Smaller particles => more luminous.
      var luma = parseInt((1-seed)*(1-seed)*70,10);
      return ""+randomInt()+",100%,"+luma+"%";
    };
    var transparentize = function(c, o){
      return 'hsla('+c+','+o+')';
    };

    var color = randomColor(cSize);
    gradient.addColorStop( 0, transparentize(color,1) );
    gradient.addColorStop( 0.2, transparentize(color,0.5) );
    gradient.addColorStop( 0.4, transparentize(color,0.2) );
    gradient.addColorStop( 1, transparentize(color,0.0) );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, cWidth, cHeight );

    return canvas;
  }

  function initParticle( particle, delay , life, size) {

    var particle = this instanceof THREE.Particle ? this : particle;
    var delay    = delay !== undefined ? delay : 0;

    var birth = life;

    // Scaleup big particles, while letting small ones "small"
    // -> better perfs than making big-ass canvases for big particles
    var scale = size>10?20:1;


    particle.position.x = (Math.random()*sceneWidth - halfX)*3;
    particle.position.y = (Math.random()*sceneHeight- halfY)*3;
    particle.position.z = 0;
    particle.material.opacity = 0;
    particle.scale.x = particle.scale.y = scale;

    // // Tween life
    // new TWEEN.Tween( particle )
    //   .delay( delay )
    //   .to( {}, (life+birth) )

    //   .start();

    // perceived "Mass" of particle : the bigger the slower they move
    var mass = life*(size>10?4:3);

    // // Tween Position
    new TWEEN.Tween( particle.position )
      .delay( delay )
      .to( {
        x: Math.random() * sceneWidth*2 - sceneWidth,
        y: Math.random() * sceneHeight*2 - sceneHeight,
        z: Math.random() * 4000 - 2000 },
      mass )
      .start();


    var alphaIn = new TWEEN.Tween( particle.material )
      .delay( delay )
      .to( {opacity : 0.6 }, birth);
      // .easing(TWEEN.Easing.Exponential.Out);

    var alphaOut = new TWEEN.Tween( particle.material )
      .to( {opacity : 0.01 }, life)
      .onComplete( function(){
        initParticle(particle, delay, life, size);
      } )

    alphaIn.chain(alphaOut);
    alphaIn.start();

    return particle;
  }

  //

  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - halfX;
    mouseY = event.clientY - halfY;
  }

  function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - halfX;
      mouseY = event.touches[ 0 ].pageY - halfY;
    }
  }

  function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - halfX;
      mouseY = event.touches[ 0 ].pageY - halfY;
    }
  }

  //

  function animate() {

    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 / 25 );

    // requestAnimationFrame( animate );
    if(!mobile_viewport){
      render();
    }
    if (showStats){
      stats.update();
    }
  }

  function render() {
    TWEEN.update();
    camera.position.x += ( mouseX/3 - camera.position.x ) * 0.01;
    camera.position.y += ( - mouseY/3 - camera.position.y ) * 0.01;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
  }

});
