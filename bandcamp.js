function injectScript(url) {
  var script = document.createElement("script");
  script.setAttribute("src", url);
  document.head.appendChild(script);
}

injectScript(chrome.extension.getURL("/bandcamp_actual.js"));
injectScript("https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1");
