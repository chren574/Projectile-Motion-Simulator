// // set the scene size
  //console.log("---> we are on top of main.js ");

var camera, scene, renderer, stats;
var geometry, material, mesh;
var running = false;

// Materials skrivet som JSON -- JavaScript Object Notation.
// Density, bounce property and texture location.
var Materials = {
  "Golf"     : { density : 1184 , ballMaterial : 0.858 , ballTexture : "images/golf.jpg" },
  "Tennis"   : { density : 400  , ballMaterial : 0.712 , ballTexture : "images/tennis.jpg"},
  "Billiard" : { density : 1700 , ballMaterial : 0.804 , ballTexture : "images/billiard.jpg"},
  "Wooden"   : { density : 690  , ballMaterial : 0.603 , ballTexture : "images/wood.jpg"},
  "Steel"    : { density : 7820 , ballMaterial : 0.597 , ballTexture : "images/steel.jpg"},
  "Glas"     : { density : 2500 , ballMaterial : 0.658 , ballTexture : "images/glas.jpg"}
};

//var dt2 = 0;

// the ball object that hold all the parameters
var BALL_OBJ = {
  initialVelocity : 0,
  initialAngle : 0,
  initialVelocity_wind : 0,
  initialAngle_wind : 0,
  radius : 0,
  chosenMaterial : "",
  sceneRadius : function () {
    if (this.radius > 0 ){
      return this.radius*100;  
    } else {
      return 10;
    }  
  },
  //sceneRadius : 15,
};

var GRAVITY = 9.82;
var AIR_DENSITY = 1.2754;

arrowHelper = 0;

//Start varibles
var time_old = 0;
var canonBallArray = [];
var pointArray = [];

window.addEventListener("click", keyPress, false);

function keyPress(e) {
  switch(e.keyCode) {
      case 32:
          launch();
          break;
      case 37:
          // left key pressed
          initialVelocity--;
          document.getElementById("initialVelocity").value=velocity;
          break;
      case 38:
          // up key pressed
          ball_angle++;
          document.getElementById("angle").value=ball_angle;
          break;
      case 39:
          // right key pressed
          initialVelocity++;
          document.getElementById("initialVelocity").value=velocity;
          break;
      case 40:
          // down key pressed
          ball_angle--;
          document.getElementById("angle").value=ball_angle;
          break;
      case 65:
          camera.position.set(-300,300,0);
          camera.up = new THREE.Vector3(1,0,0);
          camera.lookAt(new THREE.Vector3(0,0,0));
          break; 
    }
}

function launch() {
  //console.log("---> launch() is called ");

  // check if there is a ball in the air.
  if( !running ) {

    if (!windCheck.checked) {
    scene.remove(arrowHelper);
    }
 
    reloadSettings();
    running = true;
    
    // start the time and the animation
    t = new Date().getTime(); 
    animate();
  }
}

function clearish() {
  //console.log("---> clearish() is called ");

  running = false;
  cancelAnimationFrame(animationId);

  scene.remove(arrowHelper);

  var obj, ob, i, j;
  
  for ( i = canonBallArray.length - 1; i >= 0 ; i -- ) {
    obj = canonBallArray[ i ];

    scene.remove(obj);
    delete canonBallArray[ i ];
  }
  
  for (j = pointArray.length - 1; j>=0;j--) {
    ob = pointArray[j]
    scene.remove(ob);
    delete pointArray[ i ];
  }

  createBall();
  renderer.render(scene, camera);
  
}

function showWind(){
  //console.log("---> showWind() is called ");

  document.getElementById("windsettings").style.display = windCheck.checked ? "block" : "none";
}
/**
 * function called when the browser is loaded
 * 
 */
function init() {
  //console.log("---> init() is called ");

  //parse the parameters from the browser
  setupParameters();
  //seup the scene in three js
  setupScene();
}
/**
 * take the parameters in the settings
 * 
 */
function setupParameters() {
    //console.log("---> setupParameters() is called ");

    //parse the velocities
    BALL_OBJ.initialVelocity = parseFloat(document.getElementById("initialVelocity").value);
    BALL_OBJ.initialVelocity_wind = parseFloat(document.getElementById("initialVelocity_wind").value);
    
    ////parse the angles
    var angle = document.getElementById("angle").value;
    BALL_OBJ.initialAngle = parseFloat(angle*Math.PI/180);

    var angle_wind = document.getElementById("angle_wind").value;
    BALL_OBJ.Angle_wind = parseFloat((angle_wind)*Math.PI/180) + Math.PI;

    BALL_OBJ.radius = parseFloat(document.getElementById("ballSize").value);

    //parse the material
    //Material - this is a string.
    BALL_OBJ.chosenMaterial = document.getElementById("material").value;


    /*
    // DO NOT DELETE! --> this is used for Error handling --> DO NOT DELETE!
    /*
    console.log("BALL_OBJ.initialVelocity     : " + BALL_OBJ.initialVelocity);
    console.log("BALL_OBJ.initialVelocity_wind: " + BALL_OBJ.initialVelocity_wind);
    console.log("BALL_OBJ.initialAngle        : " + BALL_OBJ.Angle);
    console.log("BALL_OBJ.initialAngle_wind   : " + BALL_OBJ.Angle_wind);
    console.log("BALL_OBJ.radius              : " + BALL_OBJ.radius);
    console.log("BALL_OBJ.chosenMaterial      : " + BALL_OBJ.chosenMaterial);
    

    console.log("---------------------" );
    console.log("BALL_OBJ.sceneRadius      : " + BALL_OBJ.sceneRadius() );
    */

}
/**
 * Setup the scene and render it
 * 
 */
function setupScene () {
  //console.log("---> setupScene() is called ");

  //Setup The Scene --------------------------------------

  //------------------------------------------------------
  // SCENE 
  scene = new THREE.Scene();

  //------------------------------------------------------
  var container = document.getElementById("container");

  WIDTH = container.offsetWidth,
  HEIGHT = container.offsetHeight;

  VIEW_ANGLE = 75,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 1000;

  // CAMERA
  // create camera and a scene
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT , NEAR, FAR);

  // add the camera to the scene
  scene.add(camera);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 250;
  camera.position.y = 75;

  //------------------------------------------------------
  // RENDERER
  // create a WebGL renderer, camera
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x00000, 1);
  
  // get the DOM element to attach to
  //var container = document.getElementById("container");
  
  // start the renderer
  //renderer.setSize(WIDTH, HEIGHT);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  // attach the render-supplied DOM element
  container.appendChild( renderer.domElement );

  //------------------------------------------------------
  // STATS 
  // displays current and past frames per second attained by scene

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '14px';
  stats.domElement.style.zIndex = 100;

  container.appendChild( stats.domElement );

  //------------------------------------------------------
  // LIGHT
   
  var greenPoint = new THREE.PointLight(0x404040, 3, 500);
  greenPoint.position.set( 0, 150, 70 );
  scene.add(greenPoint);
  scene.add(new THREE.PointLightHelper(greenPoint, 3));

  //HemisphereLight(skyColorHex, groundColorHex, intensity)

  var ambient = new THREE.AmbientLight( 0x404040 )
  scene.add ( ambient );

  //------------------------------------------------------
  // GEOMETRY

  // create the ball 
  createBall();

  //Dots
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
  var dotMaterial = new THREE.PointCloudMaterial( { size: 3, sizeAttenuation: false } );
  dot = new THREE.PointCloud( dotGeometry, dotMaterial );
  //canonBallArray.push(dot);
  pointArray.push(dot);

  //Plane geometry and material

  planeWidth = 500;
  var geometry = new THREE.BoxGeometry( planeWidth, 300, 100 );
  var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
  var plane = new THREE.Mesh( geometry, material );

  plane.rotation.x = Math.PI/2;
  plane.position.y = -50;
  scene.add( plane );


  //Wind arrow
  //scene.remove(arrowHelper);
  
  if (windCheck.checked == true) {

    windArrow();
    /*
    var local_wind_angle = BALL_OBJ.Angle_wind;

    dir = new THREE.Vector3( -Math.cos(local_wind_angle), -Math.sin(local_wind_angle), 0 );
    origin = new THREE.Vector3( container.offsetWidth - 0.7*container.offsetWidth, container.offsetHeight - 0.6*container.offsetHeight, 0 );
    hex = 0xffff00;
    arrowHelper = new THREE.ArrowHelper( dir, origin, 50, hex, 15, 15);

    scene.add( arrowHelper );
  */
  }

  //render the scene
  renderer.render(scene, camera);

}
/**
 * update the texture of the ball
 * 
 */
function updateBall(newMaterial) {
  
  var ballTexture = Materials[newMaterial.value].ballTexture;
  img.src = ballTexture;

    //render the new ball thats been added
  renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  cancelAnimationFrame(animationId);

}
/**
 * reload the settings from the browser 
 * 
 */
function reloadSettings() {

  //maybe done twice but for safety
  setupParameters();
  //------------------------------
  ball.angle = BALL_OBJ.initialAngle;
  ball.radius = BALL_OBJ.radius;
  ball.sceneRadius = BALL_OBJ.sceneRadius();

  ball.velocityX = BALL_OBJ.initialVelocity*Math.cos(ball.angle);
  ball.velocityY = BALL_OBJ.initialVelocity*Math.sin(ball.angle);

  ball.accelX = 0;
  ball.accelY = -GRAVITY;
  
  ball.vf2 = 0;
  ball.vf_ang = 0;

  ball.velocity_wind = BALL_OBJ.initialVelocity_wind;
  ball.Uang          = BALL_OBJ.Angle_wind;

  ball.density   = Materials[BALL_OBJ.chosenMaterial].density;
  ball.bmaterial = Materials[BALL_OBJ.chosenMaterial].ballMaterial;

  //luftmotstånd parametrar
  // Need to compensate area and D with a factor 10 maybe
  C = 0.5;
  ball.area = Math.PI*Math.pow(ball.radius, 2);

  ball.mass = ball.density * 0.75*Math.PI*Math.pow(ball.radius,3);
  ball.D = ((AIR_DENSITY * C * ball.area)/2 );

  /*
  ball.mass = 1;
  ball.D = 0.02;
*/




  /*
  // DO NOT DELETE! --> this is used for Error handling --> DO NOT DELETE!
  // can be commented out
  /*
  console.log("ball.angle         : " + ball.angle);
  console.log("ball.radius        : " + ball.radius);
  console.log("ball.sceneRadius   : " + ball.sceneRadius);
  console.log("ball.angle         : " + ball.angle );
  console.log("ball.velocityX     : " + ball.velocityX);
  console.log("ball.velocityY     : " + ball.velocityY);
  console.log("ball.accelX        : " + ball.accelX);
  console.log("ball.accelY        : " + ball.accelY);
  console.log("ball.vf2           : " + ball.vf2);
  console.log("ball.vf_ang        : " + ball.vf_ang);
  console.log("ball.velocity_wind : " + ball.velocity_wind);
  console.log("ball.Uang          : " + ball.Uang);
  console.log("ball.density       : " + ball.density);
  console.log("ball.bmaterial     : " + ball.bmaterial);
  console.log("ball.area          : " + ball.area);
  console.log("ball.mass          : " + ball.mass);
  console.log("ball.D             : " + ball.D);
  console.log("ball.D/ball.mass   : " + (ball.D/ball.mass));

  */

  if (windCheck.checked == true) {
    scene.remove(arrowHelper);
    windArrow();
  }


}

/**
 * Create the ball
 * 
 */
function createBall () {
  //console.log("---> createBall() is called ");

  //cene.remove(arrowHelper);
 
  var setRadius = BALL_OBJ.sceneRadius();

  var sphereGeom =  new THREE.SphereGeometry(setRadius, 32, 32 ); 
  
  // basic texture
  var ballTexture = Materials[BALL_OBJ.chosenMaterial].ballTexture;

  //------------------
  img = new Image();
  texture = new THREE.Texture(img);
  img.onload = function () { texture.needsUpdate = true; };
  img.src = ballTexture;
  texture.needsUpdate = true;
  //------------------
  var moonTexture = THREE.ImageUtils.loadTexture(ballTexture, {}, function() {
    renderer.render(scene, camera);
  });
  
  //var moonTexture = THREE.ImageUtils.loadTexture( ballTexture );
  var moonMaterial = new THREE.MeshBasicMaterial( { map: texture } );

  ball = new THREE.Mesh( sphereGeom, moonMaterial );

  ball.position.x = -220;
  ball.position.y = 0 + BALL_OBJ.sceneRadius();
  
  //add the ball to the scene
  scene.add(ball);
  
  // Add the ball to the list with all the balls
  canonBallArray.push(ball);

  if (windCheck.checked == true) {
    windArrow();
  }

  //render the new ball thats been added
  renderer.render(scene, camera);

}

/**
 * Animation loop.
 * 
 */
function animate() {
  //console.log("---> animate() is called ");

  animationId = requestAnimationFrame(animate);

  render();
  stats.update();

}
/**
 * Rendering loop.
 * 
 */
function render() {

  // Calculate the delta time.
  var dt = (new Date().getTime() - t )/200; //1000 default
  t = new Date().getTime();                 //reset t  
  //console.log(dt);

  // test to render a constant time step
  //dt2+=0.001;
  //
  calculateVelocitiesWind(ball);

  //
  updateAccelWind(ball)

  //
  updateVelocity(ball, dt);
  
  //update position of the ball 
  updatePosition(ball, dt);

  checkCollision(ball);

  //draw the shadows for the ball
  drawBallShadow();

  //render the scene
  renderer.render(scene, camera);

}

/**
 * Quit the current rendering.
 * 
 */
function stopRender() {
  //stop rendering the current ball and create a new one.
  cancelAnimationFrame(animationId);
  createBall();
  running = false;
  //dt2 = 0;
}

/**
 * Draws the dot after the ball.
 * 
 */
function drawBallShadow() {

    if(time_old == 5) {  
    var point = dot.clone();
    point.position.set( ball.position.x, ball.position.y, 0 )
    scene.add ( point );
      pointArray.push(point);

     // window.alert(pointArray.length);
    time_old = 0;
   }
  time_old += 1;
}

function windArrow() {
  var local_wind_angle = BALL_OBJ.Angle_wind;

  dir = new THREE.Vector3( -Math.cos(local_wind_angle), -Math.sin(local_wind_angle), 0 );
  origin = new THREE.Vector3( container.offsetWidth - 0.7*container.offsetWidth, container.offsetHeight - 0.6*container.offsetHeight, 0 );
  hex = 0xffff00;
  arrowHelper = new THREE.ArrowHelper( dir, origin, 50, hex, 15, 15);

  scene.add( arrowHelper );
}


/**
 * Calculate the new velocity of each component.
 */
function updateVelocity(obj, dt) {
  obj.velocityX = obj.velocityX + obj.accelX*dt;
  obj.velocityY = obj.velocityY + obj.accelY*dt;
}

/**
 * Calculate the new positon based on the velocity and acceleration.
 */
function updatePosition(obj, dt) {
  obj.position.x += obj.velocityX * dt + ( obj.accelX * Math.pow(dt,2) * 0.5);
  obj.position.y += obj.velocityY * dt + ( obj.accelY * Math.pow(dt,2) * 0.5);

}

/**
 * Calculate the wind velocity.
 * 
 */
function calculateVelocitiesWind(obj) {
 
  obj.vf2    = (Math.pow((obj.velocityX+(obj.velocity_wind)*Math.cos(obj.Uang)),2) + Math.pow((obj.velocityY + obj.velocity_wind*Math.sin(obj.Uang)),2) );     
  obj.vf_ang = Math.atan(Math.abs((obj.velocityY + (obj.velocity_wind)*Math.sin(obj.Uang))/ (obj.velocityX + obj.velocity_wind*Math.cos(obj.Uang)) ) );


/*
  console.log('vx    :'+ obj.velocityX );
  console.log('wx    :'+ (obj.velocity_wind)*Math.cos(obj.Uang) );
  console.log('vx+wx :'+ (obj.velocityX+(obj.velocity_wind)*Math.cos(obj.Uang)) );
  console.log('cos :'+ (Math.cos(180*Math.PI/180)) );
*/

}

/**
 * .
 */
function updateAccelWind(obj) {

  //console.log(obj.vf_ang);
  //vilkor for att cos ar jamn
  if ( (obj.velocityX+(obj.velocity_wind)*Math.cos(obj.Uang)) > 0) {
    obj.accelX =   -(obj.D/obj.mass) * obj.vf2*Math.cos( obj.vf_ang );  
  } 
  else {
    obj.accelX =   +(obj.D/obj.mass) * obj.vf2*Math.cos( obj.vf_ang );  
  }
  
  //vet inte om det behövs kontroll av sin också
  if ( (obj.velocityY+(obj.velocity_wind)*Math.sin(obj.Uang)) > 0) {
    obj.accelY = -GRAVITY - (obj.D/obj.mass) * obj.vf2*Math.sin( obj.vf_ang );    
  }
  else {
    obj.accelY = -GRAVITY + (obj.D/obj.mass) * obj.vf2*Math.sin( obj.vf_ang );
  }


  /*
  console.log('start angle: ' + obj.angle);
  console.log('wind  angle: ' + obj.Uang);
  console.log('vf2   angle: ' + obj.vf_ang);
  console.log('obj.accelX : ' + obj.accelX);
  */

}

/**
 * .
 */
function checkCollision(obj) {

  // check if the ball hits the ground 
  // && obj.position.x < planeWidth/2 && obj.position.x > -planeWidth/2
  if (obj.velocityY < 0 ) {

    if ( (obj.position.y - obj.sceneRadius ) < 0  && obj.position.y > 0 ) {
      // change sign of the velocity in y-direction.
      obj.velocityY = -obj.velocityY * obj.bmaterial;
      obj.velocityX = obj.velocityX * obj.bmaterial;

      //console.log(Math.sqrt( Math.pow((obj.velocityX),2 ) + Math.pow((obj.velocityY),2 ) ));
      //console.log("POS: " +obj.position.x);

      // check if the total velocity is to low for a bounce. the number 5 need to be checked
      // could be nice to just check the velocity in one direction also like || abs(obj.velocityX) < 2 || abs(obj.velocityY) 
      if ( ( Math.sqrt( Math.pow((obj.velocityX), 2 ) + Math.pow((obj.velocityY), 2 ) )  < 7 )  ) {
        stopRender();
      } 
    }
  }
}

// Converted from Python version: http://doswa.com/2009/01/02/fourth-order-runge-kutta-numerical-integration.html
//                    javascript: http://mtdevans.com/2013/05/fourth-order-runge-kutta-algorithm-in-javascript-with-demo/
//function rk4(x, v, a, dt) {
  function rk4(obj, dt) {

  // Returns final (position, velocity) array after time dt has passed.
  //        x: initial position
  //        v: initial velocity
  //        a: acceleration function a(x,v,dt) (must be callable)
  //        dt: timestep

  var x1 = obj.position.y;
  var v1 = obj.velocityY ;
  var a1 = a(x1, v1, 0);

  var x2 = x + 0.5*v1*dt;
  var v2 = v + 0.5*a1*dt;
  var a2 = a(x2, v2, dt/2);

  var x3 = x + 0.5*v2*dt;
  var v3 = v + 0.5*a2*dt;
  var a3 = a(x3, v3, dt/2);

  var x4 = x + v3*dt;
  var v4 = v + a3*dt;
  var a4 = a(x4, v4, dt);

  var xf = x + (dt/6)*(v1 + 2*v2 + 2*v3 + v4);
  var vf = v + (dt/6)*(a1 + 2*a2 + 2*a3 + a4);

  return [xf, vf];
}




  