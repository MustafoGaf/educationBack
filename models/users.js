const fs = require("fs");
const path = require("path");
const Group = require("./group");

class Users {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
  toJSON() {
    return {
      password: this.password,
      username: this.username,
    };
  }

  async save() {
    const users = await Users.getAll();
    users.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "users.json"),
        JSON.stringify(users),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
  static async findUser(username) {
    const users = await Users.getAll();
    return users.find((user) => user.username === username);
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "users.json"),
        "utf-8",
        (err, content) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(content));
          }
        }
      );
    });
  }
}

module.exports = Users;
