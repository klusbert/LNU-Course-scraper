import mongoose from 'mongoose'

/**
 * A class that creates a connection to mongoDB.
 *
 */
export default class Database {
  /**
   * Initiate Database class.
   *
   * @param {string} connectionString - The url to mongoDB
   * @param {string} dbName - The name of the DB.
   */
  constructor (connectionString, dbName) {
    this._connectionString = connectionString + dbName
  }

  /**
   * Creates a connection and return that instance.
   *
   *@returns {Promise<mongoose>} Return a mongoose object.
   */
  async getConnection () {
    mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
    mongoose.connection.on('error', err => console.error(err))
    mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

    // use new URLparser to avoid warnings, in later version that will be removed.
    // useUnifiedTopology: true removes a warning.
    return mongoose.connect(this._connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  }
}
