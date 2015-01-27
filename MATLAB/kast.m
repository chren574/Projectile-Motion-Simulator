function [ y ]=kast(x,y0,v,t)
    %kastbana med luftmotstand
    g = 9.81;
    
    % med luftmotstand, se Ex 2.
    % http://www.math.chalmers.se/Math/Grundutb/CTH/mve230/1415/MATLAB4.pdf
    a = g/(2*v^2*cos(t)^2);
    b = v^2*sin(2*t)/(2*g);
    c = v^2*sin(t)^2/(2*g);
    y = y0-a*(x-b).^2+c;
    %----------------------%
    % utan luftmotstand 
%     y = v*sint(t)*x - (0.5*g).*x^2 ;
    
end