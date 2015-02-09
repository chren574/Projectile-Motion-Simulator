function [uprime]=ft(t,u)
    
    uprime=zeros(4,1);
    k=-.06433;
    m=11.49;
    
    uprime(1)= u(2);
    uprime(2)= (k*u(2)*(sqrt(u(2)^2+u(4)^2)))/m;
    uprime(3)= u(4);
    uprime(4)= (k*u(2)*(sqrt(u(2)^2+u(4)^2))-(m*32.2))/m;
end