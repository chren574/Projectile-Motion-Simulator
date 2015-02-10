
var LIB={
  distX: function(v, ball_angle, time){
	  
	  //Calculate trajetory with gravity
	  x = v * Math.cos(ball_angle*Math.PI/180) * time;
	  
	  return(x)
  },
  
  distY: function(v, ball_angle, time, gravity){
	  
	  //Calculate trajetory with gravity
	  y = v * Math.sin(ball_angle*Math.PI/180) * time - (gravity * Math.pow(time,2) * 0.5);
	  
	  return(y)
  }
};