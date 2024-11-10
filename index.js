const express = require("express");
const {
  saveNote,
  deleteExpiredNotes,
  getNote,
  markNoteAsOpened,
} = require("./db");

const app = express();

const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/note/:id", (req, res) => {
  res.sendFile(__dirname + "/public/note.html");
});

app.post("/notes", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.sendFile("<span>Erro inesperado!</span>");
  }

  const id = crypto.randomUUID();
  await saveNote(id, content);
  res.send(`
   <div class="content">
        <p>Compartilhe sua nota através do link</p>
        <div class="link-container">
          <span id="link">${req.headers.origin}/note/${id}</span>
          <button id="copy-btn" onclick="handleCopyLink()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
              <rect width="256" height="256" fill="none" />
              <polyline
                points="168 168 216 168 216 40 88 40 88 88"
                fill="none"
                stroke="#333"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
              <rect
                x="40"
                y="88"
                width="128"
                height="128"
                fill="none"
                stroke="#333"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="16"
              />
            </svg>
          </button>
        </div>
      </div>
  `);
});

app.get("/share/:id", async (req, res) => {
  await deleteExpiredNotes();

  const { id } = req.params;
  const note = await getNote(id);

  if (!note) {
    return res.sendFile(
      '<span class="error">Esta nota não existe mais!</span>'
    );
  }

  if (!note.opened_at) {
    await markNoteAsOpened(id);
  }

  res.send(note.content);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`);
});
