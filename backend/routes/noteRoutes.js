const express = require('express');
const router = express.Router();
// const noteController = require('../controllers/noteController');
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');

// // CRUD routes for notes
// router.post('/', noteController.createNote);
// router.get('/', noteController.getNotes);
// router.get('/:id', noteController.getNoteById);
// router.put('/:id', noteController.updateNote);
// router.delete('/:id', noteController.deleteNote);

// CRUD routes for notes
router.route('/')
    .post(createNote)
    .get(getNotes);

router.route('/:id')
    .get(getNoteById)
    .put(updateNote)
    .delete(deleteNote);

module.exports = router;
