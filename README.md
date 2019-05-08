# CubingZA

This is the source code for the Cubing South Africa Website which runs at https://cubingza.org

The project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 4.1.1.

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running. You'll probably want to create a new folder for the database files and specify this as an argument when running the database. The default in runDB.sh is `../Data/db`.

3. Create the file `server/config/local.env.js` with app secrets. For local development, simply you can simply copy the sample file `server/config/local.env.sample.js`, but you will need to set the Mailgun and WCA OAuth details to your own.

4. The files `cubecompetitions.json` and `cuberecords.json` must exist in the parent of the root folder.

5. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.
