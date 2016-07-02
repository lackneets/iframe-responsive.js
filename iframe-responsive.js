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
  if(!CSSStyleDeclaration.prototype.setProperty){
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

  function isJSON (str) {
    try {
      return JSON.parse(str) && true;
    } catch (ex) {
      return false;
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

  var onReady=function(d){"complete"==document.readyState?d():document.addEventListener?window.addEventListener("load",d,!1):window.attachEvent("onload",d)};

  onReady(function(){
    // Master

    var resizedFrames = [];

    attachEvent(window, 'message', onResized);
    function onResized(event){
      var data = isJSON(event.data) ? JSON.parse(event.data) : event.data;
      if(data.location){
        toArray(document.getElementsByTagName('iframe')).forEach(function(frame){
          if(data.location == frame.src){
            frame.style.setProperty("height", data.height + "px", "important");
            resizedFrames.push(frame);
          }
        });
      }
    }

    // function tryShrink(){
    //   var frame;
    //   while(frame = resizedFrames.pop()){
    //     frame.style.setProperty("height", parseInt(frame.style.height)-50 + "px", "important");
    //   }
    // }

    // Outer
    // if(window.parent == window){
    //   attachEvent(window, 'resize', tryShrink);
    // }

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
