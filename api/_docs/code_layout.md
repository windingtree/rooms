# Code layout

## File/folder structure

You can see that the code is structured in several top level directories:

```
api
api/_docker
api/_docs
api/_lib
api/_postman
api/_tests
api/v1
```

The main idea behind each directory is as follows:

- all API request handlers go in the folder `api/v1`; in the future, if there will be a next version of the API, it can be placed in the folder `api/v2`; future revisions can follow the same approach
- all functions, classes, type definitions, etc. that are used by request handlers, go in folder `api/_lib`
- any relevant API code documentation can be found in `api/_docs`; you are reading it right now ;)
- unit tests are located in `api/_tests`
- Postman tests (integration testing of a working API with a working MongoDB) are located in `api/_postman`
- helper scripts to raise local infrastructure (MongoDB, etc.) are located in `api/_docker`

## rationale behind "api/_lib"

The heart of the API can be found in the various functions, classes, type definitions, etc. in the folder `api/_lib`. It is split into several sub-folders, so as to setup a basic interface/application/data/infrastructure flow. Common routines, along with types, and constants, are placed in a `common` folder.

The flow of data between the various API layers can be described visually like so:

```
request <> interface <> application <> data <> infrastructure
              ^
              v
          validation

                                   (common)
```

Where:

- all of the different layers can access the `common` stuff, and also the `infrastructure` layer
- `interface` layer has 1 sub layer beneath it for `validation` routines
- from the start of the project, the aim was to follow the Liskov substitution principle when coding up the various components/classes/functions; more work needs to be done in this area
- single-responsibility principle was also considered when adding a new entity into the system
