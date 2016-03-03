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

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Production configuration changes

For the production configuration of MapVenture, set two operating system environment variables to provide the production GeoNode and GeoServer URLs. The environment variables to set are GEONODE_URL and GEOSERVER_URL. Here is a development example of setting the environment variables:

```
export GEONODE_URL="http://localhost:8000"
export GEOSERVER_URL="http://localhost:8080/geoserver"
```

Once the URLs are set, run either:

```
grunt serve
```

or:

```
grunt build
```

Note: If the system variables are not set, it will default to using http://localhost:8000 for GeoNode and http://localhost:8080/geoserver/wms for GeoServer.

## Git-hooks Installation and Usage

First, download the binary for your environment from: https://github.com/git-hooks/git-hooks/releases

Untar and move the binary within the extracted build directory into your $PATH. Be sure to rename it as just 'git-hooks' like:

`mv git-hooks-<etc> /usr/local/bin/git-hooks`

Run the following command in your local  mapventure repository: `git hooks install`

Now when creating a branch from master, the branch will have the post-checkout command to prune our Bower components.
