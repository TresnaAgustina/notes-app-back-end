// Import module notes.js
const notes = require("./notes");
// import nanoid untuk membuat id unik
const { nanoid } = require("nanoid");

// fucion handler untuk menambahkan catatan
const addNoteHandler = (request, h) => {
  // ambil data dari request.payload
  const { title, tags, body } = request.payload;

  // generate id unik menggunakan nanoid
  const id = nanoid(16);
  // ambil waktu saat ini
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // buat objek catatan baru
  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  // simpan catatan ke dalam array notes
  notes.push(newNote);

  // cek apakah catatan berhasil ditambahkan atau tidak
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // jika berhasil menambahkan catatan
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  // jika gagal menambahkan catatan
  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);

  return response;
};

// fucion handler untuk menampilkan semua catatan
const getAllNotesHandler = () => ({
  status: "success",
  data: {
    notes,
  },
});

// fucion handler untuk menampilkan catatan berdasarkan id
const getNoteByIdHandler = (request, h) => {
  // ambil id dari request.params
  const { id } = request.params;
  // cari catatan berdasarkan id
  const note = notes.filter((n) => n.id === id)[0];
  // jika catatan ditemukan
  if (note !== undefined) {
    return {
      status: "success",
      data: {
        note,
      },
    };
  }
  // jika catatan tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });
  response.code(404);
  return response;
};

// fucion handler untuk mengubah catatan
const editNoteByIdHandler = (request, h) => {
  // ambil id dari request.params
  const { id } = request.params;
  // ambil data dari request.payload
  const { title, tags, body } = request.payload;
  // ambil waktu saat ini
  const updatedAt = new Date().toISOString();

  // cari index berdasarkan id
  const index = notes.findIndex((note) => note.id === id);
  // jika id ditemukan
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    // jika id ditemukan
    const response = h.response({
      status: "success",
      message: "Catatan berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
  // jika id tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan. Id tidak ditemukan",
  });
  response.code(404);
};

// fucion handler untuk menghapus catatan
const deleteNoteByIdHandler = (request, h) => {
  // ambil id dari request.params
  const { id } = request.params;
  // cari index berdasarkan id
  const index = notes.findIndex((note) => note.id === id);
  // jika id ditemukan
  if (index !== -1) {
    notes.splice(index, 1);
    // jika id ditemukan
    const response = h.response({
      status: "success",
      message: "Catatan berhasil dihapus",
    });
    response.code(200);
    return response;
  }
  // jika id tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Catatan gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
