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

## Git-hooks Installation and Usage

First, download the binary for your environment from: https://github.com/git-hooks/git-hooks/releases

Untar and move the binary within the extracted build directory into your $PATH. Be sure to rename it as just 'git-hooks' like:

`mv git-hooks-<etc> /usr/local/bin/git-hooks`

Run the following command in your local  mapventure repository: `git hooks install`

Now when creating a branch from master, the branch will have the post-checkout command to prune our Bower components.
