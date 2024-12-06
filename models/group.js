const fs = require("fs");
const path = require("path");

class Group {
  constructor(group_id, group_name, courses) {
    this.group_id = group_id;
    this.group_name = group_name;
    this.courses = courses;
  }
  toJSON() {
    return {
      group_id: this.group_id,
      group_name: this.group_name,
      courses: this.courses,
    };
  }

  async save() {
    const group = await Group.getAll();
    group.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "Courses.json"),
        JSON.stringify(group),
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

  static async update(group) {
    const groups = await Group.getAll();

    const idx = groups.findIndex((c) => c.group_id == group.group_id);
    groups[idx] = group;

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "Courses.json"),
        JSON.stringify(groups),
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

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "Courses.json"),
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

  static async getById(id) {
    const groups = await Group.getAll();
    return groups.filter((g) => g.group_id == id);
  }

  static async delete(id) {
    const groups = await Group.getAll();

    const new_groups = groups.filter((g) => g.group_id != id);

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "Courses.json"),
        JSON.stringify(new_groups),
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
}
module.exports = Group;
