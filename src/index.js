import express from "express";
import cors from "cors";
import Joi from "joi";
import users from "./db.js";

const app = express();
app.use(express.json());
// 1st option to enable backend for frotend
app.use(cors());

// 2nd option to enable backend for frotend
// const corsOptions = {
//   origin: "http://localhost:3000", // frontend address
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello");
});

// Get Users
app.get("/api/users", (req, res) => {
  res.send(users);
});

// Post User
app.post("/api/users", (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newUser = {
    id: users.length + 1,
    ...req.body,
  };
  users.push(newUser);
  res.send(newUser);
});

// Delete User
app.delete("/api/users/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) return res.status(400).send("User does not exist in db");

  const index = users.indexOf(user);
  users.splice(index, 1);
  res.send(user);
});

// Put User
app.put("/api/users/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) return res.status(400).send("User does not exist in db");

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const index = users.indexOf(user);
  users[index] = { ...user, ...req.body };
  res.send(users[index]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));

function validateUser(user) {
  const schema = Joi.object({
    fullName: Joi.string()
      .regex(/\b[A-Z][a-z]* [A-Z][a-z]*( [A-Z])?\b/)
      .required(),
    email: Joi.string()
      .regex(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
    phoneNumber: Joi.string()
      .regex(/^[0-9]{9}/)
      .required(),
  });

  return schema.validate(user);
}
