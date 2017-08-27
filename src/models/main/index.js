import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import { DB_URL } from '../../config'
var sequelize = new Sequelize(DB_URL)
var db        = {}

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && (file !== 'index.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
