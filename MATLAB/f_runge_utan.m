function [uprime]=f_runge_utan(t,u)

%u = [x0 ; v0*cos(rad) ;y0 ; v0*sin(rad)])
    
    g = 9.82;  

    uprime=zeros(4,1);
    
    uprime(1)=u(2);         % hastighet x
    uprime(2)=0;            % acceleration x
    uprime(3)=u(4);         % hastighet y
    uprime(4)=(-g);      % acceleration y
    
end