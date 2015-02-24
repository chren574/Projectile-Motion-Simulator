function [ x_v, y_v ] = f_euler_vind( len,deltaT,g, x_v, y_v, vx_v ,vy_v, ax_v, ay_v, D, m, U, Uang)
%UNTITLED5 Summary of this function goes here
%   Detailed explanation goes here
for n = 2:len
% for n = 1:1000

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

    % Avslutar loppen nr y-vardet blir vldigt nra noll 
    if y_v(n) < 0
        break
        fprintf('%i \n',n);
        %berakna ett extra steg
        x_v(n+1) = x_v(n) + vx_v(n)*deltaT + 0.5*ax_v(n)*deltaT^2;
        y_v(n+1) = y_v(n) + vy_v(n)*deltaT + 0.5*ay_v(n)*deltaT^2;  
        %break
    end
end

steps = length(x_v);
fprintf('Number of steps: %i \n',steps);
% resize the vector
x_v = x_v(1:n);
y_v = y_v(1:n);
% test = length(x);
% fprintf('%i \n',test);

disp('hello');

end

