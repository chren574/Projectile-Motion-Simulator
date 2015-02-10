clear all;

%%%%% Konstanter %%%%%
g = 9.82;                % Tyngdacceleration g [m/s^2]
m = 0.145;               % Massa m [kg]
r = 0.0366;              % Radie r [m]

angle = 45;              % angle in degrees
theta = angle*pi/180;    % convert to radians

%%%%% Konstanter luftmotstand %%%%%
A = r.^2*pi;             % Arean A [m^2]
C = 0.5;
p = 1.2;                 % Densiteten p []
D = (p*C*A)/2;

% Konstanter
v0 = 20;                 % initial hastigheten
x(1) = 0;y(1) = 0;
x_u(1) = 0;y_u(1) = 0;

t0 = 0;                  % starttid
tf = 6.333 ;             % sluttid
deltaT = 0.1;           % tidssteg
t=t0:deltaT:tf ;         % tidsvektorn

len=length(t);
v=zeros(1, len);
% allokerar minne for resultatvektorerna 
ax=zeros(1, len);ay=zeros(1, len);
vx=zeros(1, len);vy=zeros(1, len);
x=zeros(1, len); y=zeros(1, len);

ax_u= zeros(1, len);ay_u= zeros(1, len);
vx_u=zeros(1, len); vy_u=zeros(1, len);
x_u=zeros(1, len);  y_u=zeros(1, len);

ax_v= zeros(1, len);ay_v= zeros(1, len);
vx_v=zeros(1, len); vy_v=zeros(1, len);
x_v=zeros(1, len);  y_v=zeros(1, len);

v(1) = v0*sin(theta);          %

% Start hastigheten
vx(1)   = v0*cos(theta);  vy(1) = v0*sin(theta);
vx_u(1) = v0*cos(theta);vy_u(1) = v0*sin(theta);
vx_v(1) = v0*cos(theta);vy_v(1) = v0*sin(theta);

% Parametrar for vind
% vindens hastighet
U = 20;
% vindens vinkel
Uang = 0;
 
% N = 100;
% tmax = N*deltaT;

%%

% for n = 1:1000
for n = 2:len
  
    
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

plot(x_u, y_u, 'g', x, y,'r' , x_v, y_v, 'c');
%plot(t, y,'r' , t, y_u, 'g');
grid on;
hold on;
axis tight;
ylim([0, inf]) % Axelgrans i y-led
xlabel('x (m)');
ylabel('y (m)');
title('Projectile Trajectories');

% Jamfor med ode45 losning
%argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
%options = odeset('RelTol',1*exp(-10),'AbsTol',1*exp(-10));

[t ,u]=ode45(@f_utan,[0, 3],[0 ;20*cos(45*pi/180) ;0 ;20*sin(45*pi/180)]);
% plot the solution for the ode45 with the same arguments
plot(u(:,1), u(:,3), 'g+')

% Jamfor med ode45 losning f?r luftmotstand
%argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
[t ,u_luft]=ode45(@f_luft,[0, 4.5],[0 ; 20*cos(45*pi/180) ;0 ;20*sin(45*pi/180)]);
plot(u_luft(:,1), u_luft(:,3), 'r*')
grid on
%legend('med luftmotst?nd','utan luftmotstand','ode45-utan','ode45-med luft')

% Jamfor med ode45 losning f?r luftmotstand
%argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
[t ,u_vind]=ode45(@f_vind,[0, 4.5],[0 ; 20*cos(45*pi/180) ;0 ;20*sin(45*pi/180)]);
plot(u_vind(:,1), u_vind(:,3), 'b*')


%%
figure;
%title('Acceleration and velocity with drag');
subplot(2,2,1);
plot(t, ax)
xlabel('Time (s)');
ylabel('(m/s^s)');
title('Acceleration x (m/s^2)');

subplot(2,2,2);
plot(t, ay)
xlabel('Time (s)');
ylabel('(m/s^2)');
title('Acceleration y (m/s^2)');

subplot(2,2,3);
plot(t, vx)
xlabel('Time (s)');
ylabel('(m/s)');
title('Velocity x (m/s)');

subplot(2,2,4);
plot(t, vy)
xlabel('Time (s)');
ylabel('(m/s)');
title('Velocity y (m/s)');
%%





