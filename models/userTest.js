const fs = require("fs");
const path = require("path");

class UTest {
  constructor(test, firstName, name, persent) {
    this.test = test;
    this.firstName = firstName;
    this.name = name;
    this.persent = persent;
  }
  toJSON() {
    return {
      test: this.test,
      firstName: this.firstName,
      name: this.name,
      persent: this.persent,
    };
  }

  async save() {
    const utests = await UTest.getAll();

    utests.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "UTest.json"),
        JSON.stringify(utests),
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
        path.join(__dirname, "..", "data", "UTest.json"),
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

  // static async getById(id) {
  //   const courses = await Courses.getAll();
  //   return courses.filter((c) => c.course_id == id);
  // }

  // static async delete(id) {
  //   const courses = await Courses.getAll();

  //   const new_courses = courses.filter((c) => c.course_id != id);

  //   return new Promise((resolve, reject) => {
  //     fs.writeFile(
  //       path.join(__dirname, "..", "data", "Lessons.json"),
  //       JSON.stringify(new_courses),
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
}
module.exports = UTest;
