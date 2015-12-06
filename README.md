## AvaAspect

Filter observations by slope aspect.

### Running

```
$ git clone git@github.com:nathancahill/AvaAspect.git
$ cd AvaAspect
$ npm install
$ npm run build
```

### Development

```
$ npm run watch
```

## Design

![](http://i.imgur.com/X79L290.jpg)

### Problems with Current UX

 - Two inputs are not intuitive
 - Unable to see what's filtered

### Possible Solution #1

 - Combine inputs
 - Use algorithm to determine active handle:
   - At first both handles are stacked at 0° and 360°
   - Clicking or dragging on the west side moves the min handle
   - Clicking or dragging on the east side moves the max handle
   - Then, the handle closest to mouse becomes active
 - All of input is clickable
 - Possibly use blank space around outside of compass

__Cons:__

 - Still doesn't show what's filtered
 - Blank space might by confusing until clicked

### Possible Solution #2

 - Overlay of radar graph of observations
 - Easy to see what's filtered
 - Useful as a data viz tool as well as input
 - Extended compass lines for radar graph
 - Different color border when unselected

__Cons:__

 - Potentially confusing graph if not familiar with avy radar charts (although they are talked about in all avalanche courses and books).
 - Algorithm for determining active handle has to be exactly right, or it will feel janky.

### Demo

Live filtering + updating radar graph. Click map to add observations with random aspect. Filters and radar chart update.