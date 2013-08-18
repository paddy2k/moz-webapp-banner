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
    var _this, path, manifest, request;
    manifest =  manifest || "/manifest.webapp"; // Set default if absent

    // Only show banner if not hidden and compatiable with mozApps
    if(navigator.mozApps && !window.localStorage[this.name]){ //
      _this = this;

      // Get absolute path for manifest
      path = window.location.pathname.split('/');
      path[path.length-1] = '';

      manifest = manifest.substr(0,1) == "/" ? manifest : path.join('/') + manifest;

      _this.manifestURL = window.location.origin + manifest;

      _this.util.get(_this.manifestURL, function(json){
        var manifest, searchURL;
        _this.manifest = JSON.parse(json);

        request = window.navigator.mozApps.getInstalled();
        request.onsuccess = function() {
          // Don't show if app installed
          if(request.result.length){
            return false;
          }

          _this.insertBanner();
          _this.addEvents();
        }

        // // Query the Marketplace API for rating etc.
        // searchURL = _this.endpoints.search.replace('<%app_name%>', _this.manifest.name).replace('<%app_type%>', _this.appType);
        // _this.util.jsonp(
        //   searchURL,
        //   'mozBanr.searchCallback'
        //  );
      });
    }
  },

  searchCallback: function(response){
    var app, nameMatch, _this;
    _this = this;

    // Only continue if the app names match
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

    // // HTML to be inserted into head of page
    // <header id="mozBanr">
    //   <nav>
    //     <i id="mozBanr-close"></i>
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
    header = document.createElement('header');
    header.id = this.name;
    header.innerHTML = '<nav><i id="mozBanr-close"></i><div class="divider"></div></nav><img id="mozBanr-logo" src="'+app.icon+'"/><article id="mozBanr-copy"><h1 id="mozBanr-name">'+app.name+'</h1><h2 id="mozBanr-description">'+app.description+'</h2></article><button id="mozBanr-install">'+app.install+'</button><div class="divider divder-right"></div><div id="mozBanr-clear"></div>';

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
      }
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
    search: "https://marketplace.firefox.com/api/v1/apps/search/?format=JSON&q=<%app_name%>&app_type=<%app_type%>",
    app: "https://marketplace.firefox.com/api/v1/apps/app/<%app_name%>/?format=JSON"
  },

  appType: "hosted",

  locale: 'en',
  strings: {
    en : {
      install: "Install",
      reviews: "Reviews",
      description: "Description",
      permissions: "Permissons",
      screenshots: "Screenshots"
    }
  },

  app : false,
  manifest : false,

  name: 'mozBanr'
}
