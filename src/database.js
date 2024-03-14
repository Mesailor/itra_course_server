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
      type: DataTypes.ENUM("books", "signs", "silverware", "other"),
      allowNull: false,
      defaultValue: "other",
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
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: JSON.stringify({
        custom_str1_name: "",
        custom_str2_name: "",
        custom_str3_name: "",
        custom_int1_name: "",
        custom_int2_name: "",
        custom_int3_name: "",
        custom_bool1_name: "",
        custom_bool2_name: "",
        custom_bool3_name: "",
        custom_date1_name: "",
        custom_date2_name: "",
        custom_date3_name: "",
        custom_multext1_name: "",
        custom_multext2_name: "",
        custom_multext3_name: "",
      }),
    },
  },
  {
    timestamps: false,
  }
);

const Item = sequelize.define("Item", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  collection_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Collection,
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "New Item",
    validate: {
      is: /^[a-zA-Z0-9 ]*$/,
    },
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: "",
  },
  custom_str1_value: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: "",
    validate: {
      is: /[!-z ]{0,255}/,
    },
  },
  custom_str2_value: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: "",
    validate: {
      is: /[!-z ]{0,255}/,
    },
  },
  custom_str3_value: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: "",
    validate: {
      is: /[!-z ]{0,255}/,
    },
  },
  custom_int1_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: true,
    },
  },
  custom_int2_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: true,
    },
  },
  custom_int3_value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: true,
    },
  },
  custom_date1_value: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: "2024-01-01",
    validate: {
      isDate: true,
    },
  },
  custom_date2_value: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: "2024-01-01",
    validate: {
      isDate: true,
    },
  },
  custom_date3_value: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: "2024-01-01",
    validate: {
      isDate: true,
    },
  },
  custom_bool1_value: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  custom_bool2_value: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  custom_bool3_value: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  custom_multext1_value: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
    validate: {
      is: /[!-z \n]*/,
    },
  },
  custom_multext2_value: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
    validate: {
      is: /[!-z \n]*/,
    },
  },
  custom_multext3_value: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
    validate: {
      is: /[!-z \n]*/,
    },
  },
});

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
