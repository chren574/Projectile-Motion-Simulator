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

%% Kaniner och r?var

% Alternativet med ode45
[T,Y]=ode45(@fdjur,[0 9],[300 150]');
kanin=Y(:,1); raev=Y(:,2);
figure;
subplot(1,2,1), plot(T,kanin, T,raev,'--')
subplot(1,2,2), plot(300,150,'x', kanin,raev), axis 





