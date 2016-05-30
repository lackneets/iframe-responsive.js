/*
  iFrameResponsive.js
  Requires: No

  Author: Lackneets Chang < lackneets@gmail.com >
  Gist: https://gist.github.com/lackneets/e945d328838b11eed250
*/

(function(){

  // Polyfill 
  // http://javascript.boxsheep.com/polyfills/Array-prototype-forEach/
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, arg) {
      var arr = this,
      len = arr.length,
      thisArg = arg ? arg : undefined,
      i;
      for (i = 0; i < len; i += 1) {
        if (arr.hasOwnProperty(i)) {
          fn.call(thisArg, arr[i], i, arr);
        }
      }
      return undefined;
    };
  }
  if(!CSSStyleDeclaration.prototype.getProperty){
    CSSStyleDeclaration.prototype.getProperty = function(a) {
      return this.getAttribute(a);
    };
    CSSStyleDeclaration.prototype.setProperty = function(a,b) {
      return this.setAttribute(a,b);
    }
    CSSStyleDeclaration.prototype.removeProperty = function(a) {
      return this.removeAttribute(a);
    }    
  }


  function toArray(obj) {
    var array = [];
    for (var i = obj.length >>> 0; i--;) { 
      array[i] = obj[i];
    }
    return array;
  }

  function attachEvent(element, event, fn) {
    if (element.addEventListener) {
      element.addEventListener(event, fn, false);
    } else if (element.attachEvent) { // if IE
      element.attachEvent('on' + event, fn);
    }
  }

  function onReady(func) {
    if (document.readyState == 'complete') {
      func();
    } else {
      attachEvent(window, 'load', func);
    }
  }

  onReady(function(){
    // Master
    attachEvent(window, 'message', onResized);
    function onResized(event){
      var data;
      try{
        data = JSON.parse(event.data);
      } catch(e){}
      if(data.location){
        toArray(document.getElementsByTagName('iframe')).forEach(function(frame){
          if(data.location == frame.src){
            frame.style.setProperty("height", data.height + "px", "important");
          }
        });
      }
    }

    // iFrame
    if(window.parent != window && window.parent.postMessage){
      function sendHeight(){
        parent.postMessage(JSON.stringify({
          height: document.body.offsetHeight,
          location: window.location.toString()
        }), '*');
      }
      document.body.style.overflowY = "hidden";
      attachEvent(window, 'resize', sendHeight);
      attachEvent(window, 'load', sendHeight);
      setTimeout(sendHeight, 100);
      setTimeout(sendHeight, 300);
      setTimeout(sendHeight, 600);
    }

  });

})();