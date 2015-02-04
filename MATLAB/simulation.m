clear all;

%%%%% Konstanter %%%%%

g = 9.82;                % Tyngdacceleration g [m/s^2]
m = 0.145;               % Massa m [kg]
r = 0.0366;              % Radie r [m]
% theta = 7*pi/36;       % Vinkel theta [radianer]

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

t0 = 0;             % starttid
tf = 6.333 ;        % sluttid
deltaT = 0.1;      % tidssteg
t=t0:deltaT:tf ;    % tidsvektorn

len=length(t);
v=zeros(1, len);
%skapar samma vektorer f?r de ?vriga
ax=zeros(1, len);ay=zeros(1, len);
vx=zeros(1, len);vy=zeros(1, len);
x=zeros(1, len); y=zeros(1, len);

ax_u= zeros(1, len);ay_u= zeros(1, len);
vx_u=zeros(1, len); vy_u=zeros(1, len);
x_u=zeros(1, len);  y_u=zeros(1, len);

v(1) = v0*sin(theta);          %

% Start hastigheten
vx(1)   = v0*cos(theta);  vy(1) = v0*sin(theta);
vx_u(1) = v0*cos(theta);vy_u(1) = v0*sin(theta);
 
% N = 100;
% tmax = N*deltaT;

%v_comp=zeros(1, len);

% Euler bakatsubstitution for hastigheten med luftmotstand.
for i = 2:len
    v(i) = v(i-1)+ (g - (D/m)*v(i-1)^2) * deltaT ;
    %v_comp(i) = v(i)-v(i-1);
end%

figure;plot(t, v)
xlabel('Time (s)');
ylabel('Y-speed (m/s)');

% figure;plot(t, v_comp)
% xlabel('Time (s)');
% ylabel('Y-speed (m/s)');
%%

% for n = 1:1000
for n = 2:len
  
    % Berknar aktuella acceleratioen
    ax(n) =    -(D/m)*sqrt(vx(n-1)^2 + vy(n-1)^2)*vx(n-1);
    ay(n) = -g -(D/m)*sqrt(vx(n-1)^2 + vy(n-1)^2)*vy(n-1);
    % Utan luftmotstand
    ax_u(n) = 0;
    ay_u(n) = -g;
    
    % Berknar hastigheten
    vx(n) = vx(n-1) + ax(n-1)*deltaT;
    vy(n) = vy(n-1) + ay(n-1)*deltaT;
    % Motsvande utan luftmotstand
    vx_u(n) = vx_u(n-1) + ax_u(n-1)*deltaT;
    vy_u(n) = vy_u(n-1) + ay_u(n-1)*deltaT;
    
    % Berknar den nya positionen 
    x(n) = x(n-1) + vx(n-1)*deltaT + 0.5*ax(n-1)*deltaT^2;
    y(n) = y(n-1) + vy(n-1)*deltaT + 0.5*ay(n-1)*deltaT^2;  
    % ...utan luftmotstand
    x_u(n) = x_u(n-1) + vx_u(n-1)*deltaT + 0.5*ax_u(n-1)*deltaT^2;
    y_u(n) = y_u(n-1) + vy_u(n-1)*deltaT + 0.5*ay_u(n-1)*deltaT^2;
    
    % steglngden
    %t = t + deltaT;
    
    % Avslutar loppen nr y-vardet blir vldigt nra noll 
    if abs(y_u(n)) <= 0.005
        break
    end
end

plot(x, y,'r' ,x_u, y_u, 'g');
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
[t,u]=ode45(@ft2,[0, 3],[0 ;20*cos(45*pi/180) ;0 ;20*sin(45*pi/180)]);
% plot the solution for the ode45 with the same arguments
plot(u(:,1), u(:,3), '--')


%argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
[t,u_res]=ode45(@func_airres,[0, 4.5],[0 ; 20*cos(45*pi/180) ;0 ;20*sin(45*pi/180)]);
plot(u_res(:,1), u_res(:,3), '*')
grid on



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





