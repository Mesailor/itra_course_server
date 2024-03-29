const { Sequelize, Op } = require("sequelize");
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

async function createUser({ name, password, isAdmin }) {
  const newUser = {
    name,
    password: await bcrypt.hash(password, 10),
    isAdmin,
  };
  return await User.create(newUser);
}

async function getUser({ name, id }) {
  if (name) {
    return await User.findOne({ where: { name: name } });
  }
  return await User.findOne({ where: { id } });
}

async function getAllCollections(user_id) {
  return await Collection.findAll({
    where: {
      user_id,
    },
  });
}

async function getUsers() {
  return await User.findAll();
}

async function getCollection(collectionId) {
  return await Collection.findOne({
    where: {
      id: collectionId,
    },
  });
}

async function getManyCollections(collectionIds) {
  return await Collection.findAll({
    where: {
      [Op.or]: collectionIds.map((id) => ({ id })),
    },
  });
}

async function getFiveLargestColls() {
  const collLengths = await Item.findAll({
    attributes: [
      "collection_id",
      [sequelize.fn("COUNT", sequelize.col("id")), "items_number"],
    ],
    group: "collection_id",
    order: [["items_number", "DESC"]],
  });

  collLengths.splice(5);

  const largestCollIds = collLengths.map(
    (collLength) => collLength.collection_id
  );

  const largestColls = await getManyCollections(largestCollIds);

  const collections = largestCollIds.map((id) => {
    for (let collection of largestColls) {
      if (collection.id == id) return collection;
    }
  });
  return collections;
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
  await Item.destroy({
    where: {
      collection_id: id,
    },
  });
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

async function getItems(collectionId) {
  return await Item.findAll({
    where: {
      collection_id: collectionId,
    },
  });
}

async function getItem(id) {
  return await Item.findOne({
    where: {
      id,
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
  getUsers,
  getAllCollections,
  getCollection,
  getManyCollections,
  getFiveLargestColls,
  createCollection,
  updateImageUrl,
  deleteCollection,
  updateCollection,
  getItems,
  getItem,
  createItem,
  deleteItem,
  updateItem,
};

// STUBS
// const { items } = require("../../stubs");
// items.forEach((item) => {
//   Item.create(item);
// });
