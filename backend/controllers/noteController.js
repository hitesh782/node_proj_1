const Employee = require('../models/Employee');
const Note = require('../models/note');

exports.createNote = async (req, res) => {
    try {
        const noteData = req.body;
        const employeeId = noteData.employee; // Assuming the user ID is provided in the request body
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const note = await Note.create(noteData);
        employee.notes.push(note._id); // Add the note's ID to the user's notes array
        await employee.save();

        res.status(201).json(note);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Note.findByIdAndDelete(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Remove the note's ID from the user's notes array
        const employee = await Employee.findOneAndUpdate(
            { notes: noteId },
            { $pull: { notes: noteId } },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
