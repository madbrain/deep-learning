System.config({
  defaultExtensions: true,
  packages: {
    "app": {
      "defaultExtension": "js",
      "main": "index.module.js"
    }
  },
  map: {
    "app": "tmp/app"
  },
  paths: {
    "npm:": "node_modules/"
  },
});
