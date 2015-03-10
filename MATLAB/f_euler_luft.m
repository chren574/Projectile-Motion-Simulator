function [ x, y ] = f_euler_luft( len,deltaT,g, x, y, vx ,vy , ax , ay, D, m )
%UNTITLED5 Summary of this function goes here
%   Detailed explanation goes here
for n = 2:len
% for n = 1:1000
    %----------------------------------
    % Med Luftmotstand
    % Acceleratioen
    ax(n) =    -(D/m) * sqrt(vx(n-1)^2 + vy(n-1)^2)*vx(n-1);
    ay(n) = -g -(D/m) * sqrt(vx(n-1)^2 + vy(n-1)^2)*vy(n-1);
    
    
 %  ax(n) = (D*vx(n-1)*(sqrt(vx(n-1)^2+vy(n-1)^2)))/m;
 %  ay(n) = (D*vy(n-1)*(sqrt(vx(n-1)^2+vy(n-1)^2))-(m*g))/m;   
    % Berknar hastigheten
    vx(n) = vx(n-1) + ax(n-1)*deltaT;
    vy(n) = vy(n-1) + ay(n-1)*deltaT;
    
    % Berknar den nya positionen 
    x(n) = x(n-1) + vx(n-1)*deltaT + 0.5*ax(n-1)*deltaT^2;
    y(n) = y(n-1) + vy(n-1)*deltaT + 0.5*ay(n-1)*deltaT^2;  

    % Avslutar loppen nr y-vardet blir vldigt nra noll 
    if y(n) < 0
        fprintf('%i \n',n);
        %berakna ett extra steg
        x(n+1) = x(n) + vx(n)*deltaT + 0.5*ax(n)*deltaT^2;
        y(n+1) = y(n) + vy(n)*deltaT + 0.5*ay(n)*deltaT^2;  
        break
    end
end

% test = length(x);
% fprintf('%i \n',test);
% resize the vector
x = x(1:n);
y = y(1:n);
% test = length(x);
% fprintf('%i \n',test);


end

