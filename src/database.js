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
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "My collection",
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Other",
    },
    description: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    custom_str1_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_str1_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_str2_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_str2_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_str3_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_str3_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_int1_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_int1_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_int2_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_int2_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_int3_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_int3_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_bool1_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_bool1_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_bool2_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_bool2_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_bool3_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_bool3_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_date1_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_date1_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_date2_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_date2_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_date3_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_date3_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_multext1_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_multext1_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_multext2_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_multext2_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
    },
    custom_multext3_state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    custom_multext3_name: {
      type: DataTypes.STRING,
      defaultValue: "custom string field",
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

async function getUser(name) {
  return await User.findOne({ where: { name: name } });
}

async function getOwnCollections(user_id) {
  return await Collection.findAll({
    where: {
      user_id,
    },
  });
}

async function createCollection(newCollection) {
  return await Collection.create(newCollection);
}

async function deleteCollection(id) {
  return await Collection.destroy({
    where: {
      id,
    },
  });
}

module.exports = {
  connect,
  createUser,
  getUser,
  getOwnCollections,
  createCollection,
  deleteCollection,
};

// STUBS
// const { collections } = require("../../stubs");
// collections.forEach((collection) => {
//   Collection.create(collection);
// });
