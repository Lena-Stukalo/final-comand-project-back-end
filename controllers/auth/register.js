const bcrypt = require('bcryptjs');
const { User } = require('../../models/user');
const { RequestError } = require('../../helpers');

const { SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const payload = {
    id: result._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });

  await User.findByIdAndUpdate(result._id, { token });

  res
    .status(201)
    .json({
      token,
      user: { name: result.name, email: result.email, balance: result.balance },
    });
};

module.exports = register;
