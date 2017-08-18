## GitHub Pages URL: https://intel-iot-devkit.github.io/upm/
## Dependencies:
* NodeJs
* Gulp
* A bunch of other stuff installed through bundle and ruby gems

## Prepare Dev Environment:
* Run npm install, in the same directory as the code. This will install all the dependencies automatically

## Gulp Tasks:
1. clean: to clean local build directories and resources
2. build: to generate the build for production using _config.yml, deploys to /_site
3. build:local: to generated the build using _config_dev.yml
4. serve: runs the app locally, using the _config_dev.yml file

## Global.yml
* Urls defined for fetching images, source code, and apis
* Whenever there are changes in facets.json/sensordetail.json files, increments the value in ajaxVersion to refresh the cache
* Whenever there are changes in css/js resources, increments the value in resourceVersion to refresh the cache

## _assets/gulp_config/paths.js
* Set paths.sensorDataSrc to the root of UPM /src

## Static Content:
* The sensor data is kept under /_assets/content/sensordetail.json
* The facets data is kept under /_assets/content/facets.json
* If images are missing, copy it over from _assets/gulp_config/images to _/site/assets/images

## Miscellaneous:
* _config_dev.yml has configurable properties for local
* _config.yml has properties for production deployment
* CNAME corresponds to the mapped cname in DNS provider
