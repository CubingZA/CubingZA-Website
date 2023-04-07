export default {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://127.0.0.1/project-test'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
};
