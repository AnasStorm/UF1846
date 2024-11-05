require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const ebooks = require('./ebooks.json'); 

app.use(express.static('public'));



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});




app.get('/api', (req, res) => {
    const sortedAuthors = ebooks.sort((a, b) => {
      return a.autor_apellido.localeCompare(b.autor_apellido);
    });
    res.json(sortedAuthors);
  });




  app.get('/api/apellido/:apellido', (req, res) => {
    const { apellido } = req.params;
    const filteredAuthors = ebooks.filter(author => author.autor_apellido.toLowerCase() === apellido.toLowerCase());
    if (filteredAuthors.length > 0) {
      res.json(filteredAuthors);
    } else {
      res.status(404).json({ message: `No se encontraron autores con el apellido '${apellido}'` });
    }
  });



  app.get('/api/nombre_apellido/:nombre/:apellido', (req, res) => {
    const { nombre, apellido } = req.params;
    const filteredAuthors = ebooks.filter(
      author => 
        author.autor_nombre.toLowerCase() === nombre.toLowerCase() &&
        author.autor_apellido.toLowerCase() === apellido.toLowerCase()
    );
    if (filteredAuthors.length > 0) {
      res.json(filteredAuthors);
    } else {
      res.status(404).json({ message: `No se encontraron autores con el nombre '${nombre}' y apellido '${apellido}'` });
    }
  });
  


  app.get('/api/nombre/:nombre', (req, res) => {
    const { nombre } = req.params;
    const { apellido } = req.query;
    if (!apellido) {
      return res.status(400).json({ message: "Falta el parámetro apellido" });
    }
    const filteredAuthors = ebooks.filter(author => 
      author.autor_nombre.toLowerCase() === nombre.toLowerCase() &&
      author.autor_apellido.toLowerCase().startsWith(apellido.toLowerCase())
    );
    if (filteredAuthors.length > 0) {
      res.json(filteredAuthors);
    } else {
      res.status(404).json({ message: `No se encontraron autores con el nombre '${nombre}' y apellido que empiece con '${apellido}'` });
    }
  });
  



  app.get('/api/edicion/:year', (req, res) => {
    const { year } = req.params;
    const worksByYear = ebooks.flatMap(author => 
      author.obras.filter(work => work.edicion === parseInt(year))
    );
    if (worksByYear.length > 0) {
      res.json(worksByYear);
    } else {
      res.status(404).json({ message: `No se encontraron obras editadas en el año ${year}` });
    }
  });



  app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
