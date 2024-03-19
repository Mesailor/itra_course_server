const { sequelize } = require("../database");
const { DataTypes } = require("sequelize");
const User = require("./User");

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
    indexes: [{ fields: ["user_id"] }],
    timestamps: false,
  }
);

module.exports = Collection;
