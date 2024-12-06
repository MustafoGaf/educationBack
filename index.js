const express = require("express");
const path = require("path");
const Course = require("./models/course");
const Group = require("./models/group");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./models/users");
const Courses = require("./models/courses");
const Lesson = require("./models/lessons");
const cors = require("cors");
const { log } = require("console");
const Test = require("./models/test");
const UTest = require("./models/userTest");
const SECRET_KEY = "mustafo_gaforov";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.get("/courses", async (req, res) => {
  const course = await Group.getAll();
  res.send(course);
});
app.post("/group", async (req, res) => {
  const groups = new Group(
    req.body.group_id,
    req.body.group_name,
    req.body.courses
  );
  await groups.save();
  const course = await Group.getAll();
  res.send(course);
});
app.put("/group/:id", async (req, res) => {
  await Group.update(req.body);
  const course = await Group.getAll();
  res.send(course);
});
app.delete("/group/:id", async (req, res) => {
  await Group.delete(req.params.id);
  console.log(">>>>");
  const course = await Group.getAll();
  res.send(course);
});

app.put("/course/:id", async (req, res) => {
  await Course.update(req.body);
  const course = await Group.getAll();
  res.send(course);
  //        { group_id:1,
  //         "course_id": 1,
  //         "name": "UX",
  //         "descriptions": "fdgjkd"
  //     }
});
app.delete("/course", async (req, res) => {
  await Course.delete(req.body);
  const course = await Group.getAll();
  res.send(course);
  //   {
  //     "group_id": 1,
  //     "course_id": 1
  // }
});

app.post("/course", async (req, res) => {
  await Course.save(req.body);
  const course = await Group.getAll();
  const courses = new Courses(req.body.course_id, req.body.name, []);
  await courses.save();
  res.send(course);
  //   // {
  //     "group_id": 1,
  //     "course_id": 67,
  //     "name": "REACT JT",
  //     "descriptions": "HELO WOLRD"
  // }
});

// auth

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Имя пользователя и пароль обязательны" });
  }

  // Хеширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new Users(username, hashedPassword);
  await user.save();
  res.status(201).json({ message: "Пользователь зарегистрирован" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findUser(username);
  if (!user) {
    return res
      .status(400)
      .json({ message: "Неверное имя пользователя или пароль" });
  }

  // Проверка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Неверное имя пользователя или пароль" });
  }

  // Генерация токена
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Успешный вход", token });
});

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(authHeader, token);

  if (!token) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Недействительный токен" });
    }
    req.user = user;
    next();
  });
}

// Пример защищённого маршрута
app.get("/hello", authenticateToken, (req, res) => {
  res.json({
    message: `Добро пожаловать, ${req.user.username}! Это защищённый маршрут.`,
  });
});

// для группа lessons-------------------------------------------------

app.get("/lessons", async (req, res) => {
  const courses = await Courses.getAll();
  res.send(courses);
});
app.post("/new/courses", async (req, res) => {
  const courses = new Courses(
    req.body.course_id,
    req.body.name,
    req.body.lessons
  );
  await courses.save();
  res.send(JSON.stringify(req.body)).status(200);
  console.log(req.body);
  // {
  //   "course_id": 10,
  //   "name": "fdgklfjdlkgjkl",
  //   "lessons": []
  //     }
});
app.put("/courses/:id", async (req, res) => {
  await Courses.update(req.body);
  res.send(JSON.stringify(req.body)).status(200);
  console.log(req.body);
  //   {
  //     "course_id": 10,
  //     "name": "Искуство комуникация",
  //     "lessons": []
  // }
});
app.delete("/courses/:id", async (req, res) => {
  await Courses.delete(req.params.id);
  const courses = await Courses.getAll();
  res.send([]);
});

//  РАбота с конкретной уроки
app.post("/lesson", async (req, res) => {
  await Lesson.save(req.body);
  res
    .send(
      JSON.stringify({
        message: "Успешно добавлено",
        data: [],
      })
    )
    .status(200);
  console.log(req.body);
  //  {
  //     "course_id": 10,
  //     "id": 12344578576,
  //     "name": "КАК стать программистом",
  //     "description": "Курс для влорыаолывралоырвмлрловап",
  //     "has_video": true,
  //     "has_content": true,
  //     "prev": 1,
  //     "next": 3,
  //     "content": "lfjgksdfjgkjdfshgk",
  //     "src_video": "vide.mp4"
  // }
});
app.put("/lesson/:id", async (req, res) => {
  try {
    await Lesson.update(req.body, req.params.id);
    const courses = await Courses.getAll();
    res
      .send(JSON.stringify({ message: "Успешно изменено", data: [] }))
      .status(200);
  } catch (error) {
    res.send(JSON.stringify({ message: "Ошибка при изменеие" })).status(404);
  }

  //  {
  //     "course_id": 10,
  //     "id": "12344578576",
  //     "name": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  //     "description": "FFFFFFFFFFFDFFFFFFFFFFFFFFFFFFFSCVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
  //     "has_video": true,
  //     "has_content": true,
  //     "prev": 1,
  //     "next": 3,
  //     "content": "DSFSAGDFDSGDGDFSGDGDFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
  //     "src_video": "vide.mp4"
  // }
});
app.delete("/lesson", async (req, res) => {
  await Lesson.delete(req.body);
  console.log(req.body);

  res.send(JSON.stringify(req.body)).status(200);
  console.log(req.body);
  //   {
  //     "course_id": 10,
  //     "id": 123445 // lesson
  // }
});

//---------------------------------------------------
//  test-------------
app.get("/test/:fan", async (req, res) => {
  try {
    const test = await Test.getByName(req.params.fan);
    res.send(JSON.stringify(test));
  } catch (error) {
    res.send("Тест не найден");
  }
});
app.post("/test/:fan", async (req, res) => {
  console.log(req.body);

  try {
    const test = new UTest(
      req.body.test,
      req.body.firstName,
      req.body.name,
      req.body.persent
    );
    await test.save();
    res.send(
      JSON.stringify({
        message: "Данные успешно сохранено",
      })
    );
  } catch (error) {
    res.send("Ошибка при сохранение");
  }
});
app.get("/statisca", async (req, res) => {
  const userTest = await UTest.getAll();
  res.send(JSON.stringify(userTest));
});
app.listen(3000, () => {
  console.log("Server runing at http://localhost:3000");
});

module.exports = app;
