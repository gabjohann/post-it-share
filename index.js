const express = require("express");
const { saveNote } = require("./db");
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
    <p>Compartilhe sua nota através do link
      <br />
      <span>${req.headers.origin}/note/${id}</span>
    </p>
    `);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`);
});
