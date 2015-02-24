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

//Start varibles
//var velocity = 40;
//var velocity_wind = 10;
var time_old = 0;
//var ball_angle = 70;
//var wind_angle = 70;
var gravity = 9.8;
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
          velocity--;
          document.getElementById("initialVelocity").value=velocity;
          break;
      case 38:
          // up key pressed
          ball_angle++;
          document.getElementById("angle").value=ball_angle;
          break;
      case 39:
          // right key pressed
          velocity++;
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

  var initialVelocity = document.getElementById("initialVelocity").value;
  velocity = parseFloat(initialVelocity);

  var initialVelocity_wind = document.getElementById("initialVelocity_wind").value;
  velocity_wind = parseFloat(initialVelocity_wind);

  var angle = document.getElementById("angle").value;
  ball_angle = parseFloat(angle);

  var angle_wind = document.getElementById("angle_wind").value;
  wind_angle = parseFloat(angle_wind);

  var radius = document.getElementById("ballSize").value;
  radius = parseFloat(radius);

  var ballMass = document.getElementById("ballMass").value;
  mass = parseFloat(ballMass);

  createBall(velocity, radius, angle);
  animate();

  }


}
function clearish() {

  running = false;
  cancelAnimationFrame(id);

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

  renderer.render(scene, camera);
  //requestAnimationFrame(render);

}

function createBall (velocity, radius, angle) {

  // funktion som ska slumpa fram en random hexadecimal färg
  var newColor = function getRandomColor() {
    var letters = '0123456789abcdef'.split('');
    var color = '0x';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    console.log(color);
    return color;
  }

/*
  ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('textures/ball.jpg'),
    specular: new THREE.Color('grey')      })
);
*/
/*
  var ball1 = {
    velocity: 20, 
    angle: 45,
    time : 0,
    radius : 10,

    printVelocity: function () {
      return this.velocity;
    },
    changeVelocity: function () {
      this.velocity += 5;
    }
                  
  }
*/

  var spheregeometry = new THREE.SphereGeometry( radius , 32, 32 );
  
  var material = new THREE.MeshPhongMaterial({
  color : 0x0033ff
  //color : newColor()  //om slumpfärg ska användas
  });

  ball = new THREE.Mesh(spheregeometry, material);
  

  //ball.__proto__ = ball1

  
  ball.position.y = 0 + radius;
  ball.time = 0;
  ball.velocity = velocity;
  ball.angle = angle;
  ball.radius = radius;
  

/*
  ball.toSt = function () {
        return this.angle;
  };*/
  
  scene.add(ball);
  canonBallArray.push(ball);


  renderer.render(scene, camera);
}

function animate() {

  running = true;
  id = requestAnimationFrame(animate);
  render();
  stats.update();
}
function render() {
  if(time_old == 2) {  
    var point = dot.clone();
    point.position.set( ball.position.x, ball.position.y, 0 )
    scene.add ( point );
      pointArray.push(point);

     // window.alert(pointArray.length);
    time_old = 0;
   }

  // myString = ball.toSt();
  // console.log(myString);

  var deltaT = 0.1;

  //ball.position.x = LIB.distX(ball.velocity, ball.angle, ball.time) - 160;
  //ball.position.y = LIB.distY(ball.velocity, ball.angle, ball.time, gravity) + ball.radius;


  console.log(ball.position.x + " " + ball.position.y);
  ball.position.x = LIB.distX_vind(ball.position.x, ball.velocity, ball.angle, ball.time, wind_angle, velocity_wind, radius, mass) - 160;
  ball.position.y = LIB.distY_vind(ball.position.y, ball.velocity, ball.angle, ball.time, gravity, wind_angle, velocity_wind, radius, mass) + ball.radius;

  //console.log(ball.time)


  if ( (ball.position.y - ball.radius ) < 0) {
    cancelAnimationFrame(id);
    running = false;
  }

  time_old += 1;
  ball.time += 0.01;

  renderer.render(scene, camera);

}




  

