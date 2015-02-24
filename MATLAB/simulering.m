% TNM085 - Modelleringsprojekt.
% Simulering av kastbana.
% 2015-02-10
% 
clear all;

%%%%% Konstanter %%%%%
g = 9.82;                % Tyngdacceleration g [m/s^2]
m = 0.145;               % Massa m [kg]
r = 0.15;                % Radie r [m]

%%%%% Konstanter luftmotstand %%%%%
A = r^2*pi;             % Arean A [m^2]
C = 0.5;
p = 1.2;                % Densiteten p []
D = (p*C*A)/2;

% initialv?rden
v0 = 80;                 % initial hastigheten
angle = 45;              % Vinkel  [grader]
theta = angle*pi/180;    % Vinkel  [radianer]

x(1) = 0;y(1)   = 0;     % Startpositionen x och y-led.
x_u(1)=0;y_u(1) = 0;     % Startpositionen x och y-led.

% Tidsvektorn for simuleringen
t0 = 0;                  % starttid
tf = 6.333 ;             % sluttid
deltaT = 0.01;           % tidssteg --> andra for att se fel
t = t0:deltaT:tf;        % tidsvektorn

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

% Initial hastigheten x och y komponent.
vx(1)   = v0*cos(theta);  vy(1) = v0*sin(theta);
vx_u(1) = v0*cos(theta);vy_u(1) = v0*sin(theta);
vx_v(1) = v0*cos(theta);vy_v(1) = v0*sin(theta);

% Parametrar for vind
U = 0;                   % vindens hastighet
wind_angle = 0;              % Vinkel  [grader]
Uang = wind_angle*pi/180;      % Vinkel  [radianer]

%%


[x_v, y_v] = f_euler_vind(len,deltaT,g, x_v, y_v, vx_v ,vy_v, ax_v, ay_v, D, m, U, Uang);
plot(x_v, y_v, 'b')
%axis tight;
xlabel('Distance [m]');
ylabel('Height y [m]');
titel = ['Wind simulation'];
title(titel);
ylim([0, inf]) % Axelgrans i y-led

hold on;

%%

[x, y] = f_euler_luft(len,deltaT,g, x, y, vx ,vy , ax , ay, D, m );
plot(x, y, 'r*')

[x_u, y_u] = f_euler_utan(len,deltaT,g, x_u, y_u, vx_u ,vy_u, ax_u, ay_u);
%plot(x_u, y_u, 'g')


%%
plot(x_u, y_u, 'g', x, y,'r' , x_v, y_v, 'c');

grid on;
hold on;
axis tight;
ylim([0, inf]) % Axelgrans i y-led
xlabel('Distance [m]');
ylabel('Height y [m]');
titel = ['Canon simulation, timestep = ', num2str(deltaT)];
title(titel);

%%pause_extended(); %---------------------------------->
%%
%pause(2);

% Jamfor med ode45 losning
%argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
%options = odeset('RelTol',1*exp(-10),'AbsTol',1*exp(-10));

[t ,u]=ode45(@f_runge_utan,[0, 10],[0 ;v0*cos(45*pi/180) ;0 ;v0*sin(45*pi/180)]);
% plot the solution for the ode45 with the same arguments
plot(u(:,1), u(:,3), 'g+')
ylim([0, inf]) % Axelgrans i y-led


%%
% Jamfor med ode45 losning f?r luftmotstand
%argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
[t ,u_luft]=ode45(@f_runge_luft,[0, 10],[0 ; v0*cos(45*pi/180) ;0 ;v0*sin(45*pi/180)]);
plot(u_luft(:,1), u_luft(:,3), 'r*')
grid on
ylim([0, inf]) % Axelgrans i y-led

%%
v0 = 20;
% Jamfor med ode45 losning vind ekvationen

[t ,u_vind]=ode45(@f_runge_vind,[0, 10],[0 ; v0*cos(45*pi/180) ;0 ;v0*sin(45*pi/180)]);
plot(u_vind(:,1), u_vind(:,3), 'b*')
ylim([0, inf]) % Axelgrans i y-led

%pause_extended(); %---------------------------------->
%legend('Inget','Luftmotstand','Luftmotstand & vind','ode45','ode45 - Luft', 'ode45 - Vind')

%%
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





