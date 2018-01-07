// ==UserScript==
// @name        JoyReactor Download Button
// @namespace   https://github.com/shikiyoku
// @description Adds download buttton to images
// @version     1.1.0
// @author      shikiyoku
// @license     MIT
// @copyright   2017+, shikiyoku
// @icon        http://joyreactor.cc/favicon.ico
// @homepageURL https://github.com/shikiyoku/user-scripts
// @supportURL  https://github.com/shikiyoku/user-scripts/issues
// @include     *reactor.cc*
// @run-at      document-end
// @grant       GM_addStyle
// ==/UserScript==

(function () {
  'use strict'

  /* global GM_addStyle */
  var addStyle = 'GM_addStyle' in window
    ? GM_addStyle // eslint-disable-line camelcase
    : (css) => {
      var head = document.getElementsByTagName('head')[0]
      if (head) {
        var style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = css
        head.appendChild(style)
        return css
      }
    }

  var css = `.image{position:relative;display:inline-block}.image:hover .download-link{opacity:1}.download-link{opacity:0;position:absolute;top:10px;right:60px;width:35px;height:35px;overflow:hidden;border-radius:0 0 7px 7px;box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);transition:all .3s cubic-bezier(.25,.8,.25,1);background-size:contain;background-color:#333;background-image:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgOWgtNFYzSDl2Nkg1bDcgNyA3LTd6TTUgMTh2MmgxNHYtMkg1eiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48L3N2Zz4=)}.download-link:hover{box-shadow:0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22)}.download-link:after{content:"";position:absolute;top:0;left:0;right:0;width:100%;height:5px;background:hsla(0,0%,100%,.3);opacity:0;border-radius:100%;transform:scale(1) translate(-50%);transform-origin:50% 50%}@keyframes ripple{0%{transform:scale(0);opacity:1}20%{transform:scale(25);opacity:1}to{opacity:0;transform:scale(40)}}.download-link:focus:not(:active):after{animation:ripple 1s ease-out}`

  addStyle(css)

  const CLASSES = {
    processed: 'js-has-download-button'
  }

  /**
 * Event delegation
 */
  function on (parent, eventName, childSelector, cb) {
    parent.addEventListener(eventName, function (event) {
      const matchingChild = event.target.closest(childSelector)

      if (matchingChild) {
        cb(matchingChild)
      }
    })
  }

  function createDownloadLink (imgContainer) {
  // Mark as processed
    imgContainer.classList.add(CLASSES.processed)

    const gifLink = imgContainer.querySelector('a.video_gif_source')
    // Image is an animated gif
    if (gifLink) {
    // Make it downloadable
      gifLink.setAttribute('download', '')
      return
    }

    let imgURL = ''
    const imgLink = imgContainer.querySelector('a')

    // Image has a full link
    if (imgLink) {
      imgURL = imgLink.href
    } else {
      const img = imgContainer.querySelector('img')
      if (img) {
        imgURL = img.src
      }
    }

    if (!imgURL) {
      return
    }

    const link = document.createElement('a')
    link.classList.add('download-link')
    link.setAttribute('href', imgURL)
    link.setAttribute('download', '')

    imgContainer.appendChild(link)
  }

  on(document.body, 'mouseover', `.image:not(.${CLASSES.processed})`, createDownloadLink)
}())
