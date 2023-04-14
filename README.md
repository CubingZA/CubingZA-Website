# CubingZA

This is the source code for the Cubing South Africa Website which runs at https://cubingza.org.

## Getting Started

There are three independent components that need to be set up and run: The Database, the API, and the website.

1. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running. You'll probably want to create a new folder for the database files and specify this as an argument when running the database. The default in runDB.sh is `../Data/db`.

2. Change to the `server` directory and the run `npm install` to install server dependencies.

3. Create the file `server/config/local.env.js` with app secrets. For local development, you can simply copy the sample file `server/config/local.env.sample.js`, but you will need to set the Mailgun details to your own. It is recommended to use a sandbox account.

4. Start the API server by running `npm start` while in the `server` directory. You can also run the server from within the `client` directory by running `npm --prefix ../server start`, or you can run the "Run backend" task from within VS Code. The API server can be accessed at `http://localhost:9000`.

5. Start the web server by running `ng serve` from within the `client` directory. Navigate to `http://localhost:4200`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

To test the website, run `ng test` from within the `client` directory to execute the unit tests via [Karma](https://karma-runner.github.io).

To test the API, run `npm test` from within the `server` directory.

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`
- (Optional) [Angular CLI](https://github.com/angular/angular-cli)

## License

This project is licensed under the terms of the MIT license. See LICENSE for more information, or ror more information about the MIT License, you can visit the [official website](https://opensource.org/license/mit/).
