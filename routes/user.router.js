const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = express.Router();
/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            description: The auto-generated id of the user
 *          name:
 *            type: string
 *            description: The username
 *          email:
 *            type: string
 *            description: User's Email
 *          password:
 *            type: string
 *            description: The user password
 *          age:
 *            type: integer
 *            description: Age of the user
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: All the API routes related to User
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: This will get all the user data from the database
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: The list of all the users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/User"
 */

userRouter.get("/", async (req, res) => {
  try {
    const user = await UserModel.find();
    res.send(user);
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

/**
 * @swagger
 * /users/register:
 *  post:
 *    summary: To post the details of a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *    responses:
 *      200:
 *        description: The user was successfully registered
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      500:
 *        description: Some server error
 */

userRouter.post("/register", (req, res) => {
  const { name, email, password, age } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new UserModel({ name, email, password: hash, age });
      await user.save();
      res.send({ msg: "User has been successfully registered" });
    });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: To check the user present in database
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: The user email
 *              password:
 *                type: string
 *                description: The user password
 *    responses:
 *      200:
 *        description: The user has successfully logged in
 *        content:
 *          application/json:
 *            schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: The user email
 *              password:
 *                type: string
 *                description: The user password
 *      500:
 *        description: Email and password doesn't match
 */

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userId: user[0]._id }, process.env.secret);
          res.send({ msg: "Login success", token: token });
        } else {
          res.send({ msg: "Wrong password" });
        }
      });
    } else {
      res.send({ msg: "Email and password doesn't match" });
    }
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

module.exports = { userRouter };
