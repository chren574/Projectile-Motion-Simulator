var camera, scene, renderer;
var geometry, material, mesh;

//Start varibles
var velocity = 5;
var time = 0;
var steg = 0.05;
var time_old = 5;
var ball_angle = 70;
var gravity = 9.82;
var radius = 1.5;
var density = 1.2;
var mass = 1;
var drag_constant = 0.5;

var vX_old = 0;
var vY_old = 0;

var posX_old = 0;
var posY_old = 0;

var vX = velocity * Math.cos(ball_angle*Math.PI/180);
var vY = velocity * Math.sin(ball_angle * Math.PI / 180);

var Area = Math.pow(radius, 2) * Math.PI;
var D = (density * drag_constant * Area) / 2;

var aX = - (D / mass) * Math.sqrt(Math.pow(vX, 2) + Math.pow(vY, 2)) * vX;
var aY = -gravity - (D / mass) * Math.sqrt(Math.pow(vX, 2) + Math.pow(vY, 2)) * vY;

var aX_old = aX;
var aY_old = aY;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;

    scene = new THREE.Scene();
	
	//Plane geometry and material
	var geometry = new THREE.PlaneGeometry( 5000, 1, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );
	
	//Ball geometry and material
	var segments = 32;
	var circleGeometry = new THREE.CircleGeometry( radius, segments );
	var materialBall = new THREE.MeshBasicMaterial({
	color: "rgb(255,0,0)"
	});
	
	//Add ball to scene
    ball = new THREE.Mesh(circleGeometry, materialBall);
    scene.add(ball);
	
	//Drag ball material
	var materialDrag = new THREE.MeshBasicMaterial({
	color: "rgb(0,0,255)"
	});
	
	//Add drag ball to scene
    drag = new THREE.Mesh(circleGeometry, materialDrag);
    scene.add(drag);
	drag.position.x = -120;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement)
}

function animate() {

    requestAnimationFrame(animate);
	
    //posX_old = drag.position.x;
    //posY_old = drag.position.y;
	
    ball.position.x = LIB.distXgravity(velocity,ball_angle,time) -120;
    ball.position.y = LIB.distYgravity(velocity, ball_angle, time, gravity);

    vX_old = vX;
    vY_old = vY;

    aX_old = aX;
    aY_old = aY;
	
    vX = LIB.velocX(vX_old, steg, aX_old);
    vY = LIB.velocY(vY_old, steg, aY_old);
	
    drag.position.x +=LIB.distX(vX_old, vY_old, steg, aX, aY);
    drag.position.y += LIB.distY(vX_old, vY_old, steg, aX, aY) - 5;

    aX = LIB.accelX(vX_old, vY_old, radius, mass, density, drag_constant);
    aY = LIB.accelY(vX_old, vY_old, gravity, radius, mass, density, drag_constant);
    
	
	//Trace the ball's trajectory
	if(time_old == 5){	
		var circleBall = ball.clone();
		circleBall.position.set(ball.position.x, ball.position.y, 0);
		scene.add(circleBall);

		var circleDrag = drag.clone();
		circleDrag.position.set(drag.position.x, drag.position.y, 0);
		scene.add(circleDrag);
		
		time_old = 0;
	}
	
	//Cancel if ball goes below plane
	if (ball.position.y < 0)
	{
		cancelRequestAnimationFrame(animate);
	}
	
	time_old = time_old + 1;
	time = time + steg;
	
    renderer.render(scene, camera);

}