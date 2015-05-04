Touchy - jQuery special events (tap / double tap / swipe)
========

This will add support for these events:
Tap, Double Tap and Swipe (vertical and horizontal).

###[DEMO PAGE](http://yaireo.github.io/touchy/)

![QR code](https://chart.googleapis.com/chart?cht=qr&chl=http%3A%2F%2Fyaireo.github.io%2Ftouchy%2F&chs=180x180&choe=UTF-8&chld=L|2)

## How to use:
    $(elm).on('tap', callbackFunction);
	$(elm).on('doubleTap', callbackFunction);

	// swipe
	$(elm).on('swipe', function onSwipe(e, Dx, Dy){
		// ...
	});
