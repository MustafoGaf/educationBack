const fs = require("fs");
const path = require("path");
const Group = require("./group");
const Courses = require("./courses");

class Lesson {
  constructor(
    course_id,
    name,
    descriptions,
    id,
    has_video,
    has_content,
    prev,
    next,
    content,
    src_video
  ) {
    this.id = id;
    this.course_id = course_id;
    this.descriptions = descriptions;
    this.name = name;
    this.has_video = has_video;
    this.has_content = has_content;
    this.prev = prev;
    this.next = next;
    this.content = content;
    this.src_video = src_video;
  }
  toJSON() {
    return {
      id: this.id,
      course_id: this.course_id,
      name: this.name,
      descriptions: this.descriptions,
      has_video: this.has_video,
      has_content: this.has_content,
      prev: this.prev,
      next: this.next,
      content: this.content,
      src_video: this.src_video,
    };
  }

  static async update(lesson, id) {
    const lessons = await Courses.getById(lesson.course_id);
    console.log(lessons);

    const idx = lessons[0].lessons.findIndex((c) => c.id == id);
    lessons[0].lessons[idx] = lesson;
    lessons[0].lessons[idx].id = Number(id);
    await Courses.update(...lessons);
  }

  static async save(course) {
    const lesson = await Courses.getById(course.course_id);
    console.log(lesson);

    lesson[0].lessons.push({
      id: course.id,
      name: course.name,
      description: course.description,
      has_video: course.has_video,
      has_content: course.has_content,
      prev: course.prev,
      next: course.next,
      content: course.content,
      src_video: course.src_video,
    });
    await Courses.update(...lesson);
  }

  static async delete(course) {
    const lessons = await Courses.getById(course.course_id);

    const courses = lessons[0].lessons.filter((c) => c.id != course.id);
    lessons[0].lessons = courses;
    await Courses.update(...lessons);
  }
}

module.exports = Lesson;
