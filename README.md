# vanillaScrolly

Tools for scrollytelling

## Init

Embed the main JS file `js/vanilla-scrolly.js`

Trigger when ready !

```js
(function(){
    new vanillaScrolly(document.getElementById('sticky'), {
        callback:  function($item, percent, step) {
            console.log(percent);
        }
    });
}());
```
