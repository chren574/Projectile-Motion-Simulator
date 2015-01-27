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





