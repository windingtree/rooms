# Rooms API

This is the API source code. It is written in TypeScript. It is a stand alone package, so please run `npm install` in this directory before all else.

## Available commands

To build API source code (generates JS output in `./dist` folder):

```sh
npm run build

# or
npm run build:watch # so that you can spot errors in real time, as you develop
```

To run unit tests:

```sh
npm run test
```

To lint API source code against project defined ESLint rules:

```sh
npm run lint

# or
npm run lint:fix # make ESLint fix errors which can be automatically fixed
```

## Running MongoDB locally

There are setup scripts available to run MongoDB locally as a Docker container. For more details, see [README](./_docker/README.md)  in `./_docker` folder.

## Code documentation

You can find more details about the structure of the code base, and a discussion of some architectural decisions in [_docs/README](./_docs/README.md) file.
