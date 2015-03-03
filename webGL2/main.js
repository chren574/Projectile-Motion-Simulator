// // set the scene size

// TODO försök att ändra så storleken inte är konstant.
var WIDTH = 1000,
    HEIGHT = 600;

// set some camera attributes
var VIEW_ANGLE = 75,
ASPECT = WIDTH / HEIGHT,
NEAR = 1,
FAR = 10000;

var camera, scene, renderer, stats;
var geometry, material, mesh;
var running = false;

// Materials skrivet som JSON -- JavaScript Object Notation.
//Density and bounce property
/*var Materials = {
  "Glas"  : { density : 2600 , ballMaterial : 0.9, ballTexture : "images/glas.jpg" },
  "Steel" : { density : 7820, ballMaterial : 0.8 , ballTexture : "images/steel.jpg"},
  "Brass" : { density : 480 , ballMaterial : 0.4 , ballTexture : "images/brass.jpg"},
  "Lead"  : { density : 11350, ballMaterial : 0.2 , ballTexture : "images/lead.jpg"},
  "Wood"  : { density :  690, ballMaterial : 0.6 , ballTexture : "images/wood.jpg"}
};*/

var Materials = {
  "Golf"  : { density : 1184 , ballMaterial : 0.858, ballTexture : "images/golf.jpg" },
  "Tennis" : { density : 400, ballMaterial : 0.712 , ballTexture : "images/tennis.jpg"},
  "Billiard" : { density : 1700 , ballMaterial : 0.804 , ballTexture : "images/billiard.jpg"},
  "Wooden"  : { density : 690, ballMaterial : 0.603 , ballTexture : "images/wood.jpg"},
  "Steel"  : { density :  7820, ballMaterial : 0.597 , ballTexture : "images/steel.jpg"},
  "Glas"  : { density :  2500, ballMaterial : 0.658 , ballTexture : "images/glas.jpg"}
}

arrowHelper = 0;

//Start varibles

var time_old = 0;
var GRAVITY = 9.82;
var AIR_DENSITY = 1.2754;
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

  if(running == false) {

    running = true;

    scene.remove(arrowHelper);

    initialVelocity = parseFloat(document.getElementById("initialVelocity").value);

    var initialVelocity_wind = document.getElementById("initialVelocity_wind").value;
    velocity_wind = parseFloat(initialVelocity_wind);

    var angle = document.getElementById("angle").value;
    ball_angle = parseFloat(angle*Math.PI/180);

    var angle_wind = document.getElementById("angle_wind").value;
    wind_angle = parseFloat((angle_wind));

    var radius = document.getElementById("ballSize").value;
    radius = parseFloat(radius);

  	//Material - this is a string.
  	chosenMaterial = document.getElementById("material").value;
    //chosenMaterial = parseFloat(material);

    var density = Materials[chosenMaterial].density;
    var ballMaterial = Materials[chosenMaterial].ballMaterial;

	  //----------------------------------------------------------
    
    var wind_angle = (180+wind_angle)*Math.PI/180;

    // wind arrow
    if (windCheck.checked == true) {
    dir = new THREE.Vector3( -Math.cos(wind_angle), -Math.sin(wind_angle), 0 );
    origin = new THREE.Vector3( 300, 300, 0 );
    hex = 0xffff00;
    arrowHelper = new THREE.ArrowHelper( dir, origin, 50, hex, 15, 15);
    scene.add( arrowHelper );
    }
    
    createBall(initialVelocity, radius, angle, wind_angle, velocity_wind, density, ballMaterial );
    
    t = new Date().getTime(); 
    animate();
  }
}

function clearish() {

  running = false;
  cancelAnimationFrame(animationId);

  scene.remove(arrowHelper);

  var obj, ob, i, j;
  for ( i = canonBallArray.length - 1; i >= 0 ; i -- ) {
    obj = canonBallArray[ i ];
    
    // scene.remove(ball);
    //   scene.remove(point);
    scene.remove(obj);
    delete canonBallArray[ i ];
  }
  for (j = pointArray.length - 1; j>=0;j--) {
    ob = pointArray[j]
    scene.remove(ob);
    delete pointArray[ i ];
  }

renderer.render(scene, camera);
  
}
function showWind(){
  document.getElementById("windsettings").style.display = windCheck.checked ? "block" : "none";
}

function init() {

  //------------------------------------------------------
  // SCENE 
  scene = new THREE.Scene();

  //------------------------------------------------------
  // CAMERA
  // create camera and a scene
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT , NEAR, FAR);

  // add the camera to the scene
  scene.add(camera);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 300;
  camera.position.y = 100;

  //------------------------------------------------------
  // RENDERER
  // create a WebGL renderer, camera
  renderer = new THREE.WebGLRenderer({ antialias: true });
  
  // get the DOM element to attach to
  var container = document.getElementById("container");
  
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

  //Dots
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
  var dotMaterial = new THREE.PointCloudMaterial( { size: 3, sizeAttenuation: false } );
  dot = new THREE.PointCloud( dotGeometry, dotMaterial );
  //canonBallArray.push(dot);
  pointArray.push(dot);

  //Plane geometry and material
  var geometry = new THREE.PlaneGeometry( 500, 300, 20 );
  var material = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = Math.PI/2;
  scene.add( plane );

  renderer.render(scene, camera);

}


function createBall (initialVelocity, radius, angle, wind_angle, velocity_wind, density, ballMaterial) {
 
 /*
 //custom shaders
 material = new THREE.ShaderMaterial( {
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
} );
*/


  // radius, segmentsWidth, segmentsHeight
  var sceneRadius = radius*200;
  var sphereGeom =  new THREE.SphereGeometry(sceneRadius, 32, 32 ); 
    
  // basic texture
  var ballTexture = Materials[chosenMaterial].ballTexture;
  var moonTexture = THREE.ImageUtils.loadTexture( ballTexture );
  var moonMaterial = new THREE.MeshBasicMaterial( { map: moonTexture } );
  ball = new THREE.Mesh( sphereGeom.clone(), moonMaterial );

  //------------------------------

  ball.angle = angle;
  ball.radius = radius;
  ball.sceneRadius = sceneRadius;

  ball.position.x = -200;
  ball.position.y = 0 + radius;

  ball.velocityX = initialVelocity*Math.cos(angle*Math.PI/180)
  ball.velocityY = initialVelocity*Math.sin(angle*Math.PI/180)

  ball.accelX = 0;
  ball.accelY = -GRAVITY;
  
  ball.vf2 = 0;
  ball.vf_ang = 0;

  ball.velocity_wind = velocity_wind;
  ball.Uang = wind_angle;

  ball.density = density;
  ball.bmaterial = ballMaterial;


  C = 0.5;
  ball.area = Math.PI*Math.pow(radius, 2);

  //luftmotstånd parametrar
  // Need to compensate with a factor 10 maybe
  ball.mass = (density * (4*Math.PI*Math.pow(radius,2))/3 );
  ball.D = ((AIR_DENSITY * C * ball.area)/2 );

  console.log("radius" + ball.radius);
  console.log("D: " + ball.D);
  
  //ball.mass = 1;
  console.log("mass: " + ball.mass);

  if (windCheck.checked == true) {
  dir.set( -Math.cos(ball.Uang), -Math.sin(ball.Uang), 0 );
  arrowHelper.setDirection(dir);
  }
  scene.add(ball);

  // Add the ball to the list with all the balls
  canonBallArray.push(ball);

  //render the new ball thats been added
  renderer.render(scene, camera);
}


function animate() {

  animationId = requestAnimationFrame(animate);

  render();
  stats.update();

}


function render() {


  // Calculate the delta time.
  var dt = (new Date().getTime() - t )/200; //1000 default
  t = new Date().getTime(); //reset t
  
  //console.log(dt);

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
  cancelAnimationFrame(animationId);
  running = false;
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
 
  obj.vf2 =  Math.sqrt( Math.pow(( obj.velocityX+(obj.velocity_wind)*Math.cos(obj.Uang)),2) + Math.pow((obj.velocityY + obj.velocity_wind*Math.sin(obj.Uang)),2) );     
  obj.vf_ang = Math.atan(Math.abs((obj.velocityY + (obj.velocity_wind)*Math.sin(obj.Uang))/ (obj.velocityX + obj.velocity_wind*Math.cos(obj.Uang)) ) );

/*
  console.log('vx    :'+ obj.velocityX );
  console.log('wx    :'+ (obj.velocity_wind)*Math.cos(obj.Uang) );
  console.log('vx+wx :'+ (obj.velocityX+(obj.velocity_wind)*Math.cos(obj.Uang)) );

  */

}

/**
 * .
 */
function updateAccelWind(obj) {


/*
  console.log('start angle: ' + obj.angle);
  console.log('wind  angle: ' + obj.Uang);
  console.log('vf2   angle: ' + obj.vf_ang);
  */

  //console.log(obj.vf_ang);
  //vilkor for att cos ar jamn
  
  if ( (obj.velocityX+(obj.velocity_wind)*Math.cos(obj.Uang)) > 0) {
    obj.accelX =   -(obj.D/obj.mass) * obj.vf2*Math.cos( obj.vf_ang );  
  } else {
    obj.accelX =   +(obj.D/obj.mass) * obj.vf2*Math.cos( obj.vf_ang );  
  }
  /*
    obj.accelX =          - (obj.D/obj.mass) * obj.vf2*Math.cos( obj.vf_ang ); 
    */
    obj.accelY = -GRAVITY - (obj.D/obj.mass) * obj.vf2*Math.sin( obj.vf_ang );

 // console.log ( obj.accelX );
}

/**
 * .
 */
function checkCollision(obj) {

  // check if the ball hits the ground 

  if (obj.velocityY < 0 ) {

    if ( (obj.position.y - ball.sceneRadius ) < 0  && obj.position.y > 0 ) {
      // change sign of the velocity in y-direction.
      obj.velocityY = -obj.velocityY * obj.bmaterial;
      obj.velocityX = obj.velocityX * obj.bmaterial;

      //console.log(Math.sqrt( Math.pow((obj.velocityX),2 ) + Math.pow((obj.velocityY),2 ) ));
      //console.log(obj.velocityY);


      // check if the total velocity is to low for a bounce. the number 5 need to be checked
      if ( Math.sqrt( Math.pow((obj.velocityX), 2 ) + Math.pow((obj.velocityY), 2 ) )  < 2) {

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




  
