function [ x_u, y_u ] = f_euler_utan( len,deltaT,g, x_u, y_u, vx_u ,vy_u, ax_u, ay_u )
%UNTITLED5 Summary of this function goes here
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
    
    % Avslutar loppen nr y-vardet blir vldigt nra noll 
    if y_u(n) < 0
        x_u(n+1) = x_u(n) + vx_u(n)*deltaT + 0.5*ax_u(n)*deltaT^2;
        y_u(n+1) = y_u(n) + vy_u(n)*deltaT + 0.5*ay_u(n)*deltaT^2;
        break
    end
end

x_u = x_u(1:n);
y_u = y_u(1:n);


end

