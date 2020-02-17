const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/users");
const auth = require("../middelware/auth");
const Contact = require("../models/contacts");

//@route GET /api/contacts
//@desc   Get all users contacts
//@access Private
router.get("/", auth, async (req, res) => {
  // res.send("Get all contacts");
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });

    res.json(contacts);
  } catch (err) {
    console.error("error 1: ", err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST /api/contacts
//@desc   Add new contacts
//@access Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Please add name")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // res.send("Add contact");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.log("error2: ", err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route PUT /api/contacts/:id
//@desc   Update contact
//@access Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  const contactFields = {};

  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact is not found" });

    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        $set: contactFields
      },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

//@route DELETE /api/contacts/:id
//@desc   Update contact
//@access Private
router.delete("/:id", auth, async (req, res) => {
  // res.send("Delete contact");
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "Contact is not found" });

    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact is removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
