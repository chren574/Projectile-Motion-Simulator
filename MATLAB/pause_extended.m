function [  ] = pause_extended( )
%pause_extended Summary of this function goes here
%   Wait for user to either press a key or the mouse.
%   Useful for plot

    w = waitforbuttonpress;
    if w == 0
        disp('Button click')
    else
        disp('Key press')
    end

end

