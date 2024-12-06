const fs = require("fs");
const path = require("path");
const Group = require("./group");

class Course {
  constructor(group_id, course_id, name, descriptions) {
    this.group_id = group_id;
    this.course_id = course_id;
    this.descriptions = descriptions;
    this.name = name;
  }
  toJSON() {
    return {
      group_id: this.group_id,
      course_id: this.course_id,
      name: this.name,
      descriptions: this.descriptions,
    };
  }

  static async update(course) {
    const group = await Group.getById(course.group_id);

    const idx = group[0].courses.findIndex(
      (c) => c.course_id == course.course_id
    );
    group[0].courses[idx].name = course.name;
    group[0].courses[idx].descriptions = course.descriptions;
    await Group.update(...group);
  }

  static async save(course) {
    const group = await Group.getById(course.group_id);
    group[0].courses.push({
      course_id: course.course_id,
      name: course.name,
      descriptions: course.descriptions,
    });
    await Group.update(...group);
  }

  static async delete(course) {
    console.log(course);

    const group = await Group.getById(course.group_id);

    const courses = group[0].courses.filter(
      (c) => c.course_id != course.course_id
    );
    group[0].courses = courses;
    await Group.update(...group);
  }
}

module.exports = Course;
