function [ yp ] = raket( t, y )
%raket Summary of this function goes here
%   Detailed explanation goes here
    
% fprintf('y(1): %d y(2): %d\n', y(1), y(2)); 
% pause(2);

yp = [y(2) (5000-0.1*y(2)^2 + 10*y(2))/(300-10*t)-9.81]';

end

