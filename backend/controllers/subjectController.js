const Subject = require('../models/subjectschema');
const User = require('../models/userschema');
const Post = require('../models/postschema');
const {generateSubjectSummary} = require("../utils/aiService");

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
const summariseDay = async (req, res) => {
  const posts = await Post.find({ 
    subject: req.params.id,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });

  if (posts.length === 0) return res.json({ summary: "No new posts in the last 24 hours." });

  const summary = await generateSubjectSummary(posts);
  res.json({ summary });
};

// POST
const createSubject = async (req, res) => {
  try {
    const {name, description, pinnedPostContent, tags } = req.body;
    const creator=req.user._id;
    const subjectExists = await Subject.findOne({name});
    if (subjectExists) return res.status(400).json({ message: 'Subject already exists' });

    const subject = await Subject.create({ name,description,creator,tags:tags||[] });
    
    const pinnedPost = await Post.create({
      title: `Official Resources: ${name}`,
      content: pinnedPostContent,
      author: req.user._id,
      subject: subject._id,
      isPinned: true,  
      tags:tags||[]
    });

    subject.pinnedPost = pinnedPost._id;
    await subject.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { subscriptions: subject._id } 
    });

    const subs=await User.findById(req.user._id);
    
    res.status(201).json(subs.subscriptions);
  } catch (error) {res.status(400).json({ message: error.message });}
};

//PUT
const updateSubjectTags = async (req, res) => {
  const { tags } = req.body;
  console.log(tags);
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  if (subject.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to manage tags for this subject');
  }

  const updatedSubject = await Subject.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { tags: tags } },
    { new: true }
  );

  await Post.findByIdAndUpdate(
    updatedSubject.pinnedPost,
    { $addToSet: { tags: tags } },
    { new: true }
  );

  res.json(updatedSubject);
};

module.exports={getAllSubjects, getSubjectById, createSubject, updateSubjectTags, summariseDay};