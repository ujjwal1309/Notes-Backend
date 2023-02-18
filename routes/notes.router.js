const express = require("express");
const { NoteModel } = require("../models/notes.model");

const notesRouter = express.Router();

/**
 * @swagger
 * components:
 *    schemas:
 *      Note:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            description: The auto-generated id of the user
 *          title:
 *            type: string
 *            description: Title of the notes
 *          body:
 *            type: string
 *            description: Content of the notes
 */

/**
 * @swagger
 * tags:
 *  name: Notes
 *  description: All the API routes related to User
 */

/**
 * @swagger
 * /notes:
 *  get:
 *      summary: This will get all the notes that belongs to the registered user
 *      tags: [Notes]
 *      responses:
 *          200:
 *              description: The list of all the users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                               $ref: "#/components/schemas/Note"
 */

notesRouter.get("/", async (req, res) => {
  const { user } = req.body;
  try {
    const notes = await NoteModel.find({ user });
    res.send(notes);
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error.message });
  }
});

notesRouter.get("/:id",async (req,res)=>{
  const id=req.params.id;
  try {
    const note=await NoteModel.find({_id:id});
    res.send(note);
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error });
  }
})

/**
 * @swagger
 * /notes/create:
 *  post:
 *    summary: This will add a new note
 *    tags: [Notes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Note"
 *    responses:
 *      200:
 *        description: The Note has been successfully created 
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Note"
 *      500:
 *        description: Some server error
 */

notesRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const note = new NoteModel(payload);
    await note.save();
    res.send({ msg: "Note has been successfully created" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error });
  }
});

/**
 * @swagger
 * /notes/delete/{id}:
 *  delete:
 *    summary: It will delete the note
 *    tags: [Notes]
 *    parameters:
 *      - in: path
 *        name: id;
 *        schema:
 *          type: string
 *        required: true
 *        description: The note id
 *    responses:
 *      200:
 *          description: The note has been deleted
 *          content:
 *            application/json:
 *              schema:
 *                 ref: "#/components/schemas/Note"
 *      404:
 *          description: The user was not found
 *      500:
 *          description: Some error happened
 */

notesRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await NoteModel.findByIdAndDelete({ _id: id });
    res.send({ msg: "Note has been successfully deleted" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error });
  }
});

/**
 * @swagger
 * /notes/update/{id}:
 *  patch:
 *    summary: It will update the note
 *    tags: [Notes]
 *    parameters:
 *      - in: path
 *        name: id;
 *        schema:
 *          type: string
 *        required: true
 *        description: The note id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Note"
 *    responses:
 *      200:
 *          description: The note has been updated
 *          content:
 *            application/json:
 *              schema:
 *                 ref: "#/components/schemas/Note"
 *      404:
 *          description: The user was not found
 *      500:
 *          description: Some error happened
 */

notesRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await NoteModel.findByIdAndUpdate({ _id: id },req.body);
    res.send({ msg: "Note has been successfully updated" });
  } catch (error) {
    res.send({ msg: "Something went wrong", error: error });
  }
});

module.exports = { notesRouter };
