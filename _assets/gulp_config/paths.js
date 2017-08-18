/**
 * Define variables for gulpfile.
 *
 * Kudos to https://github.com/robwise for the code and the lovely use of
 * whitespace.
 */

var paths = {};

// Directory locations.
paths.assetsDir        = '_assets/';      // The files Gulp will handle.
paths.jekyllAssetsDir  = 'assets/';       // The asset files Jekyll will handle.

paths.siteDir          = '_site/';        // The resulting static site.
paths.siteAssetsDir    = '_site/assets/'; // The resulting static site's assets.

// Folder naming conventions.
paths.imageFolderName   = 'images';
paths.scriptFolderName  = 'js';
paths.stylesFolderName  = 'css';
paths.contentFolderName = 'content';

// Asset files locations.
paths.sassFiles      = paths.assetsDir + paths.stylesFolderName;
paths.jsFiles        = paths.assetsDir + paths.scriptFolderName;
paths.imageFiles     = paths.assetsDir + paths.imageFolderName;
paths.contentFiles   = paths.assetsDir + paths.contentFolderName;

// Jekyll files locations.
paths.jekyllCssFiles      = paths.jekyllAssetsDir + paths.stylesFolderName;
paths.jekyllJsFiles       = paths.jekyllAssetsDir + paths.scriptFolderName;
paths.jekyllImageFiles    = paths.jekyllAssetsDir + paths.imageFolderName;
paths.jekyllContentFiles  = paths.jekyllAssetsDir + paths.contentFolderName;

// Site files locations.
paths.siteCssFiles     = paths.siteAssetsDir + paths.stylesFolderName;
paths.siteJsFiles      = paths.siteAssetsDir + paths.scriptFolderName;
paths.siteImageFiles   = paths.siteAssetsDir + paths.imageFolderName;
paths.siteContentFiles = paths.siteAssetsDir + paths.contentFolderName;

// Glob patterns by file type.
paths.jsPattern            = '/**/*.js';
paths.facetFile            = '/facets.json';
paths.jsonPattern          = '/**/*.json';
paths.sensorDataFile       = '/sensorDetail.json';
paths.sensorDataSrc        == "" //point to the UPM project src directory
paths.indexFile            = '/LunrIndex.json';
paths.imagePattern         = '/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)';
paths.imageFilesGlob       = paths.imageFiles + paths.imagePattern;

module.exports = paths;
