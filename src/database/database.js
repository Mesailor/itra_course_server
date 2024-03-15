const { Sequelize, DataTypes } = require("sequelize");
const config = require("config");
const bcrypt = require("bcrypt");

const { database, username, password, host, port } = config.get("dbConfig");

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: "mysql",
});
module.exports.sequelize = sequelize;

const User = require("./models/User");
const Collection = require("./models/Collection");
const Item = require("./models/Item");

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

async function createUser({ name, password }) {
  const newUser = {
    name,
    password: await bcrypt.hash(password, 10),
  };
  return await User.create(newUser);
}

async function getUser({ name, id }) {
  if (name) {
    return await User.findOne({ where: { name: name } });
  }
  return await User.findOne({ where: { id } });
}

async function getCollections(user_id) {
  return await Collection.findAll({
    where: {
      user_id,
    },
  });
}

async function createCollection(newCollection) {
  return await Collection.create(newCollection);
}

async function updateImageUrl({ imageUrl, collectionId }) {
  return await Collection.update(
    { imageUrl },
    {
      where: {
        id: collectionId,
      },
    }
  );
}

async function deleteCollection(id) {
  return await Collection.destroy({
    where: {
      id,
    },
  });
}

async function updateCollection({ newCollection, collectionId }) {
  return await Collection.update(newCollection, {
    where: {
      id: collectionId,
    },
  });
}

async function getCollection(collectionId) {
  return await Collection.findOne({
    where: {
      id: collectionId,
    },
  });
}

async function getItems(collectionId) {
  return await Item.findAll({
    where: {
      collection_id: collectionId,
    },
  });
}

async function createItem(newItem) {
  return await Item.create(newItem);
}

async function deleteItem(itemId) {
  return await Item.destroy({
    where: {
      id: itemId,
    },
  });
}

async function updateItem({ newItem, itemId }) {
  return await Item.update(newItem, {
    where: {
      id: itemId,
    },
  });
}

module.exports = {
  connect,
  createUser,
  getUser,
  getCollections,
  createCollection,
  updateImageUrl,
  deleteCollection,
  updateCollection,
  getCollection,
  getItems,
  createItem,
  deleteItem,
  updateItem,
};

// STUBS
// const { items } = require("../../stubs");
// items.forEach((item) => {
//   Item.create(item);
// });
