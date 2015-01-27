clear all

% Konstanter
g = 9.82;
m = 0.145;
r = 0.0366
theta = 7*pi/36;

% Drag force
A = r.^2*pi;
C = 0.5;
p = 1.2;
D = (p*C*A)/2;

% Konstanter
deltat = 0.001;
x(1) = 0;
y(1) = 0;
v = 50;
vx(1) = v*cos(theta);
vy(1) = v*sin(theta);
t = 0;

N = 1000;
tmax = N*deltat;

for n = 1:tmax/N:1000
  
    % Beräknar aktuella acceleratioen
    ax = -(D/m)*sqrt(vx(n).^2 + vy(n).^2)*vx(n);
    ay = -g -(D/m)*sqrt(vx(n).^2 + vy(n).^2)*vy(n);
    
    % Beräknar hastigheten
    vx(n+1) = vx(n) + ax*deltat;
    vy(n+1) = vy(n) + ay*deltat;
    
    % Beräknar den nya positionen 
    x(n+1) = x(n) + vx(n)*deltat + 0.5*ax*deltat.^2;
    y(n+1) = y(n) + vy(n)*deltat + 0.5*ay*deltat.^2;
    
    % Ökar steglängden
    t = t + deltat;
    
    % Avslutar loppen när y-axeln blir noll (eller väldigt nära noll) 
    if y(n+1) < 0
        break
    end
    
end

plot(x, y);