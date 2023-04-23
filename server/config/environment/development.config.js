export default {

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1/project-dev'
  },

  // Seed database on startup
  seedDB: true

};
