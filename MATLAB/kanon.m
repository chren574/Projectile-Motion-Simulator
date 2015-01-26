function [ yp ] = kanon( t, y )
%raket Summary of this function goes here
%   Detailed explanation goes here

% fprintf('y(1): %d y(2): %d\n', y(1), y(2)); 
% pause(2);
g = 9.81;
v0 = 10;
theta = pi/4;

yp = [y(2) v0*sin(theta)*t-0.5*g*t^2 ]';

end

