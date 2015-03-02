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

arrowHelper = 0;


//Start varibles
//var initialVelocity = 40;
//var velocity_wind = 10;
var time_old = 0;
//var ball_angle = 70;
//var wind_angle = 70;
var gravity = 9.82;
var radius = 0.5;

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

    scene.remove(arrowHelper);

    initialVelocity = parseFloat(document.getElementById("initialVelocity").value);

    var initialVelocity_wind = document.getElementById("initialVelocity_wind").value;
    velocity_wind = parseFloat(initialVelocity_wind);

    var angle = document.getElementById("angle").value;
    ball_angle = parseFloat(angle*Math.PI/180);

    var angle_wind = document.getElementById("angle_wind").value;
    wind_angle = parseFloat((angle_wind));

    var radius = document.getElementById("ballSize").value;
    radius = parseFloat(radius)*200;

    var ballMass = document.getElementById("ballMass").value;
    mass = parseFloat(ballMass);

    var wind_angle = (180+wind_angle)*Math.PI/180;

    dir = new THREE.Vector3( -Math.cos(wind_angle), -Math.sin(wind_angle), 0 );
    origin = new THREE.Vector3( 300, 300, 0 );
    hex = 0xffff00;
    arrowHelper = new THREE.ArrowHelper( dir, origin, 50, hex, 15, 15);
    scene.add( arrowHelper );

    createBall(initialVelocity, radius, angle, wind_angle, velocity_wind);
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

  // most objects displayed are a "mesh":
  // a collection of points ("geometry") and
  // a set of surface parameters ("material") 

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



  //TODO parse the initial value for the direction of the vector.
  // Arrowhelper - wind
  //var wind_angle = 180*Math.PI/180;

  //dir = new THREE.Vector3( -Math.cos(wind_angle), -Math.sin(wind_angle), 0 );
  //origin = new THREE.Vector3( 300, 300, 0 );
  //hex = 0xffff00;

  //arrowHelper = new THREE.ArrowHelper( dir, origin, 50, hex, 15, 15);
  //arrowHelper.setLength (50, 10, 10);
  //arrowHelper.position.set( 300, 300, 0 );

  //arrowHelper.setDirection(dir)
  //scene.add( arrowHelper );

  renderer.render(scene, camera);
  //requestAnimationFrame(render);

}


function createBall (initialVelocity, radius, angle, wind_angle, velocity_wind) {

/*
  ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('textures/ball.jpg'),
    specular: new THREE.Color('grey')      })
);
*/
 




 /*
 //custom shaders
 material = new THREE.ShaderMaterial( {
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent
} );
*/

/*
  var material = new THREE.MeshBasicMaterial({
    color: 0xb7ff00, 
    wireframe: true 
    //color : 0x0033ff
  });
  */

  ball = new THREE.Mesh( 
        new THREE.IcosahedronGeometry( radius, 4 ), 
        material 
  );
  
  //old code
  var material = new THREE.MeshPhongMaterial({
    color : 0x0033ff
  });
  var spheregeometry = new THREE.SphereGeometry( radius , 32, 32 );
  ball = new THREE.Mesh(spheregeometry, material);
  
  //ball.__proto__ = ball1

  ball.position.x = -180;
  ball.position.y = 0 + radius;

  ball.time = 0;
  //ball.initialVelocity = initialVelocity;
  
  ball.angle = angle;
  ball.radius = radius;

  ball.accelX = 0;
  ball.accelY = -gravity;
  
  ball.velocityX = initialVelocity*Math.cos(angle*Math.PI/180)
  ball.velocityY = initialVelocity*Math.sin(angle*Math.PI/180)

  ball.vf2 = 0;
  ball.vf_ang = 0;

  ball.velocity_wind = velocity_wind;
  ball.Uang = (wind_angle);
  //ball.Uang = (wind_angle*Math.PI/180); //bollen drar iväg
  //console.log(wind_angle);
  //console.log(ball.Uang);

  ball.D = 0.02;
  ball.m = 1;


  dir.set( -Math.cos(ball.Uang), -Math.sin(ball.Uang), 0 );
  arrowHelper.setDirection(dir);

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

  
  //Avsluta renderingsloopen nar bollen slår i marken 
  if ( (ball.position.y - ball.radius ) < 0) {
    stopRender();
  }

  //calculate the delta time.
  var dt = (new Date().getTime() - t )/200; //1000 default
  t = new Date().getTime(); //reset t

/*
  //calculate and update the ball position
  updateVelocity(ball, dt);
  //update position of the ball 
  updatePosition(ball, dt);
  
*/
  
  //console.log(dt);

  calculateVelocitiesWind(ball);

  updateAccelWind(ball)

  updateVelocity(ball, dt);
  //update position of the ball 
  updatePosition(ball, dt);


  //draw the shadows for the ball
  drawBallShadow();

  /*
  ball.position.x = LIB.distX(ball.velocity, ball.angle, dt) - 160;
  ball.position.y = LIB.distY(ball.velocity, ball.angle, dt, gravity) + ball.radius;
  */

  //ball.position.x = LIB.distX_vind(ball.position.x, ball.velocity, ball.angle, ball.time, wind_angle, velocity_wind, radius) - 160;
  //ball.position.y = LIB.distY_vind(ball.position.y, ball.velocity, ball.angle, ball.time, gravity, wind_angle, initialVelocity_wind, radius) + ball.radius;

  //update the time for the ball

  //ball.time += 0.01;

  //render the scene
  renderer.render(scene, camera);
}

function stopRender() {
  cancelAnimationFrame(animationId);
}

function drawBallShadow() {

    if(time_old == 4) {  
    var point = dot.clone();
    point.position.set( ball.position.x, ball.position.y, 0 )
    scene.add ( point );
      pointArray.push(point);

     // window.alert(pointArray.length);
    time_old = 0;
   }
  time_old += 1;
}

function updateVelocity(obj, dt) {
  obj.velocityX = obj.velocityX + obj.accelX*dt;
  obj.velocityY = obj.velocityY + obj.accelY*dt;
}

function updatePosition(obj, dt) {
  obj.position.x += obj.velocityX * dt + ( obj.accelX * Math.pow(dt,2) * 0.5);
  obj.position.y += obj.velocityY * dt + ( obj.accelY * Math.pow(dt,2) * 0.5);
}

//pure vector calculus
function calculateVelocitiesWind(obj) {

  // vind 
  obj.vf2 =  Math.sqrt( Math.pow(( obj.velocityX + (obj.velocity_wind) * Math.cos(obj.Uang)),2) + Math.pow((obj.velocityY + obj.velocity_wind*Math.sin(obj.Uang)),2) );     
  obj.vf_ang = Math.atan((obj.velocityY + (obj.velocity_wind)*Math.sin(obj.Uang))/ (obj.velocityX + obj.velocity_wind*Math.cos(obj.Uang)));

}

function updateAccelWind(obj) {

  //vilkor for att cos ar jamn
  if (obj.vf_ang >= 0) {

    obj.accelX =   -(obj.D/obj.m) * obj.vf2*Math.cos( obj.vf_ang );  
  } else {
    obj.accelX =   +(obj.D/obj.m) * obj.vf2*Math.cos( obj.vf_ang );  
  }

    obj.accelY = -gravity -(obj.D/obj.m) * obj.vf2*Math.sin( obj.vf_ang );

 // console.log ( obj.accelX );
}





  
