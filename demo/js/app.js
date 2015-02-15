requirejs.config({
    "baseUrl": ".",
    "paths": {
      "app": "js/app",
      "jquery": "../bower_components/jquery/dist/jquery.min",
      "jquery.stacky": "../dist/js/jquery.stacky"
    },
    "shim": {
        "jquery.stacky": ["jquery"]
    }
});

// Load the main app module to start the app
requirejs(["app/main-require"]);