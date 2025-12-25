const Subject = require('../models/subjectschema');
const User = require('../models/userschema');

// GET
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.json(subjects);
  } catch (error) {res.status(500).json({ message: error.message });}
};
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (error) {res.status(500).json({ message: error.message });}
};

// POST
const createSubject = async (req, res) => {
  try {
    const {name} = req.body;
    const subjectExists = await Subject.findOne({name});
    if (subjectExists) return res.status(400).json({ message: 'Subject already exists' });
    const subject = await Subject.create({ name });
    res.status(201).json(subject);
  } catch (error) {res.status(400).json({ message: error.message });}
};

//PUT
const updateSubjectDescription = async (req, res) => {
    try {
        const { description } = req.body;
        const subjectId = req.params.id;

        const updatedSubject = await Subject.findByIdAndUpdate(subjectId,
            { description: description },{ new: true, runValidators: true }
        );
        if (!updatedSubject) {return res.status(404).json({ message: 'Subject not found' });}
        res.json(updatedSubject);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports={getAllSubjects, getSubjectById, createSubject, updateSubjectDescription};