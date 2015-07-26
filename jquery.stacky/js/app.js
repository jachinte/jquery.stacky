requirejs.config({
    "baseUrl": ".",
    "paths": {
      "app": "js/app",
      "jquery": "js/lib/jquery.min",
      "jquery.stacky": "js/lib/jquery.stacky.min"
    },
    "shim": {
        "jquery.stacky": ["jquery"]
    }
});

// Load the main app module to start the app
requirejs(["app/main-require"]);