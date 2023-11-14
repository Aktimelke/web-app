const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}


// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Проверяем валидность email
    if (!validateEmail(req.body.email)) {
      return res.status(400).json({ message: "Неверный формат email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    // Сохраняем пользователя в базе данных
    const user = await newUser.save();
    
    // Проверяем, был ли успешно сохранен пользователь
    if (!user) {
      return res.status(500).json({ message: "Не удалось создать пользователя" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err); // Выводим ошибку в консоль для анализа
    return res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});



// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("Неверные учетные данные!");
    }

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      return res.status(400).json("Неверные учетные данные!");
    }

    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});


module.exports = router;
