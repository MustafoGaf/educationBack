const fs = require("fs");
const path = require("path");

class Test {
  constructor(test, req) {
    this.test = test;
    this.req = req;
  }
  toJSON() {
    return {
      test: this.test,
      req: this.req,
    };
  }

  // async save() {
  //   const courses = await Courses.getAll();
  //   courses.push(this.toJSON());
  //   return new Promise((resolve, reject) => {
  //     fs.writeFile(
  //       path.join(__dirname, "..", "data", "Lessons.json"),
  //       JSON.stringify(courses),
  //       (err) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve();
  //         }
  //       }
  //     );
  //   });
  // }

  // static async update(course) {
  //   const courses = await Courses.getAll();

  //   const idx = courses.findIndex((c) => c.course_id == course.course_id);
  //   courses[idx] = course;

  //   return new Promise((resolve, reject) => {
  //     fs.writeFile(
  //       path.join(__dirname, "..", "data", "Lessons.json"),
  //       JSON.stringify(courses),
  //       (err) => {
  //         if (err) {
  //           reject(err);
  //         } else {
  //           resolve();
  //         }
  //       }
  //     );
  //   });
  // }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "Test.json"),
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

  static async getByName(test) {
    const tests = await Test.getAll();

    return tests.filter((t) => t.test == test)[0].questions;
  }

  static async delete(id) {
    const courses = await Courses.getAll();

    const new_courses = courses.filter((c) => c.course_id != id);

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "Lessons.json"),
        JSON.stringify(new_courses),
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
module.exports = Test;
