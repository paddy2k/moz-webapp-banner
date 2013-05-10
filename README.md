Webapp Banner for Firefox Mobile
=================
This is a smart banner for webapps targeting Mozilla Firefox (Desktop, Android & Firefox OS).
App details are pulled from the webapp manifest file. 

![Example](https://dl.dropboxusercontent.com/u/1727430/pics/mozBanr.jpg)

Future releases will include additional information automatically pulled from the Firefox Marketplace. (ratings, reviews etc)

Usage
=================
Include the JS and CSS file in the head of your page, then initialize the banner with the path to the manifest file.

mozBanr.init(); // defaults to '/manifest.webapp'

or

mozBanr.init('/app/manifest.webapp');
