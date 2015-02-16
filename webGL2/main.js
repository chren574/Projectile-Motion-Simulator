// set the scene size
var WIDTH = 1000,
    HEIGHT = 600;

// set some camera attributes
var VIEW_ANGLE = 75,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 1,
  FAR = 10000;

var camera, scene, renderer;
var geometry, material, mesh;
var running;

//Start varibles
var velocity = 60;
var time = 0;
var time_old = 5;
var ball_angle = 70;
var gravity = 9.8;
var radius = 1.5;

<<<<<<< HEAD
//init();
=======
init();
>>>>>>> 7b8ca1ebe709780a7c065ef4c88dd70cdcd28159
//animate();

function update() {

  window.alert("nej jag gor ingenting");

}
function launch() {

  //window.alert("asdasd");
  running = true;
  animate();

}
function clearish() {
  //window.alert("asdasdasdd");

}
function init() {
  // get the DOM element to attach to
  var container = document.getElementById("container");

  // create a WebGL renderer, camera
  renderer = new THREE.WebGLRenderer();

  // create camera and a scene
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT , NEAR, FAR);
  scene = new THREE.Scene();

  // add the camera to the scene
  scene.add(camera);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 200;

  // start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  container.appendChild(renderer.domElement);

  //Plane geometry and material
  var geometry = new THREE.PlaneGeometry( 5000, 1, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  scene.add( plane );

  //Ball geometry and material
  //var radius = 5;
  var segments = 32;
  var circleGeometry = new THREE.CircleGeometry( radius, segments );


  var material = new THREE.MeshBasicMaterial({
  color: 0x0000ff
  });

  //Add ball to scene
  ball  = new THREE.Mesh(circleGeometry, material)
  scene.add(ball);

  renderer.render(scene, camera);
  //requestAnimationFrame(render);

}

function animate() {
  requestAnimationFrame(animate);

<<<<<<< HEAD
  //Sätter nya variabler beroende på input
  if(running == true) {
  // window.alert("asda");
=======
//Sätter nya variabler beroende på input
  
  if(running == true)
  {
   // window.alert("asda");
>>>>>>> 7b8ca1ebe709780a7c065ef4c88dd70cdcd28159

    var initialVelocity = document.getElementById("initialVelocity").value;
    velocity = parseFloat(initialVelocity);
    var angle = document.getElementById("angle").value;
    ball_angle = parseFloat(angle);

  
    //*************************************************\\
    /*
      //väldigtväldigt fult men duger i krig 

  size = document.getElementById("size").value;
  radius = parseFloat(size);
  var segments = 32;

  var circleGeometry = new THREE.CircleGeometry( radius, segments );
    var material = new THREE.MeshBasicMaterial({
  color: 0x0000ff
  });

  //Add ball to scene
  ball  = new THREE.Mesh(circleGeometry, material);
  scene.add(ball);*/


  //*************************************************\\    

    running = false;
  }
/*
  cube.rotation.y += parseFloat(initialVelocity);
  cube.scale.x = parseFloat(size);
  cube.scale.y = parseFloat(size);
  cube.scale.z = parseFloat(size);*/

  ball.position.x = LIB.distX(velocity,ball_angle,time) -160;
  ball.position.y = LIB.distY(velocity,ball_angle,time, gravity);

  x = ball.position.x;
  y = ball.position.y;

  if(time_old == 5) {  
    var circle = ball.clone();
    circle.position.set(x, y, 0);
    scene.add(circle);
    time_old = 0;
  }

  if (y <= -0.01) {
    time =0;
    time_old = 5;
    //kör oändligt om velocity inte sätts till 0
    velocity = 0;
    cancelRequestAnimationFrame(animate);
//--oklart om de ska sättas till 0, spelar ingen större roll--\\
   //x = 0;
   //y = 0;
   // ball.position.x = 0;
   // ball.position.y = 0;
  }

  time_old = time_old + 1;
  time = time + 0.05;

  renderer.render(scene, camera);
}     