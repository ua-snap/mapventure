# mapventure

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

After cloning this repo, you can build with:

```
npm install
bower install
grunt serve
```

Run `grunt build` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Production configuration changes

For the production configuration of MapVenture, set two operating system environment variables to provide the production GeoServer URLs. The environment variables to set are GEOSERVER_URL and MV_LEAFLET_IMAGE_PATH.

`MV_LEAFLET_IMAGE_PATH` should be set to point to the directory where images built into Leaflet live, and on the production server this is likely to just be `/images/`.

Here is a development example of setting the environment variables:

```
export GEOSERVER_URL="http://localhost:8080/geoserver"
export MV_LEAFLET_IMAGE_PATH="bower_components/leaflet/dist/images"
```

Once the URLs are set, run either:

```
grunt serve
```

or:

```
grunt build
```

Note: If the system variables are not set, it will default to use `http://localhost:8080/geoserver/wms` for GeoServer.  There is no meaningful default for the Leaflet image path.

## Git-hooks Installation and Usage

First, download the binary for your environment from: https://github.com/git-hooks/git-hooks/releases

Untar and move the binary within the extracted build directory into your $PATH. Be sure to rename it as just 'git-hooks' like:

`mv git-hooks-<etc> /usr/local/bin/git-hooks`

Run the following command in your local mapventure repository: `git hooks install`

Now when creating a branch from master, the branch will have the post-checkout command to prune our Bower components.

## Adding a new custom map and styles

To customize behavior for a map so that it's not using the DefaultMapController:

 1. Add a new directory to the `app/scripts/maps` directory.
 2. Copy/paste the `app/scripts/maps/default/controller.js` file there, and customize it as required.
 3. Add the UUID for the map to the `app/scripts/services/mapregistry.js` file.
 4. Add the new controller and map files to the `index.html` so they are included/minified (see how it's done for the `default` controller/tour for the proper syntax).

To customize CSS per-map:

 1. Create a new SCSS file in `app/styles`.
 2. In that SCSS file, create one wrapper class that corresponds to the UUID for the map *prepended with an underscore*.  For example: `._d5a90928-2119-11e6-92e2-08002742f21f { // styles here... }`.
 3. Add an `@import('newStyleFile.scss')` block to the `main.scss` file.
