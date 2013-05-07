/*!
 * Webapp Banner for Firefox Mobile v0.1
 * https://github.com/paddy2k/moz-webapp-banner
 *
 * Copyright (c) 2013 Paddy O'Reilly - @paddy2k
 * Released under the GNU Public Licence V3
 * http://www.gnu.org/licenses/gpl-3.0.html
 *
 * Date: 04-05-2013
 */

var mozBanr = {
  init: function(manifest){
    var _this, path, manifest;

    if(navigator.mozApps && !window.localStorage[this.name]){ //
      _this = this;

      // Get path for manifest
      path = window.location.pathname.split('/');
      path[path.length-1] = '';

      manifest =  manifest || "/manifest.webapp"; // Set default if absent
      manifest = manifest.substr(0,1) == "/" ? manifest : path.join('/') + manifest;

      _this.manifestURL = window.location.protocol +"//"+ window.location.hostname + manifest;

      _this.util.get(_this.manifestURL, function(json){
        var manifest, searchURL;
        _this.manifest = JSON.parse(json);

        searchURL = _this.endpoints.search.replace('<%app_name%>', _this.manifest.name);
        _this.util.jsonp(
          searchURL,
          'mozBanr.searchCallback'
         );

        _this.insertBanner();
        _this.addEvents();
      });
    }
  },

  searchCallback: function(response){
    var app, nameMatch, _this;
    _this = this;

    if(response.meta.total_count && response.objects[0].name == _this.manifest.name){
      _this.app = response.objects[0];

    }
  },
  insertBanner: function(){
    var header;
    var app = {};

    app.name = this.app.name || this.manifest.name;
    app.description = this.app.description || this.manifest.description;
    app.icon = this.manifest.icons['128'] || this.manifest.icons['64'] || this.manifest.icons['48'] || this.manifest.icons['32'] || this.manifest.icons['24'] || this.manifest.icons['16'];
    app.install = this.strings[this.locale]['install'];

    header = document.createElement('header');
    header.id = this.name;
    header.innerHTML = '<nav><img id="mozBanr-close" src="'+app.icon+'"/><div class="divider"></div></nav><img id="mozBanr-logo" src="http://dublinbikes2go.com/apple-touch-icon.png"/><article id="mozBanr-copy"><h1 id="mozBanr-name">'+app.name+'</h1><h2 id="mozBanr-description">'+app.description+'</h2></article><button id="mozBanr-install">'+app.install+'</button><div class="divider divder-right"></div><div id="mozBanr-clear"></div>';

    // <header id="mozBanr">
    //   <nav>
    //     <img id="mozBanr-close" src="https://marketplace.cdn.mozilla.net/media/img/mkt/icons/close.png"/>
    //     <div class="divider"></div>
    //   </nav>
    //   <img id="mozBanr-logo" src="'+app.icon+'"/>
    //   <article id="mozBanr-copy">
    //     <h1 id="mozBanr-name">'+app.name+'</h1>
    //     <h2 id="mozBanr-description">'+app.description+'</h2>
    //   </article>
    //   <button id="mozBanr-install">'+app.install+'</button>
    //   <div class="divider divder-right"></div>
    //   <div id="mozBanr-clear"></div>
    // </header>

    document.body.insertBefore(header, document.body.firstChild);
  },
  addEvents: function(){
    var _this = this;

    document.getElementById('mozBanr-close').onclick = function(){
      var banner = document.getElementById(_this.name);
      banner.parentNode.removeChild(banner);

      window.localStorage.setItem(_this.name, _this.name);
    }

    document.getElementById('mozBanr-install').onclick = function(){alert(_this.manifestURL);
      var app = navigator.mozApps.install(_this.manifestURL);
      app.onsuccess = function(data) {
        // Prevent the banner appearing again
        window.localStorage.setItem(_this.name, _this.name);
      };

    }
  },

  util: {
    get : function(url, callback){
      var request;

      request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.onreadystatechange = function(){
        if(request.readyState === 4 && request.status === 200) {
          callback(request.response);
        }
      };
      request.send(null);
    },
    jsonp : function(endpoint, callback){
      var opr, script;

      callback = callback || "callback";
      opr = !!endpoint.match(/\?/) ? '&' : '?';

      script = document.createElement('script');
      script.type ="text/javascript";
      script.src = endpoint + opr + "callback=" + callback;
      document.body.appendChild(script);
    }
  },

  endpoints: {
    search: "https://marketplace.firefox.com/api/v1/apps/search/?q=<%app_name%>&app_type=hosted&format=JSON",
    app: "https://marketplace.firefox.com/api/v1/apps/app/<%app_name%>/?format=JSON"
  },

  locale: 'en',
  strings: {
    en : {
      install: "Install"
    }
  },

  app : false,
  manifest : false,

  name: 'mozBanr'
}