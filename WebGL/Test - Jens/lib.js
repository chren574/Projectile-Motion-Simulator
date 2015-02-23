
var LIB={
  distXgravity: function(v, ball_angle, time){
	  
	  //Calculate trajectory with gravity
	  x = v * Math.cos(ball_angle*Math.PI/180) * time;
	  
	  return(x)
  },
  
  distYgravity: function(v, ball_angle, time, gravity){
	  
	  //Calculate trajectory with gravity
	  y = v * Math.sin(ball_angle*Math.PI/180) * time - (gravity * Math.pow(time,2) * 0.5);
	  
	  return(y)
  },
  
    //Calculate acceleration X
  accelX: function(vX, vY, radius, mass, density, drag_constant){
	  
	  //Calculate trajectory with gravity
	  var Area = Math.pow(radius,2)*Math.PI;
	  var D = (density * drag_constant * Area)/2;
	  var aX = -(D / mass) * Math.sqrt(Math.pow(vX, 2) + Math.pow(vY, 2)) * vX;
	  
	  return(aX)
  },


  //Calculate acceleration Y
  accelY: function(vX, vY, gravity, radius, mass, density, drag_constant){
	  
	  //Calculate trajectory with gravity
	  var Area = Math.pow(radius,2)*Math.PI;
	  var D = (density * drag_constant * Area)/2;
	  var aY = - gravity -(D/mass)*Math.sqrt(Math.pow(vX,2)+Math.pow(vY,2))*vY;
	  
	  return(aY)
  },
  
    //Calculate velocity X
  velocX: function(vX_old, steg, aX){
	  
	  vX = vX_old + aX*steg 
	  
	  return(vX)
  },
  
    //Calculate velocity Y
  velocY: function(vY_old, steg, aY){
	  
	  vY = vY_old + aY*steg 
	  
	  return(vY)
  },
  
    //Calculate distance X-coordinate
  distX: function(vX_old, vY_old, steg, aX, aY){
	  
	  x = vX_old*steg + 0.5*aX*Math.pow(steg,2); 
	  
	  return(x)
  },
  
    //Calculate distance Y-coordinate
  distY: function(vX_old, vY_old, steg, aX, aY){
	  
	  y = vY_old*steg + 0.5*aY*Math.pow(steg,2); 
	  
	  return(y)
  }
};