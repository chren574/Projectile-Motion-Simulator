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



function update() {

  //window.alert("nej jag gor ingenting");

}
function launch() {

  //window.alert("asdasd");
  running = true;
  time = 0;
  velocity = 30;
  animate();

}
function clearish() {
  //window.alert("asdasdasdd");

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
  camera.position.z = 200;

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



  //------------------------------------------------------
  // GEOMETRY

  // most objects displayed are a "mesh":
  // a collection of points ("geometry") and
  // a set of surface parameters ("material") 

  //Plane geometry and material
  var geometry = new THREE.PlaneGeometry( 5000, 1, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  scene.add( plane );

  //Ball geometry and material

  var spheregeometry = new THREE.SphereGeometry( 5, 32, 32 );

  var material = new THREE.MeshBasicMaterial({
  color: 0x0000ff
  });
  
  ball  = new THREE.Mesh(spheregeometry, material);
  scene.add(ball);

  renderer.render(scene, camera);
  //requestAnimationFrame(render);

}
function animate() {

  requestAnimationFrame(animate);
  render();
  stats.update();
}
function render() {

  //ball.position.x += 0.5;

  ball.position.x = LIB.distX(velocity, ball_angle, time) - 160;
  ball.position.y = LIB.distY(velocity, ball_angle, time, gravity);

  time = time + 0.05;
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

 
