Touchy - jQuery special events (tap / double tap / swipe)
========

This will add support for these events:
Tap, Double Tap and Swipe (vertical and horizontal).

###[DEMO PAGE](xxx)

## How to use:
    $(elm).on('tap', callbackFunction);
	$(elm).on('doubleTap', callbackFunction);

	// swipe
	$(elm).on('swipe', function onSwipe(e, Dx, Dy){
		// ...
	});
