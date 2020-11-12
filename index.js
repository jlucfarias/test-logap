const express = require('express');
const parse = require('csv-parse');
const knex = require('knex')(require('./knexfile').development);
const multer = require('multer');
const upload = multer({ dest:'./uploads/', preservePath: true, storage: multer.memoryStorage() });
const app = express();
const port = 3000;

app.use('/static', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile('./index.html', {
    root: __dirname,
  });
});

app.get('/curves', async (req, res) => {
  let data;

  try {
    const curves = await knex('curves').select(['id', 'name']);

    if (curves.length > 0) {
      data = await curves.map(async curve => {
        try {
          const productions = await knex('production').select(['speed', 'power']).where('curve_id', curve.id);
          if (productions.length > 0) {
            return {
              name: curve.name,
              data: productions.map(p => {
                return { 'Velocidade do vento (m/s)': p.speed, 'Potencia (MWh)': p.power }
              })
            }
          }
        } catch (error) {
          console.error(error);  
        }
      });
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const body = await Promise.all(data);
    res.send(body);
  } catch (error) {
    console.error(error)    
  }
});

app.post('/', upload.single('arquivo-curva'), (req, res) => {
  const data = req.file.buffer.toString('utf-8');
  parse(data, {
    columns: true,
    delimiter: ';',
    trim: true
  }, async (err, records) => {
    try {
      const curve_id = await knex('curves').returning('id').insert([{name: req.body['nome-curva']}]);

      records.forEach(async record => {
        try {
          await knex('production').insert([{ speed: record['Velocidade do vento (m/s)'], power: record['Potencia (MWh)'], curve_id: curve_id[0] }]);
          res.send('Done');
        } catch (error) {
          console.error(error);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
});

app.listen(port, () => {});
