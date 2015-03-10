function [ uprime ] = f_runge_vind( t, v )
% input parameters
% u = [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)]) 
% output parameters
% uprime = [vx ; ax ;vy ; ay])
    
    uprime=zeros(4,1);
    
    %todo 
    % Konstanter
    m = 0.145;               % Massa m [kg]
    g = 9.82;                % Tyngdacceleration g [m/s^2]    
    % Konstanter luftmotstand
    r = 0.0366;               % Radie r [m]
    A = r^2*pi;             % Arean A [m^2]
    C = 0.5;
    p = 1.2;                % Densiteten p []
    D = (p*C*A)/2;
    % Parametrar vind
    U = 10;
    wind_angle = 0;                % Vinkel  [grader]
    Uang = wind_angle*pi/180;      % Vinkel  [radianer]
    
    % Calculation wind
    vf2 =  (v(2) + U*cos(Uang))^2 + (v(3) + U*sin(Uang))^2 ;    
    vf_ang = atan( abs ((v(3) + U*sin(Uang))/ (v(2) + U*cos(Uang)) ) );
        
    % Hastighet x
    uprime(1)= v(2);
    % Acceleration x
    %var1 uprime(2)= (D*u(2)*(sqrt(u(2)^2+u(4)^2)))/m;
    uprime(2)= -(D/m)*vf2*cos(vf_ang);
    % Hastighet y
    uprime(3)= v(4);
    % Acceleration y
    %var1 uprime(4)= (D*u(2)*(sqrt(u(2)^2+u(4)^2))-(m*g))/m;
    uprime(4)= -g -(D/m)*vf2*sin(vf_ang);


end

