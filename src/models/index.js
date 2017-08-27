import Sequelize from 'sequelize'
import fs from 'fs'
import path from 'path'
import { DB_URL } from '../config'
import { IS_PROD } from '../config';

const dialectOptions = IS_PROD ? { ssl: 'require' } : {}

const mainSQL = new Sequelize(DB_URL, {
  logging: false,
  native: true,
  dialectOptions,
});

const db = {}

fs.readdirSync(`${__dirname}/main`)
  .filter(file => file.indexOf('.') !== 0 && (file !== 'index.js'))
  .forEach(file => {
    const model = mainSQL.import(path.join(__dirname, 'main', file))
    db[model.name] = model
  });

Object
  .keys(db)
  .forEach(modelName => {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db)
    }

    if ('hooks' in db[modelName]) {
      for (const hook in db[modelName].hooks) {
        if (db[modelName].hooks.hasOwnProperty(hook)) {
          db[modelName].hooks[hook](db[modelName])
        }
      }
    }
  })

db.sequelize = mainSQL

export default db
