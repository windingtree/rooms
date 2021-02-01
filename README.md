# Winding Tree Rooms

Winding Tree's `Rooms` is an easy to use web application in ReactJS and NodeJS for small hoteliers to manage their inventory and expose it to the Winding Tree marketplace.

It aims at replacing the traditional *Pen and Paper* approach, but does not provide the depth of features and capabilities of a Channel Manager or Property Management System.

The project is open-source with an MIT license, meaning anyone can copy and use it for commercial usage. We do however appreciate sponsors and pull requests for any exciting features you would like to contribute back!

## Usage

Hoteliers can navigate to the Rooms user interface to create their hotels:

* [Production/Live](https://rooms.windingtree.com/)
* [Staging/Test](https://staging.rooms.windingtree.com/)

## API Documentation

Developers willing to integrate with Winding Tree `Rooms` can refer to the OpenAPI documentation at:

* [API Production/Live](https://rooms.windingtree.com/api/doc/)
* [API Staging/Test](https://staging.rooms.windingtree.com/api/doc)

## Local Development

The product can be run locally.

### Pre-requisites

The following tools should be installed. Please refer to their documentation:

* git
* node - From v12.18.3
* npm - From 6.14.6

`Rooms` also rely on a few infrastructure components:

* MongoDB: Make sure you have a MongoDB instance configured either locally or in the cloud
* SendGrid: Create a SendGrid account and generate a SendGrid API Key
* Vercel: Create an account on Vercel to deploy your instance

### Setting-up a local environment

The following steps allow to prepare a local environment:

* Clone the repository and navigate to the `rooms` folder:

```shell
git clone https://github.com/windingtree/rooms.git
cd rooms
```

* Install UI dependencies:

```shell
npm install
```

* Install API dependencies:

```shell
cd api
npm install
cd ..
```

* Create an environment file:

Create a `.env` file and provide the various settings there:

| Variable | Usage | Example |
|-|-|-|
| `MONGODB_URL` | MongoDB connection string | `mongodb://login:password@localhost:27017/rooms` |
| `ROOMS_DB_NAME` | MongoDB database name | `rooms` |
| `REACT_APP_JWT_SECRET` | Web client authentication secret for the API backend | `29835uyr3248ru34r0892ru2r9uiru2` |
| `ENV_ENCRYPTION_DETAILS` | Encryption key for the configuration database | `aes-256-ctr:FZFdSKNy:37c1c1481da7e2e624e92997b914a55d` |

(TODO: Add sample `.env` file in repo)

**Hint**: If you already have a project setup in Vercel, you can simply run the following command to pull your settings and create the `env` file:

```shell
vercel env pull
```

* Create configuration keys in Database:

(TODO: List variables and provide a script)

* Run locally using vercel:

```shell
npm run dev
```

**Note**: If it is your first run, you will be guided with the setup flow with Vercel.

* Navigate to your local instance with a browser:

[http://localhost:3000](http://localhost:3000)

### Developing the API

See additional docs in [api/README](./api/README.md).

### Working on the API docs

You can generate Swagger documentation locally by running the provided script `build-local-swagger.sh`. Once generated, the API docs will be accessible via the URL [http://localhost:3000/api/doc/](http://localhost:3000/api/doc/).

If you want to update the API documentation, please edit the file [swagger.yaml](./swagger/api/v1/swagger.yaml). After each update to the `.yaml` file, you have to re-run the `build-local-swagger.sh` script to see updates locally.

## License

See [LICENSE](LICENSE) for more details.
