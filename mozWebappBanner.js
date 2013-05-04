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
  init: function(manifestURL){
    var _this;

    _this = this;

    manifestURL = manifestURL || "manifest.webapp";
    _this.util.get(manifestURL, function(json){
      var manifest, searchURL;

      _this.manifest = JSON.parse(json);

      searchURL = _this.endpoints.search.replace('<%app_name%>', _this.manifest.name);
      _this.util.jsonp(
        searchURL,
        'mozBanr.searchCallback'
       );
    });
  },
  searchCallback: function(response){
    var app, nameMatch, _this;
    _this = this;

    if(response.meta.total_count){
      _this.app = response.objects[0];

      nameMatch = _this.app.name == _this.manifest.name;
      console.log(nameMatch);

      if(nameMatch){
      }
    }
    else{
      
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
    search: "https://marketplace.firefox.com/api/v1/apps/search/?q=<%app_name%>&app_type=hosted&format=JSON"
  }
}

mozBanr.init();