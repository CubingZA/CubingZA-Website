# CubingZA

This is the source code for the CubingZA website which can be found at https://cubingza.org.

## Getting Started


### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`
- (Optional) [Angular CLI](https://github.com/angular/angular-cli)

### Running locally

There are three independent components that need to be set up and run: the database (MongoDB), the API (Express server), and the website (Angular).

1. If you don't already have an instance of MongoDB running, run `mongod` in a separate shell. You'll probably want to create a new folder for the database files and specify this as an argument when running the database. The default in runDB.sh is `../Data/db`.

2. Change to the `server` directory and the run `npm install` to install server dependencies.

3. Create the file `server/config/local.env.js` with app secrets. For local development, you can simply copy the sample file `server/config/local.env.sample.js`, but you will need to set the Mailgun details to your own. It is recommended to use a sandbox domain. Note that verifications are still charged on a sandbox domain.

4. Start the API server by running `npm start` while in the `server` directory. You can also run the server from within the `client` directory by running `npm --prefix ../server start`, or you can run the "Run backend" task from within VS Code. The API server can be accessed at `http://localhost:9000`.

5. Start the web server by running `ng serve` from within the `client` directory. Navigate to `http://localhost:4200`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

To test the website, run `ng test` from within the `client` directory to execute the unit tests via [Karma](https://karma-runner.github.io).

To test the API, run `npm test` from within the `server` directory to execute tests via [Jest](https://jestjs.io).

## Contributing 

We welcome contributions from everyone! For major changes, please open an issue first to discuss what you would like to change. Here are a few guidelines to help you get started.

1. Fork this repository and clone it to your local machine. You can then get up and running by following the Getting Started instructions above.
2. Create a new branch for your changes: `git checkout -b your-branch-name`.
3. Make your changes and ensure all tests pass by running the unit tests for both the website and API. It is recommended that you add any tests needed to cover your changes.
4. Commit your changes with a descriptive commit message: `git commit -am 'Add new feature'`.
5. Push your changes to your forked repository: `git push origin your-branch-name`.
6. Open a pull request against the main branch of the original repository.
7. Be responsive to feedback and be willing to make changes as needed.

### Issues

If you find a bug or have a feature request, please create a new issue on our Github repository. Please include as much detail as possible, including steps to reproduce the issue and any error messages.

## License

This project is licensed under the terms of the MIT license. See LICENSE for more information, or ror more information about the MIT License, you can visit the [official website](https://opensource.org/license/mit/).
