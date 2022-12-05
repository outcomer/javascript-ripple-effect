# Ripple effect with pure JavaScript

### How to use
1. Include two files `ripple.css` and `ripple.js` into a site page(s);
2. Add one of the two (or both at once) CSS classes to the desired HTML elements `.ripple-hover` | `.ripple-click`;

### Explanation
- Script serves nodes on page with classes `.ripple-hover` | `.ripple-click`;
- `.ripple-click` produce effect within a click (tap on touchscreen devices) at container with this class;
- `.ripple-hover` produce effect on hover over container with this class;
- Hover effect does not work on touchscreen devices - no sense;
- The script has no arguments or option. It realize only methematics and apply propper classes. So all configuration of effect in fact lives in CSS styles - look into `ripple.css` (colors, animation settings - everything is there);


### Demo or what you can expect
![Demo CountPages alpha](https://github.com/outcomer/javascript-ripple-effect/blob/main/demo.gif)
