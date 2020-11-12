const express = require('express');
const parse = require('csv-parse');
const knex = require('knex')(
  process.env.NODE_ENV === 'production' ?
  require('./knexfile').production
  : require('./knexfile').development);
const multer = require('multer');
const upload = multer({ dest:'./uploads/', preservePath: true, storage: multer.memoryStorage() });
const app = express();
const port = process.env.PORT || 3000;

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
          const power = record['Potencia (MWh)'];
          const speed = record['Velocidade do vento (m/s)'];
          await knex('production').insert([{ curve_id: curve_id[0], power: typeof power === 'string' ? Number(power.replace(',', '.')) : power, speed: typeof speed === 'string' ? Number(speed.replace(',', '.')) : speed }]);
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
