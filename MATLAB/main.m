%% This is the main script for the modeling of the canon.

%Raket h?jden som funktion av tid.
[t, y] = ode45(@raket, [0 18], [0 0]);
figure;plot(t, y(:,1), 'x')
ylabel('h?jd');
xlabel('tid');


%%
clear all;

%ode45(function, xspan, y) 

[t, y] = ode45(@kanon, [0 5], [10 0]);
figure;plot(t, y(:,1), 'x')
ylabel('h?jd');
xlabel('tid');


%%
[t,y]=ode45(@vdp1,[0 20],[2 0]);   
plot(t,y(:,1));

figure;plot(t, y(:,1), 'x')


%% kastbana med funktionen kast.m

clear all

y0=0;
v0=10; 
t=45*pi/180;

x=linspace(0,14);

figure;plot(x, kast(x,y0,v0,t),[x(1) x(end)],[0 0],'g')

distance=fzero(@(x)kast(x,y0,v0,t),[0,12]);
fprintf('distance: %d \n', distance); 


%% Eulers step method

clear t % Clears old time steps and
clear y % y values from previous runs

a=0; % Initial time
b=1; % Final time
N=10; % Number of time steps
y0=0; % Initial value y(a)
h=(b-a)/N; % Time step
t(1)=a;
y(1)=y0;

for n=1:N % For loop, sets next t,y values
    t(n+1)=t(n)+h;
    y(n+1)=y(n)+h*f(t(n),y(n)); % Calls the function f(t,y)=dy/dt
end
plot(t,y)
title(['Euler Method using N=',num2str(N),' steps, by MYNAME'])
% Include your own name

%% Exempel pa Eulers stegmetod


[X,Y] = euler1(0,1, 1, 10); 
[X,Y]
figure;plot(X,Y);


%%
A=[4 -5;-2 1]; x0=[2.9;3.6];
F=@(t,x)A*x;
[t,X]=ode45(F,[0 10],x0);

x1=linspace(-3,3,30); x2=linspace(-1,5,30); 
[X1,X2]=meshgrid(x1,x2); 
F1=A(1,1)*X1+A(1,2)*X2;
F2=A(2,1)*X1+A(2,2)*X2;
quiver(X1,X2,F1,F2,0.9)
axis([-3 3 -1 5]);hold on
plot(X(:,1),X(:,2),'r','LineWidth',2)

%% Kaniner och ravar

% Alternativet med ode45
[T,Y]=ode45(@fdjur,[0 9],[300 150]');
kanin=Y(:,1); raev=Y(:,2);
figure;
subplot(1,2,1), plot(T,kanin, T,raev,'--')
subplot(1,2,2), plot(300,150,'x', kanin,raev), axis 


%%

[t,u]=ode45(@ft,[0,1.8],[0;63.1*cos(35*pi/180) ;5 ;63.1*sin(35*pi/180)]);
plot(u(:,1), u(:,3))
grid on



%%


%argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
[t,u]=ode45(@ft2,[0, 3],[0 ;20*cos(45*pi/180) ;0 ;20*sin(45*pi/180)]);
figure;plot(u(:,1), u(:,3))
grid on

%% Air res

%argument ode45(funktionen, [t0 tf], [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
[t,u_res]=ode45(@func_airres,[0, 4.5],[0 ; 20*cos(45*pi/180) ;0 ;20*sin(45*pi/180)]);
figure;plot(u_res(:,1), u_res(:,3))
grid on



%%

s = 100;
t = 1:100;
g = 9.81;

theta = pi/3;
v0 = s*[cos(theta); sin(theta )];
% %Compute the reference trajectory (absent air resistance )
% x(y) = s*cos(theta)*t;
% y(t) = -g*t^2/2 + s*sin(theta)*t;
% %up to time tfinal = 2*s*sin(theta)/g
%
tfinal = 2*v0(2)/g;
tref = linspace(0,tfinal )';
xref = v0(1)*tref;
yref = (v0(2)-g/2*tref).*tref;

% Compute the same reference trajectory with ode45
y0 = [0; 0; v0];
refopt = opt;
refopt.c = 0;
[tout,yout] = ode45(@(t,y) fball(t,y,refopt ), tref , y0);

% Compute a similar trajectory with air drag on (no wind)
dopt = opt;
dopt.w = 0;
[toutd,youtd] = ode45(@(t,y) fball(t,y,dopt), tref , y0);

% Do a comparison between analytical and numerical solutions (no drag)
fprintf('Max x error: %g\n', norm( xref-yout(:,1), inf));
fprintf('Max y error: %g\n', norm( yref-yout(:,2), inf));
% Visually compare solutions for drag and no drag
plot(xref, yref , ' r: ' , youtd (:,1), youtd (:,2), 'b-');
legend('No drag', 'Drag');







