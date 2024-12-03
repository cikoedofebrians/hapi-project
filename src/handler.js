const { nanoid } = require('nanoid');
const notes = require('./notes.js');

const addNoteHandler = (request, h) => {
  const { title, tags, body }= request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);
  console.log(notes);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Note added successfully.',
      data: {
        noteId: id,
      }
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status : 'fail',
    message: 'Failed to add note',
  });

  response.code(500);
  return response;
};

const getAllNotesHandler = (request, h) => {
  return h.response({
    status: 'success',
    data: { notes, },
  }).code(200);
};

const getNotesByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.find((note) => note.id === id);
  if (note) {
    return h.response({
      'status' : 'success',
      'data' : { note },
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Failed to get note',
  }).code(404);
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body }= request.payload;

  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index >= 0) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Note edited successfully.',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Failed to edit note',
  }).code(404);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index >= 0) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Note deleted successfully.',
    });
    response.code(200);
    return response;
  }

  return h.response({
    status: 'fail',
    message: 'Failed to delete note',
  }).code(404);
};
module.exports = { addNoteHandler, getAllNotesHandler, getNotesByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };