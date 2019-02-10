const jwt = require("jsonwebtoken");
const models = require("../../models");
const Promise = require("bluebird");
const { sequelize } = require("../../models");
const key = require("../../config/api.json").API_SECRET;
var BusLiveInfo = {};


BusLiveInfo.addRoute = function(info) {
  return new Promise(function(resolve, reject) {
      return sequelize
        .transaction(function(t) {
          return models.bus_live_status
            .create(info, { transaction: t })
            .then(function(data) {
              resolve( data );     
            })
            .catch(function(err) {
              console.log(err);
              reject( err );
            });
    });
  });
};

BusLiveInfo.deleteRoute = info =>
  new Promise((resolve, reject) => {
    models.bus_live_status
      .destroy({
        where: {
          bus_no: info.bus_no
        }
      })
      .then(deleted => {
        if (deleted === 0) {
          console.log("error");
          reject(new Error());
        } else {
          resolve(deleted);
        }
      })
      .catch(err => {
        reject(err);
      });
  });


  BusLiveInfo.findTheLiveBus = (info) => new Promise((resolve,reject) => {
    models.bus_live_status
    .findOne({
      where: {
        bus_no: info.bus_no 
        },raw:true
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });

module.exports = BusLiveInfo;