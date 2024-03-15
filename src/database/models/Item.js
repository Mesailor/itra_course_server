const { sequelize } = require("../database");
const { DataTypes } = require("sequelize");
const Collection = require("./Collection");

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

module.exports = Item;
