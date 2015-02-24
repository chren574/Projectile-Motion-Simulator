
var LIB = {

  distX : function(v, ball_angle, dt){
	  
	//ax_u = 0;

    // Hastighet
    //vx_u = v * Math.cos( ball_angle * Math.PI / 180 );

    // Position
    //x_u = vx_u *time + 0.5*ax_u*Math.pow(time,2);
   
	//Calculate trajetory with gravity
	x = v * Math.cos( ball_angle * Math.PI / 180 ) * dt;
	  
	return(x)
  },
  
  distY : function(v, ball_angle, dt, gravity){

  	  //var ay_u = -gravity;

  	  //vy_u + 
  	  //var vy_u = v * Math.sin(ball_angle * Math.PI/ 180);
	  //var vy_u = ay_u *time;

	  //y_u + 
	  //var y_u = vy_u*time + 0.5*ay_u*Math.pow(time,2);
	  
	  //Calculate trajetory with gravity
	  y = v * Math.sin(ball_angle * Math.PI/ 180) * dt - ( gravity * Math.pow(dt,2) * 0.5);
	  
	  return(y)
  },

  distX_vind : function(x_pos, v, ball_angle, time, wind_angle, U, r, mass){
	
  	// Constants
  	C = 0.5;
  	p = 0.5;
  	A = Math.PI*Math.pow(r, 2);

	//luftmotstånd parametrar
	var D = (p*C*A)/2;
	var m = mass;

	//vind parametrar  
  	var angle = wind_angle;              //Vinkel  [grader]
	var Uang = (angle*Math.PI / 180);    //Vinkel  [radianer]
  	var U = U;

  	// Hastighet komponenter
    vx_v = v * Math.cos( ball_angle * Math.PI / 180 );
    vy_v = v * Math.sin( ball_angle * Math.PI / 180 );

    // vind 
    vf2 = Math.pow((vx_v + U*Math.cos(Uang)),2) + Math.pow((vy_v + U*Math.sin(Uang)),2);     
    vf_ang = Math.atan((vy_v + U*Math.sin(Uang))/(vx_v + U*Math.cos(Uang))); 
  	
  	// Accelerationen
	ax = -(D/m)*vf2*Math.cos(vf_ang);

    // Hastighet
    vx = v * Math.cos( ball_angle * Math.PI / 180 );

    // Position
    x = vx * time + 0.5*ax*Math.pow(time,2);
     
	return(x)
  },
  
  distY_vind : function(y_pos, v, ball_angle, time, gravity, wind_angle, U, r, mass){

  	// Constants
  	C = 0.5;
  	p = 0.5;
  	A = Math.PI*Math.pow(r, 2);

	//luftmotstånd parametrar
	var D = (p*C*A)/2;
	var m = mass;
	var U = U;
  	
  	//vind parametrar 
  	var angle = wind_angle;              		  //Vinkel  [grader]
	var Uang = (angle*Math.PI / 180);      //Vinkel  [radianer]

	// Hastighet komponenter
	vx_v = v * Math.cos( ball_angle * Math.PI / 180 );
	vy_v = v * Math.sin( ball_angle * Math.PI / 180 );

	// vind
	vf2 = Math.pow((vx_v + U*Math.cos(Uang)),2) + Math.pow((vy_v + U*Math.sin(Uang)),2);     
	vf_ang = Math.atan((vy_v + U*Math.sin(Uang))/(vx_v + U*Math.cos(Uang))); 

  	//accelerationen
	var ay = -gravity -(D/m) * vf2*Math.sin(vf_ang);
	  //var ay = -gravity;

	//vy_u + 
	var vy = v * Math.sin(ball_angle * Math.PI/ 180);
	//var vy_u = ay_u *time;

	//y_u + 
	var y = vy*time + 0.5*ay*Math.pow(time,2);


	return(y)
  },
  
  dist_vind : function(y_pos, v, ball_angle, time, gravity, wind_angle, U, r){

  	// Constants
  	C = 0.5;
  	p = 1.2;
  	A = Math.PI*Math.pow(r, 2);

	//luftmotstånd parametrar
	var D = (p*C*A)/2;
	var m = 0.5;
	var U = U;
  	
  	//vind parametrar 
  	var angle = wind_angle;              		  //Vinkel  [grader]
	var Uang = (angle*Math.PI / 180);      //Vinkel  [radianer]

	vx_v = v * Math.cos( ball_angle * Math.PI / 180 );
	vy_v = v * Math.sin( ball_angle * Math.PI / 180 );

	vf2 = Math.pow(v*Math.cos(ball_angle*Math.PI/180) + U*Math.cos(Uang), 2) + Math.pow(v*Math.sin(ball_angle*Math.PI/180) + U*Math.sin(Uang), 2); 
	vf_ang = Math.atan((vy_v + U*Math.sin(Uang))/(vx_v + U*Math.cos(Uang)));

  	//accelerationen
  	var ax = -(D/m)*vf2*Math.cos(vf_ang);
	var ay = -gravity -(D/m) * vf2*Math.sin(vf_ang);
	  //var ay = -gravity;

	//vy_u + 
	var vx = v * Math.cos( ball_angle * Math.PI / 180 );
	var vy = v * Math.sin(ball_angle * Math.PI/ 180);
	//var vy_u = ay_u *time;

	//y_u + 
	var x = vx * time + 0.5*ax*Math.pow(time,2);
	var y = vy*time + 0.5*ay*Math.pow(time,2);


	return [x, y];
  },

    //Function for linear drag
  distXdrag: function(v, vt, ball_angle, time, gravity) {

    x = (vt / gravity) * (v * Math.cos(ball_angle * Math.PI / 180)) * (1 - Math.exp(-gravity * time / vt));

    return(x)

  },
    //Function for linear drag
  distYdrag: function(v, vt, ball_angle, time, gravity) {

    y = (vt / gravity) * ((v * Math.sin(ball_angle * Math.PI / 180)) + vt) * (1 - Math.exp(-gravity * time / vt)) - vt * time;
  

    return(y)

  }

};