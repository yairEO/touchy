/*!
    tap / double tap special event for jQuery
    v 1.0.1
    (c) 2014 Yair Even Or <http://dropthebit.com>
    MIT-style license.
*/
;(function($){
	"use strict";

	var tapTimer,
		timeStart 	 = 0,	//Variable used to help to know if the user is holding his finger on the device. It keeps the timestamp of first touch.
		threshold 	 = 250, // ms    
		thresholdHolding = 550; // ms

	//////////////////////
	// special events
	$.event.special.doubleTap = {
	    setup    : setup,
            teardown : teardown,
            handler  : handler
	};

    $.event.special.tap = {
        setup    : setup,
        teardown : teardown,
        handler  : handler
    };
    
    $.event.special.tapHold = {
    	setup : setup,
    	teardown: teardown,
    	handler: handler
    }
    
	//////////////////////
	// events methods
	function setup(data, namespaces){
	    var elm = $(this);

		if( elm.data('tap_event') == true )
			return;

		elm.bind('touchend.tap', handler)
			.bind('touchstart.tap', handler)
			//If the finger had moved while touched the device, it just will clean timeStart for a next touch.
		    .bind('touchmove.tap', function(event){
		    	timeStart = 0;
		    	event.preventDefault();
			}).data('tap_event', true);
	}

	function teardown(namespaces) {
        $(this).unbind('touchend.tap touchmove.tap touchstart.tap');
    }

	function handler(event){
		if(event.type === 'touchstart'){
			timeStart = event.timeStamp;
			event.preventDefault();
		} else {
			var elem 	  = event.target,
			$elem 	  = $(elem),
			lastTouch = $elem.data('lastTouch') || 0,
			now 	  = event.timeStamp,
			delta 	  = now - lastTouch;

			// double-tap condition
			if( delta > 20 && delta < threshold  ){
				clearTimeout(tapTimer);
				return $elem.data('lastTouch', 0).trigger('doubleTap');
			// tap-hold condition
			} else if(timeStart > 0 && (now - timeStart) > thresholdHolding){
				timeStart = 0;
				return $elem.data('lastTouch', 0).trigger('tapHold');
			} else
				$elem.data('lastTouch', now);
	
	
			tapTimer = setTimeout(function(){
				$elem.trigger('tap');
			}, threshold);
		}
	}
})(jQuery);


/**
* jQuery Plugin to add basic "swipe" support on touch-enabled devices
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
