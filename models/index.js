const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(module.filename);
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/config.json')[env];
const db        = {};
var sequelize ={};

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize
		.authenticate()
		.then(() => {
			console.log('Connection has been established successfully.');
		})
		.catch((err) => {
			console.log('Unable to connect to the database:', err);
		});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import Models such that I can use them in the api just by importing 'db'
db.employees = require('./employee')(sequelize, Sequelize);
db.employee_credentials = require('./employee_credentials')(sequelize, Sequelize);
db.route_master = require('./routes/route_master')(sequelize, Sequelize);
db.busstop_master = require('./busstop_master')(sequelize, Sequelize);
db.route_details = require('./routes/route_details')(sequelize, Sequelize);
// db.route_direction = require('./route_direction')(sequelize, Sequelize);

// db.all_routes = require('./all_routes')(sequelize, Sequelize);

module.exports = db;