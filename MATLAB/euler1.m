function [X,Y] = euler1(x,xf,y,n)
%euler1 Summary of this function goes here
%   http://wps.prenhall.com/wps/media/objects/628/643420/chapt2/proj2.4/proj2-4.pdf

    h = (xf - x)/n; % step size
    X = x; % initial x
    Y = y; % initial y
    
    for i = 1:n % begin loop
        y = y + h*f(x,y); % Euler iteration
        x = x + h; % new x
        X = [X;x]; % update x-column
        Y = [Y;y]; % update y-column
    end % end loop
    
end