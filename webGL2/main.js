var WIDTH = 1000,
    HEIGHT = 600;

var camera, scene, renderer;
var geometry, material, mesh;

//Start varibles
var velocity = 60;
var time = 0;
var time_old = 5;
var ball_angle = 70;
var gravity = 9.8;
var radius = 1.5;

//init();
animate();

function init() {

  var container = document.getElementById("container");

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  container.appendChild(renderer.domElement);


  camera = new THREE.PerspectiveCamera(75, WIDTH /HEIGHT , 1, 10000);
  scene = new THREE.Scene();

  scene.add(camera);
  camera.position.z = 200;

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
  ball  = new THREE.Mesh(circleGeometry, material);
  scene.add(ball);

  //requestAnimationFrame(render);

}

function animate() {

  requestAnimationFrame(animate);

/*  var initialVelocity = document.getElementById("initialVelocity").value;
  var size = document.getElementById("size").value;

  cube.rotation.y += parseFloat(initialVelocity);
  cube.scale.x = parseFloat(size);
  cube.scale.y = parseFloat(size);
  cube.scale.z = parseFloat(size);*/

  ball.position.x = LIB.distX(velocity,ball_angle,time) -120;
  ball.position.y = LIB.distY(velocity,ball_angle,time, gravity);

  x = ball.position.x;
  y = ball.position.y;

  if(time_old == 5){  
    var circle = ball.clone();
    circle.position.set(x, y, 0);
    scene.add(circle);
    time_old = 0;
  }

  if (y <= -1)
  {
    cancelRequestAnimationFrame(animate);
  }

  time_old = time_old + 1;
  time = time + 0.05;

  renderer.render(scene, camera);

}
      