function [uprime]=f__runge_luft(t,u)
    % input parameters
    % u = [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)]) 
    % output parameters
    % uprime = [vx ; ax ;vy ; ay])
    
    uprime=zeros(4,1);
    
    % Konstanter
    m = 0.145;               % Massa m [kg]
    g = 9.82;                % Tyngdacceleration g [m/s^2]
    % Konstanter luftmotstand
    r = 0.0366;              % Radie r [m]
    A = r.^2*pi;             % Arean A [m^2]
    C = 0.5;
    p = 1.2;                 % Densiteten p []
    D = (p*C*A)/2;
    
    % Hastighet x
    uprime(1)= u(2);
    % Acceleration x
%var1 uprime(2)= (D*u(2)*(sqrt(u(2)^2+u(4)^2)))/m;
    
    uprime(2)= -(D/m) * sqrt(u(2)^2 + u(4)^2)*u(2);
    % Hastighet y
    uprime(3)= u(4);
    % Acceleration y
%var1 uprime(4)= (D*u(2)*(sqrt(u(2)^2+u(4)^2))-(m*g))/m;
    uprime(4)= -g -(D/m) * sqrt(u(2)^2 + u(4)^2)*u(4);

end
    
%       Mall
%     ax(n) =    -(D/m)*sqrt(vx(n-1)^2 + vy(n-1)^2)*vx(n-1);
%     ay(n) = -g -(D/m)*sqrt(vx(n-1)^2 + vy(n-1)^2)*vy(n-1);

