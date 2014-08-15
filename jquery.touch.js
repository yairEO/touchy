/**
* tap / double tap special event for jQuery
*
* @author Yair Even Or
* @version 1.0.0 (2014)
* MIT-style license.
*/

(function($){
	"use strict";

	var tapTimer,
		moved = false,   // flag to know if the finger had moved while touched the device
		wait = 250; // ms

	$.event.special.tap = {
	    setup: function(data, namespaces) {
	        $(this).bind('touchend.tap', $.event.special.tap.handler)
	        	   .bind('touchmove.tap', function(){
	        	   		moved = true;
	        	   });
	    },

	    teardown: function(namespaces) {
	        $(this).unbind('touchend.tap touchmove.tap');
	    },

	    handler: function(event){
	    	if( moved ){
	    		moved = false;
	    		return false;
	    	}

	        var elem 	  = event.target,
	            $elem 	  = $(elem),
	            lastTouch = $elem.data('lastTouch') || 0,
	            now 	  = new Date().getTime(),
				delta 	  = now - lastTouch,
				args      = [].slice.call( arguments, 1 ); // clone arguments array, remove original event from cloned array

	        if( delta > 20 && delta < wait ){
	        	clearTimeout(tapTimer);
	            return $elem.data('lastTouch', 0).trigger('doubleTap');
	        }
	        else
	            $elem.data('lastTouch', now);

	        // if double tapping never happened, fire single tap
	        tapTimer = setTimeout(function(){
	        	$elem.trigger('tap');
	        	clearTimeout(tapTimer);
	        }, wait);
	    }
	};

})(jQuery);


/**
* jQuery special event which adds basic "swipe" support for touch-enabled devices
*
* @author Yair Even Or
* @version 1.0.0 (March 20, 2013)
*/
	
(function($){
	"use strict";

    $.event.special.swipe = {
        setup: function(){
            $(this).bind('touchstart', $.event.special.swipe.handler);
        },

        teardown: function(){
            $(this).unbind('touchstart', $.event.special.swipe.handler);
        },

        handler: function(event){
            var args = [].slice.call( arguments, 1 ), // clone arguments array, remove original event from cloned array
                touches = event.originalEvent.touches,
                startX, startY,
                deltaX = 0, deltaY = 0,
                that = this;

            event = $.event.fix(event);

            if( touches.length == 1 ){
                startX = touches[0].pageX;
                startY = touches[0].pageY;
                this.addEventListener('touchmove', onTouchMove, false);
            }

            function cancelTouch(){
                that.removeEventListener('touchmove', onTouchMove);
                startX = startY = null;
            }

            function onTouchMove(e){
                //e.preventDefault();

                var Dx = startX - e.touches[0].pageX,
                    Dy = startY - e.touches[0].pageY;

                if( Math.abs(Dx) >= 50 ){
                    cancelTouch();
                    deltaX = (Dx > 0) ? -1 : 1;
                }
                else if( Math.abs(Dy) >= 20 ){
                    cancelTouch();
                    deltaY = (Dy > 0) ? 1 : -1;
                }

                event.type = 'swipe';
                args.unshift(event, deltaX, deltaY); // add back the new event to the front of the arguments with the delatas
                return ($.event.dispatch || $.event.handle).apply(that, args);
            }
        }
    };
})(jQuery);