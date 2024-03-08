const { Sequelize, DataTypes } = require("sequelize");
const config = require("config");
const bcrypt = require("bcrypt");

const { database, username, password, host, port } = config.get("dbConfig");

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: "mysql",
});

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 64],
        isAlphanumeric: true,
        isLowercase: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 64],
        is: /^[!-z]{60}$/,
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

const Collection = sequelize.define(
  "Collection",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "My collection",
      validate: {
        len: [1, 32],
        is: /[a-zA-Z0-9 ]{1,32}/,
      },
    },
    topic: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "other",
      validate: {
        len: [1, 16],
        isAlpha: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
      validate: {
        is: /[!-z ]*/,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "url_of_default_image",
    },
    itemsSchema: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: JSON.stringify({
        custom_str1_name: "",
        custom_str1_state: false,
        custom_str2_name: "",
        custom_str2_state: false,
        custom_str3_name: "",
        custom_str3_state: false,
        custom_int1_name: "",
        custom_int1_state: false,
        custom_int2_name: "",
        custom_int2_state: false,
        custom_int3_name: "",
        custom_int3_state: false,
        custom_bool1_name: "",
        custom_bool1_state: false,
        custom_bool2_name: "",
        custom_bool2_state: false,
        custom_bool3_name: "",
        custom_bool3_state: false,
        custom_date1_name: "",
        custom_date1_state: false,
        custom_date2_name: "",
        custom_date2_state: false,
        custom_date3_name: "",
        custom_date3_state: false,
        custom_multext1_name: "",
        custom_multext1_state: false,
        custom_multext2_name: "",
        custom_multext2_state: false,
        custom_multext3_name: "",
        custom_multext3_state: false,
      }),
    },
  },
  {
    timestamps: false,
  }
);

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

module.exports = {
  connect,
  createUser,
  getUser,
  getCollections,
  createCollection,
  updateImageUrl,
  deleteCollection,
  updateCollection,
};

// STUBS
// const { collections } = require("../../stubs");
// collections.forEach((collection) => {
//   Collection.create(collection);
// });
