// ==UserScript==
// @name         JoyReactor Download Button
// @description  Adds download buttton to images
// @copyright    2017+, shikiyoku
// @license      MIT
// @icon         http://joyreactor.cc/favicon.ico
// @homepageURL  https://github.com/shikiyoku/user-scripts
// @supportURL   https://github.com/shikiyoku/user-scripts/issues
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @updateURL    https://openuserjs.org/meta/shikiyoku/joyreactor-download-button.meta.js
// @author       shikiyoku
// @include      http://joyreactor.cc/*
// @grant        GM_addStyle
// ==/UserScript==
// ==OpenUserJS==
// @author shikiyoku
// ==/OpenUserJS==

/*
https://jakearchibald.github.io/svgomg/
http://b64.io/
https://codepen.io/lehollandaisvolant/pen/dMQXYX
*/

(function() {
  'use strict';

  GM_addStyle(`
.image {
  position: relative;
  display: inline-block;
}

.image:hover .download-link {
  opacity: 1;
}

.download-link {
  opacity: 0;
  position: absolute;
  top: 10px;
  right: 30px;
  width: 35px;
  height: 35px;
  overflow: hidden;
  border-radius: 0 0 7px 7px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  background-size: contain;
  background-color: #333;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgOWgtNFYzSDl2Nkg1bDcgNyA3LTd6TTUgMTh2MmgxNHYtMkg1eiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=);
}

.download-link:hover {
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  /*box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);*/
}

.download-link:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, .3);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 1;
  }
  20% {
    transform: scale(25, 25);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

.download-link:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}
 `);

  const CLASSES = {
    processed: 'js-has-download-button'
  };

  /**
   * Event delegation
   */
  function on(parent, eventName, childSelector, cb) {
    parent.addEventListener(eventName, function(event) {
      const matchingChild = event.target.closest(childSelector);

      if(matchingChild) {
        cb(matchingChild);
      }
    });
  }

  function createDownloadLink(imgContainer) {
    // Mark as processed
    imgContainer.classList.add(CLASSES.processed);

    const gifLink = imgContainer.querySelector('a.video_gif_source');
    // Image is an animated gif
    if(gifLink) {
      // Make it downloadable
      gifLink.setAttribute('download', '');
      return;
    }

    let imgURL = '';
    const imgLink = imgContainer.querySelector('a');

    // Image has a full link
    if(imgLink) {
      imgURL = imgLink.href;
    } else {
      const img = imgContainer.querySelector('img');
      if(img) {
        imgURL = img.src;
      }
    }

    if(!imgURL) {
      return;
    }

    const link = document.createElement('a');
    link.classList.add('download-link');
    link.setAttribute('href', imgURL);
    link.setAttribute('download', '');

    imgContainer.appendChild(link);
  }

  on(document.body, 'mouseover', `.image:not(.${CLASSES.processed})`, createDownloadLink);
})();