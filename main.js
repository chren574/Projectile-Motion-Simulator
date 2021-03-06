//console.log("---> we are on top of main.js ");

var camera, scene, renderer, stats;
var geometry, material, mesh;
var running = false;

// Materials skrivet som JSON -- JavaScript Object Notation.
// Density, bounce property and texture location.
var Materials = {
    "Golf": { density: 1184, ballMaterial: 0.858, radius: 0.021, ballTexture: "images/golf.png" },
    "Tennis": { density: 400, ballMaterial: 0.712, radius: 0.035, ballTexture: "images/tennis.png" },
    "Billiard": { density: 1700, ballMaterial: 0.804, radius: 0.027, ballTexture: "images/billiard.jpg" },
    "Wooden": { density: 690, ballMaterial: 0.603, radius: 0.03, ballTexture: "images/wood.jpg" },
    "Steel": { density: 7820, ballMaterial: 0.597, radius: 0.03, ballTexture: "images/steel.jpg" },
    "Glas": { density: 2500, ballMaterial: 0.658, radius: 0.03, ballTexture: "images/glas.jpg" }
};

// The ball object that hold all the parameters
var BALL_OBJ = {
    initialVelocity: 0,
    initialAngle: 0,
    initialVelocity_wind: 0,
    initialAngle_wind: 0,
    radius: 0,
    chosenMaterial: "",
    sceneRadius: function() {
        if (this.radius > 0) {
            return this.radius * 100;
        } else {
            return 10;
        }
    },
};

var GRAVITY = 9.82;
var AIR_DENSITY = 1.2754;

arrowHelper = 0;

//Start varibles
var dotTimer = 0;
var canonBallArray = [];
var pointArray = [];

window.addEventListener("click", keyPress, false);

// Keybindings
function keyPress(e) {
    switch (e.keyCode) {
        case 32:
            launch();
            break;
        case 37:
            // left key pressed
            initialVelocity--;
            document.getElementById("initialVelocity").value = velocity;
            break;
        case 38:
            // up key pressed
            ball_angle++;
            document.getElementById("angle").value = ball_angle;
            break;
        case 39:
            // right key pressed
            initialVelocity++;
            document.getElementById("initialVelocity").value = velocity;
            break;
        case 40:
            // down key pressed
            ball_angle--;
            document.getElementById("angle").value = ball_angle;
            break;
        case 65:
            camera.position.set(-300, 300, 0);
            camera.up = new THREE.Vector3(1, 0, 0);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            break;
    }
}

/**
 * Sets the ball in motion
 */
function launch() {
    //console.log("---> launch() is called ");

    // check if there is a ball in the air.
    if (!running) {

        if (!windCheck.checked) {
            scene.remove(arrowHelper);
        }

        reloadSettings();
        running = true;

        // start the time and the animation
        t = new Date().getTime();
        animate();
    }
}

/**
 * Remove all the objects from the screen
 * NOTE: Could not use "clear()" becasue another function is already using it.
 * Not the best name 
 */
function clearish() {
    //console.log("---> clearish() is called ");

    running = false;
    cancelAnimationFrame(animationId);

    scene.remove(arrowHelper);

    var obj, ob, i, j;

    // Remove the balls
    for (i = canonBallArray.length - 1; i >= 0; i--) {
        obj = canonBallArray[i];

        scene.remove(obj);
        delete canonBallArray[i];
    }

    // Remove the wind-arrows
    for (j = pointArray.length - 1; j >= 0; j--) {
        ob = pointArray[j]
        scene.remove(ob);
        delete pointArray[i];
    }

    // Set up a new default scene
    createBall();
    renderer.render(scene, camera);
}

/**
 * Shows a arrow the the direction of the wind
 */
function showWind() {
    //console.log("---> showWind() is called ");

    document.getElementById("windsettings").style.display = windCheck.checked ? "block" : "none";
}

/**
 * function called when the browser is loaded
 */
function init() {
    //console.log("---> init() is called ");

    //parse the parameters from the browser
    setupParameters();
    //seup the scene in three js
    setupScene();
}

/**
 * take the parameters in the settings
 */
function setupParameters() {
    //console.log("---> setupParameters() is called ");

    //parse the velocities
    BALL_OBJ.initialVelocity = parseFloat(document.getElementById("initialVelocity").value);
    BALL_OBJ.initialVelocity_wind = parseFloat(document.getElementById("initialVelocity_wind").value);

    // Parse the angles
    var angle = document.getElementById("angle").value;
    BALL_OBJ.initialAngle = parseFloat(angle * Math.PI / 180);

    var angle_wind = document.getElementById("angle_wind").value;
    BALL_OBJ.Angle_wind = parseFloat((angle_wind) * Math.PI / 180) + Math.PI;

    // Parse the material
    // Material - this is a string.
    BALL_OBJ.chosenMaterial = document.getElementById("material").value;

    /*
    // DO NOT DELETE! --> this is used for Error handling --> DO NOT DELETE!
    /*
    console.log("BALL_OBJ.initialVelocity     : " + BALL_OBJ.initialVelocity);
    console.log("BALL_OBJ.initialVelocity_wind: " + BALL_OBJ.initialVelocity_wind);
    console.log("BALL_OBJ.initialAngle        : " + BALL_OBJ.Angle);
    console.log("BALL_OBJ.initialAngle_wind   : " + BALL_OBJ.Angle_wind);
    console.log("BALL_OBJ.radius              : " + BALL_OBJ.radius);
    console.log("BALL_OBJ.chosenMaterial      : " + BALL_OBJ.chosenMaterial);
    console.log("---------------------" );
    console.log("BALL_OBJ.sceneRadius      : " + BALL_OBJ.sceneRadius() );
    */
}

/**
 * Setup the scene and render it
 * 
 */
function setupScene() {
    //console.log("---> setupScene() is called ");

    //------------------------------------------------------
    // SCENE 

    scene = new THREE.Scene();

    var container = document.getElementById("container");

    WIDTH = container.offsetWidth,
        HEIGHT = container.offsetHeight;

    VIEW_ANGLE = 75,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 1000;

    // CAMERA
    // create camera and a scene
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

    // add the camera to the scene
    scene.add(camera);

    // the camera starts at 0,0,0
    // so pull it back
    camera.position.z = 250;
    camera.position.y = 75;

    //------------------------------------------------------
    // RENDERER

    // create a WebGL renderer, camera
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x00000, 1);

    // start the renderer
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    // attach the render-supplied DOM element
    container.appendChild(renderer.domElement);

    //------------------------------------------------------
    // STATS 

    // displays current and past frames per second attained by scene
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '14px';
    stats.domElement.style.zIndex = 100;

    container.appendChild(stats.domElement);

    //------------------------------------------------------
    // LIGHT

    var greenPoint = new THREE.PointLight(0x404040, 3, 500);
    greenPoint.position.set(0, 150, 70);
    scene.add(greenPoint);

    var ambient = new THREE.AmbientLight(0x404040)
    scene.add(ambient);

    //------------------------------------------------------
    // GEOMETRY

    // create the ball 
    createBall();

    //Dots to visulase the projection
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({ size: 3, sizeAttenuation: false });
    dot = new THREE.Points(dotGeometry, dotMaterial);
    pointArray.push(dot);

    //Plane geometry and material
    planeWidth = 500;
    var geometry = new THREE.BoxGeometry(planeWidth, 300, 100);
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    var plane = new THREE.Mesh(geometry, material);

    plane.rotation.x = Math.PI / 2;
    plane.position.y = -50;
    scene.add(plane);

    // Wind arrow
    if (windCheck.checked == true) {
        windArrow();
        scene.add(arrowHelper);
    }

    //render the scene
    renderer.render(scene, camera);
}

/**
 * Update the texture of the ball
 */
function updateBall(newMaterial) {

    var ballTexture = Materials[newMaterial.value].ballTexture;
    img.src = ballTexture;

    //render the new ball thats been added
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
    cancelAnimationFrame(animationId);
}

/**
 * Reload the settings from the browser 
 * 
 */
function reloadSettings() {

    //maybe done twice but for safety
    setupParameters();

    ball.angle = BALL_OBJ.initialAngle;
    ball.radius = Materials[BALL_OBJ.chosenMaterial].radius;
    ball.sceneRadius = BALL_OBJ.sceneRadius();

    ball.velocityX = BALL_OBJ.initialVelocity * Math.cos(ball.angle);
    ball.velocityY = BALL_OBJ.initialVelocity * Math.sin(ball.angle);

    ball.accelX = 0;
    ball.accelY = -GRAVITY;

    ball.vf2 = 0;
    ball.vf_ang = 0;

    ball.velocity_wind = BALL_OBJ.initialVelocity_wind;
    ball.Uang = BALL_OBJ.Angle_wind;

    ball.density = Materials[BALL_OBJ.chosenMaterial].density;
    ball.bmaterial = Materials[BALL_OBJ.chosenMaterial].ballMaterial;

    // Drag parameters
    ball.area = Math.PI * Math.pow(ball.radius, 2);
    ball.mass = ball.density * 0.75 * Math.PI * Math.pow(ball.radius, 3);
    var dragFactor = 0.5;
    ball.D = ((AIR_DENSITY * dragFactor * ball.area) / 2);

    // DO NOT DELETE! --> this is used for Error handling --> DO NOT DELETE!
    /*
    console.log("ball.angle         : " + ball.angle);
    console.log("ball.radius        : " + ball.radius);
    console.log("ball.sceneRadius   : " + ball.sceneRadius);
    console.log("ball.angle         : " + ball.angle );
    console.log("ball.velocityX     : " + ball.velocityX);
    console.log("ball.velocityY     : " + ball.velocityY);
    console.log("ball.accelX        : " + ball.accelX);
    console.log("ball.accelY        : " + ball.accelY);
    console.log("ball.vf2           : " + ball.vf2);
    console.log("ball.vf_ang        : " + ball.vf_ang);
    console.log("ball.velocity_wind : " + ball.velocity_wind);
    console.log("ball.Uang          : " + ball.Uang);
    console.log("ball.density       : " + ball.density);
    console.log("ball.bmaterial     : " + ball.bmaterial);
    console.log("ball.area          : " + ball.area);
    console.log("ball.mass          : " + ball.mass);
    console.log("ball.D             : " + ball.D);
    console.log("ball.D/ball.mass   : " + (ball.D/ball.mass));
    */

    if (windCheck.checked == true) {
        scene.remove(arrowHelper);
        windArrow();
    }
}

/**
 * Create the ball
 */
function createBall() {
    //console.log("---> createBall() is called ");

    var setRadius = BALL_OBJ.sceneRadius();

    var sphereGeom = new THREE.SphereGeometry(setRadius, 32, 32);

    // basic texture
    var ballTexture = Materials[BALL_OBJ.chosenMaterial].ballTexture;

    // Updates the texture of the ball when a new type is chosen
    // Currently a bug which
    // The texture updates on the next lunch
    img = new Image();
    texture = new THREE.Texture(img);
    img.onload = function() { texture.needsUpdate = true; };
    img.src = ballTexture;
    texture.needsUpdate = true;
    
    var loader = new THREE.TextureLoader();
    // Load texture
    var Texture = loader.load(ballTexture, {}, function() {
        renderer.render(scene, camera);
    });

    var Material = new THREE.MeshBasicMaterial({ map: texture });

    ball = new THREE.Mesh(sphereGeom, Material);

    // Default starting position
    ball.position.x = -220;
    ball.position.y = 0 + BALL_OBJ.sceneRadius();

    //add the ball to the scene
    scene.add(ball);

    // Add the ball to the list with all the balls
    canonBallArray.push(ball);

    // Drew the wind arrow if enabled
    if (windCheck.checked == true) {
        windArrow();
    }

    //render the new ball thats been added
    renderer.render(scene, camera);
}

/**
 * Animation loop.
 */
function animate() {
    //console.log("---> animate() is called ");

    animationId = requestAnimationFrame(animate);

    render();
    stats.update();
}

/**
 * Rendering loop.
 */
function render() {

    // Calculate the delta time.
    var dt = (new Date().getTime() - t) / 200; //1000 default
    t = new Date().getTime(); //reset t  

    calculateVelocitiesWind(ball);

    updateAccelWind(ball)

    updateVelocity(ball, dt);

    updatePosition(ball, dt);

    checkCollision(ball);

    drawBallShadow();

    renderer.render(scene, camera);
}

/**
 * Cancel the current rendering.
 */
function stopRender() {
    //stop rendering the current ball and create a new one.
    cancelAnimationFrame(animationId);
    createBall();
    running = false;
}

/**
 * Draws the dot after the ball
 */
function drawBallShadow() {

    // Will only be drawn every 5th iteration 
    if (dotTimer == 5) {
        var point = dot.clone();
        point.position.set(ball.position.x, ball.position.y, 0)
        scene.add(point);
        pointArray.push(point);

        dotTimer = 0;
    }
    dotTimer += 1;
}

/**
 * Calculate the new velocity of each component.
 */
function updateVelocity(obj, dt) {
    obj.velocityX = obj.velocityX + obj.accelX * dt;
    obj.velocityY = obj.velocityY + obj.accelY * dt;
}

/**
 * Calculate the new positon based on the velocity and acceleration.
 */
function updatePosition(obj, dt) {
    obj.position.x += obj.velocityX * dt + (obj.accelX * Math.pow(dt, 2) * 0.5);
    obj.position.y += obj.velocityY * dt + (obj.accelY * Math.pow(dt, 2) * 0.5);

}

/**
 * Calculate the wind velocity.
 * 
 */
function calculateVelocitiesWind(obj) {

    obj.vf2 = (Math.pow((obj.velocityX + (obj.velocity_wind) * Math.cos(obj.Uang)), 2) + Math.pow((obj.velocityY + obj.velocity_wind * Math.sin(obj.Uang)), 2));
    obj.vf_ang = Math.atan(Math.abs((obj.velocityY + (obj.velocity_wind) * Math.sin(obj.Uang)) / (obj.velocityX + obj.velocity_wind * Math.cos(obj.Uang))));
}

/**
 * Calculate the new wind acceleration.
 */
function updateAccelWind(obj) {

    // If cos(alpha) is even
    if ((obj.velocityX + (obj.velocity_wind) * Math.cos(obj.Uang)) > 0) {
        obj.accelX = -(obj.D / obj.mass) * obj.vf2 * Math.cos(obj.vf_ang);
    } else {
        obj.accelX = +(obj.D / obj.mass) * obj.vf2 * Math.cos(obj.vf_ang);
    }

    // If sin(alpha) is even
    if ((obj.velocityY + (obj.velocity_wind) * Math.sin(obj.Uang)) > 0) {
        obj.accelY = -GRAVITY - (obj.D / obj.mass) * obj.vf2 * Math.sin(obj.vf_ang);
    } else {
        obj.accelY = -GRAVITY + (obj.D / obj.mass) * obj.vf2 * Math.sin(obj.vf_ang);
    }
}

/**
 * check if the ball hits the ground 
 */
function checkCollision(obj) {

    // check if the ball hit the ground 
    if (obj.velocityY < 0) {

        // reverse the sign of the velocity in y-direction if when it need to bounce
        if ((obj.position.y - obj.sceneRadius) < 0 && obj.position.y > 0) {

            obj.velocityY = -obj.velocityY * obj.bmaterial;
            obj.velocityX = obj.velocityX * obj.bmaterial;

            // check if the total velocity is to low for a bounce. the number 5 need to be checked
            // could be nice to just check the velocity in one direction also like || abs(obj.velocityX) < 2 || abs(obj.velocityY) 
            if ((Math.sqrt(Math.pow((obj.velocityX), 2) + Math.pow((obj.velocityY), 2)) < 7)) {
                stopRender();
            }
        }
    }
}


/**
 * Update the posistion runge-kuta
 * Converted from Python version: http://doswa.com/2009/01/02/fourth-order-runge-kutta-numerical-integration.html
 * javascript: http://mtdevans.com/2013/05/fourth-order-runge-kutta-algorithm-in-javascript-with-demo/
 */
function rk4(obj, dt) {

    // Returns final (position, velocity) array after time dt has passed.
    //        x: initial position
    //        v: initial velocity
    //        a: acceleration function a(x,v,dt) (must be callable)
    //        dt: timestep

    var x1 = obj.position.y;
    var v1 = obj.velocityY;
    var a1 = a(x1, v1, 0);

    var x2 = x + 0.5 * v1 * dt;
    var v2 = v + 0.5 * a1 * dt;
    var a2 = a(x2, v2, dt / 2);

    var x3 = x + 0.5 * v2 * dt;
    var v3 = v + 0.5 * a2 * dt;
    var a3 = a(x3, v3, dt / 2);

    var x4 = x + v3 * dt;
    var v4 = v + a3 * dt;
    var a4 = a(x4, v4, dt);

    var xf = x + (dt / 6) * (v1 + 2 * v2 + 2 * v3 + v4);
    var vf = v + (dt / 6) * (a1 + 2 * a2 + 2 * a3 + a4);

    return [xf, vf];
}

/**
 * Draw the wind arrow to the scene
 */
function windArrow() {
    var local_wind_angle = BALL_OBJ.Angle_wind;

    dir = new THREE.Vector3(-Math.cos(local_wind_angle), -Math.sin(local_wind_angle), 0);
    origin = new THREE.Vector3(200, 225, 0);
    hex = 0xffff00;
    arrowHelper = new THREE.ArrowHelper(dir, origin, 50, hex, 15, 15);

    scene.add(arrowHelper);
}
