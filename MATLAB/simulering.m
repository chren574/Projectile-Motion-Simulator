% TNM085 - Modelleringsprojekt.
% Simulering av kastbana.
% Grupp 9.
% 2015-02-10
% 

clear all;
%%%%% Konstanter %%%%%
g = 9.82;                % Tyngdacceleration g [m/s^2]
m = 0.5;                 % Massa m [kg]
r = 0.15;                % Radie r [m]

%%%%% Konstanter luftmotstand %%%%%
A = r^2*pi;             % Arean A [m^2]
C = 0.5;
p = 1.2;                % Densiteten p []
D = (p*C*A)/2;

% Initialvarden
v0 = 50;                 % initial hastigheten
angle = 35;              % Vinkel  [grader]
theta = angle*pi/180;    % Vinkel  [radianer]

% Tidsvektorn for simuleringen
t0 = 0;                  % starttid
tf = 10 ;                % sluttid
deltaT = 0.05;           % tidssteg --> andra for att se fel
t = t0:deltaT:tf;        % tidsvektorn

len=length(t);
v=zeros(1, len);

% allokerar minne for resultatvektorerna 
ax = zeros(1, len);ay = zeros(1, len);
vx = zeros(1, len);vy = zeros(1, len);
x  = zeros(1, len); y = zeros(1, len);

%allokerar minne u
ax_u = zeros(1, len); ay_u = zeros(1, len);
vx_u = zeros(1, len); vy_u = zeros(1, len);
x_u  = zeros(1, len);  y_u = zeros(1, len);

ax_v = zeros(1, len); ay_v = zeros(1, len);
vx_v = zeros(1, len); vy_v = zeros(1, len);
x_v  = zeros(1, len);  y_v = zeros(1, len);

% Initial hastigheten x och y komponent.
vx(1)   = v0*cos(theta);  vy(1) = v0*sin(theta);
vx_u(1) = v0*cos(theta);vy_u(1) = v0*sin(theta);
vx_v(1) = v0*cos(theta);vy_v(1) = v0*sin(theta);

% Satt startposition explicit
x(1) = 0; y(1)   = 0;     % Startpositionen x och y-led.
x_u(1)=0; y_u(1) = 0;     % Startpositionen x och y-led.
x_v(1)=0; y_v(1) = 0;     % Startpositionen x och y-led.

% Parametrar for vind
U = 0;                        % vindens hastighet
wind_angle = 0;              % Vinkel  [grader]
Uang = wind_angle*pi/180;      % Vinkel  [radianer]

%% Simulering Euler vind

[x_v, y_v] = f_euler_vind(len,deltaT, g, x_v, y_v, vx_v ,vy_v, ax_v, ay_v, D, m, U, Uang);
figure;plot(x_v, y_v, 'b')

%axis tight;
xlabel('Distance [m]');
ylabel('Height y [m]');
titel = ['Wind simulation'];
title(titel);
ylim([0, inf]) % Axelgrans i y-led

hold on;

% Simulering Euler luftmotstand
[x, y] = f_euler_luft(len,deltaT, g, x, y, vx ,vy , ax , ay, D, m );
plot(x, y, 'r')

% Simulering Euler utan luftmotstand
[x_u, y_u] = f_euler_utan(len,deltaT,g, x_u, y_u, vx_u ,vy_u, ax_u, ay_u);
plot(x_u, y_u, 'g')
%xlim([0, 10]) % Axelgrans i x-led



%%
% Argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])

% Ej luftmotstand med ode45 losning

[t ,runge_utan]=ode45(@f_runge_utan,[0, 10],[0 ;v0*cos(theta) ;0 ;v0*sin(theta)]);

plot(runge_utan(:,1), runge_utan(:,3), 'g+')
ylim([0, inf]) % Axelgrans i y-led


%%
% Luftmotstand med ode45 losning 

[t ,runge_luft]=ode45(@f_runge_luft,[0, 10],[0 ; v0*cos(theta) ;0 ;v0*sin(theta)]);

plot(runge_luft(:,1), runge_luft(:,3), 'r*')
ylim([0, inf]) % Axelgrans i y-led

%%
% Vind ekvationen med ode45 losning 

[t ,runge_vind]=ode45(@f_runge_vind,[0, 10],[0 ; v0*cos(theta) ;0 ;v0*sin(theta)]);
plot(runge_vind(:,1), runge_vind(:,3), 'b*')
ylim([0, inf]) % Axelgrans i y-led


%%

plot(x_u, y_u, 'g', x, y,'r' , x_v, y_v, 'c*');

grid on;
hold on;
axis tight;
ylim([0, inf]) % Axelgrans i y-led
xlabel('Distance [m]');
ylabel('Height y [m]');
titel = ['Canon simulation, timestep = ', num2str(deltaT)];
title(titel);

%%

distance = [length(x_u) length(x) length(x_v) ];

[max_distance, max_index] = max(distance);

if max_index == 1
    x(length(x):max_distance) = 0;
    y(length(y):max_distance) = 0;
    
    x_v(length(x_v):max_distance) = 0;
    y_v(length(y_v):max_distance) = 0;
elseif max_index == 2
    x_u(length(x_u):max_distance) = 0;
    y_u(length(y_u):max_distance) = 0;
    
    x_v(length(x_v):max_distance) = 0;
    y_v(length(y_v):max_distance) = 0;
else
    x_u(length(x_u):max_distance) = 0;
    y_u(length(y_u):max_distance) = 0;
    
    x(length(x):max_distance) = 0;
    y(length(y):max_distance) = 0;   
end

figure;plot(x_u, y_u, 'g', x, y,'r' , x_v, y_v, 'c');

%%






