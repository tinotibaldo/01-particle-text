exports.config =
  # See http://brunch.io/#documentation for docs.
  files:
    javascripts:{
      entryPoints: {
        'app/main.js': 'bundle.js',
      }
    },
    stylesheets:
      joinTo: 'app.css'
    templates:
      joinTo: 'app.js'

