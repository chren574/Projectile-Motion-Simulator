function [ ] = f_alla_euler( len,deltaT,g, vx, vy, vx_u, vy_u, vx_v, vy_v  )
%UNTITLED3 Summary of this function goes here
%   Detailed explanation goes here

for n = 2:len
% for n = 1:1000
    
    %----------------------------------
    % Utan luftmotstand
    % Acceleration
    ax_u(n) = 0;
    ay_u(n) = -g;
    % Hastighet
    vx_u(n) = vx_u(n-1) + ax_u(n-1)*deltaT;
    vy_u(n) = vy_u(n-1) + ay_u(n-1)*deltaT;
    % Position
    x_u(n) = x_u(n-1) + vx_u(n-1)*deltaT + 0.5*ax_u(n-1)*deltaT^2;
    y_u(n) = y_u(n-1) + vy_u(n-1)*deltaT + 0.5*ay_u(n-1)*deltaT^2;
    
    %----------------------------------
    % Med Luftmotstand
    % Acceleratioen
    ax(n) =    -(D/m) * sqrt(vx(n-1)^2 + vy(n-1)^2)*vx(n-1);
    ay(n) = -g -(D/m) * sqrt(vx(n-1)^2 + vy(n-1)^2)*vy(n-1);
%var1    ax(n) = (D*vx(n-1)*(sqrt(vx(n-1)^2+vy(n-1)^2)))/m;
%var1    ay(n) = (D*vx(n-1)*(sqrt(vx(n-1)^2+vy(n-1)^2))-(m*g))/m;   
    % Berknar hastigheten
    vx(n) = vx(n-1) + ax(n-1)*deltaT;
    vy(n) = vy(n-1) + ay(n-1)*deltaT;
    % Berknar den nya positionen 
    x(n) = x(n-1) + vx(n-1)*deltaT + 0.5*ax(n-1)*deltaT^2;
    y(n) = y(n-1) + vy(n-1)*deltaT + 0.5*ay(n-1)*deltaT^2;  
    %----------------------------------
    % Med Luftmotstand och vind
    % Berakningar for vinden
    vf2 = (vx_v(n-1) + U*cos(Uang))^2 + (vy_v(n-1) + U*sin(Uang))^2;      
    vf_ang = atan((vy_v(n-1) + U*sin(Uang))/(vx_v(n-1) + U*cos(Uang)));     
    % Acceleratioen
    ax_v(n) = -(D/m)*vf2*cos(vf_ang);
    ay_v(n) = -g -(D/m)*vf2*sin(vf_ang);
    % Berknar hastigheten
    vx_v(n) = vx_v(n-1) + ax_v(n-1)*deltaT;
    vy_v(n) = vy_v(n-1) + ay_v(n-1)*deltaT;
    % Berknar den nya positionen 
    x_v(n) = x_v(n-1) + vx_v(n-1)*deltaT + 0.5*ax_v(n-1)*deltaT^2;
    y_v(n) = y_v(n-1) + vy_v(n-1)*deltaT + 0.5*ay_v(n-1)*deltaT^2;  
    
    % steglngden
    %t = t + deltaT;
    
    % Avslutar loppen nr y-vardet blir vldigt nra noll 
    if abs(y_u(n)) <= 0.005
        break
    end
end

disp('hello');




end

