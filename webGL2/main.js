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
var running;

//Start varibles
var velocity = 40;
var time = 0;
var time_old = 5;
var ball_angle = 70;
var gravity = 9.8;
var radius = 1.5;

//init();
//animate();

cannonBallArray = [];

// var testBoll = {
//   mass : 100,
//   velocity : 2000
// };

function launch() {


  var initialVelocity = document.getElementById("initialVelocity").value;
  velocity = parseFloat(initialVelocity);

  var angle = document.getElementById("angle").value;
  ball_angle = parseFloat(angle);

  var radius = document.getElementById("ballSize").value;
  radius = parseFloat(radius);

  running = true;
  //time = 0;
  //velocity = 40;
  createBall(velocity, radius, angle);
  animate();

}
function clearish() {

  cannonBallArray = [];
  
  

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
  renderer = new THREE.WebGLRenderer();
  
  // get the DOM element to attach to
  var container = document.getElementById("container");
  
  // start the renderer
  //renderer.setSize(WIDTH, HEIGHT);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  // attach the render-supplied DOM element
  container.appendChild( renderer.domElement );

  // renderer.setSize(container.offsetWidth, container.offsetHeight);
  // container.appendChild(renderer.domElement);

  // var HEIGHT = document.getElementById('container').clientHeight;
  // var WIDTH = document.getElementById('container').clientWidth;

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
   
  var greenPoint = new THREE.PointLight(0x33ff00, 1, 500);
  greenPoint.position.set( 0, 150, 70 );
  scene.add(greenPoint);
  scene.add(new THREE.PointLightHelper(greenPoint, 3));


  var ambient = new THREE.AmbientLight( 0x404040 )
  scene.add ( ambient );

  //------------------------------------------------------
  // GEOMETRY

  // most objects displayed are a "mesh":
  // a collection of points ("geometry") and
  // a set of surface parameters ("material") 

  //Plane geometry and material
  var geometry = new THREE.PlaneGeometry( 500, 300, 20 );
  var material = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = Math.PI/2;
  scene.add( plane );


  renderer.render(scene, camera);
  //requestAnimationFrame(render);

}

function createBall (velocity, radius, angle) {


  var spheregeometry = new THREE.SphereGeometry( radius , 32, 32 );
  var material = new THREE.MeshPhongMaterial({
  color: 0x0033ff
  });


  //ball = testBoll;
  ball  = new THREE.Mesh(spheregeometry, material);
  ball.position.y = 10;
  ball.time = 0;
  ball.velocity = velocity;
  ball.angle = angle;
  
  scene.add(ball);
  cannonBallArray.push(ball);

}

function animate() {

  id = requestAnimationFrame(animate);
  render();
  stats.update();
}
function render() {

  //ball.position.x += 0.5;

  console.log('hastighet ' + velocity + 'time ' + time);

  ball.position.x = LIB.distX(ball.velocity, ball.angle, ball.time) - 160;
  ball.position.y = LIB.distY(ball.velocity, ball.angle, ball.time, gravity);

  if (y < 0) {
    time = 0;
    //ball.velocity = 0;
    cancelAnimationFrame(id);
  }

  ball.time = ball.time + 0.05;

  renderer.render(scene, camera);
}

/*
function animate() {
  

  requestAnimationFrame(animate);

  //Sätter nya variabler beroende på input
  if( running ) {
  // window.alert("asda");
    var initialVelocity = document.getElementById("initialVelocity").value;
    velocity = parseFloat(initialVelocity);
    
    var angle = document.getElementById("angle").value;
    ball_angle = parseFloat(angle);

    time = 0;

    console.log("The time is set: " + time)

    running = false;
  }

  ball.position.x = LIB.distX(velocity, ball_angle, time) - 160;
  ball.position.y = LIB.distY(velocity, ball_angle, time, gravity);

  x = ball.position.x;
  y = ball.position.y;

//   if(time_old == 5) {  
//     var circle = ball.clone();
//     circle.position.set(x, y, 0);
//     scene.add(circle);
//     time_old = 0;
//   }

//   if (y <= -0.01) {
//     time =0;
//     time_old = 5;
//     //kör oändligt om velocity inte sätts till 0
//     velocity = 0;
//     cancelRequestAnimationFrame(animate);
//    //--oklart om de ska sättas till 0, spelar ingen större roll--\\
//    //x = 0;
//    //y = 0;
//    // ball.position.x = 0;
//    // ball.position.y = 0;
//   }

  time_old = time_old + 1;
  time = time + 0.05;

  stats.update();

  renderer.render(scene, camera);

}    
*/