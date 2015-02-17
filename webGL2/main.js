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
var time_old = 5;
var ball_angle = 70;
var gravity = 9.8;
var radius = 1.5;

function launch() {

  running = true;
  time = 0;
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
  var plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = Math.PI/2;
  scene.add( plane );

  //Ball geometry and material
  var spheregeometry = new THREE.SphereGeometry( 15, 32, 32 );
  var material = new THREE.MeshPhongMaterial( {color: 0x0033ff } );
  ball  = new THREE.Mesh(spheregeometry, material);
  ball.position.y = 10;
  scene.add(ball);


  renderer.render(scene, camera);

}
function animate() {

  id = requestAnimationFrame(animate);
  render();
  stats.update();
}
function render() {

  ball.position.x = LIB.distX(velocity, ball_angle, time) - 160;
  ball.position.y = LIB.distY(velocity, ball_angle, time, gravity);

  if(time_old == 30) {  
     var circle = ball.clone();
     circle.position.set(ball.position.x, ball.position.y, 0);
     scene.add(circle);
     time_old = 0;
   }

  time_old = time_old + 1;
  time = time + 0.05;

  if (ball.position.y < 0)
  {
    cancelAnimationFrame( id );
  }

  renderer.render(scene, camera);

/*

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
*/
}

  

