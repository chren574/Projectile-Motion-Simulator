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
var time_old = 0;
var ball_angle = 70;
var gravity = 9.8;
var radius = 1.5;

cannonBallArray = [];

window.addEventListener("keydown", keyPress, false);

function keyPress(e) {
 if (e.keyCode == "32") {
        launch();
    }
}

function launch() {

  var initialVelocity = document.getElementById("initialVelocity").value;
  velocity = parseFloat(initialVelocity);

  var angle = document.getElementById("angle").value;
  ball_angle = parseFloat(angle);

  var radius = document.getElementById("ballSize").value;
  radius = parseFloat(radius);

  running = true;
  createBall(velocity, radius, angle);
  animate();

}
function clearish() {
  
  var obj, i;

  for ( i = scene.children.length - 1; i >= 0 ; i -- ) {
    obj = scene.children[ i ];
      
      if ( obj === ball ) {
        scene.remove(obj);
      }
    }
  
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

  //Dots
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
  var dotMaterial = new THREE.PointCloudMaterial( { size: 3, sizeAttenuation: false } );
  dot = new THREE.PointCloud( dotGeometry, dotMaterial );

  //Plane geometry and material
  var geometry = new THREE.PlaneGeometry( 500, 300, 20 );
  var material = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
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

  ball  = new THREE.Mesh(spheregeometry, material);
  ball.position.y = 10;
  ball.time = 0;
  ball.velocity = velocity;
  ball.angle = angle;
  
  scene.add(ball);
  cannonBallArray.push(ball);


  renderer.render(scene, camera);
}

function animate() {

  id = requestAnimationFrame(animate);
  render();
  stats.update();
}
function render() {

  if(time_old == 2) {  
    var point = dot.clone();
    point.position.set( ball.position.x, ball.position.y, 0 )
    scene.add ( point );

    time_old = 0;
   }

  ball.position.x = LIB.distX(ball.velocity, ball.angle, ball.time) - 160;
  ball.position.y = LIB.distY(ball.velocity, ball.angle, ball.time, gravity);


  if (y < 0) {
    cancelAnimationFrame(id);
  }

  time_old += 1;
  ball.time += 0.05;

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

  

