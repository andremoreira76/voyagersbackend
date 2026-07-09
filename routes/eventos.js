const express = require('express');
const router = express.Router();
const db = require('../database.js');


// get eventos
/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Lista todos os eventos
 *     tags:
 *       - Eventos
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/', async (req, res) => {
      try {
        const eventos = await db.query('select * from eventos');
        res.status(200).json({eventos});
      } catch (erro) {
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar eventos.',
            erro: erro.message
        });
      }
      });
// get eventos ativos
/**
 * @swagger
 * /eventos/ativos:
 *   get:
 *     summary: Lista eventos ativos
 *     tags:
 *       - Eventos 
 *     responses:
 *       200:
 *         description: Lista de eventos ativos
 */
      router.get('/ativos', async (req, res) => {
      const eventos = await db.query("select * from eventos where evento_status='ATIVO' and evento_datafim >= curdate() order by evento_datainicio asc" );
      console.log(eventos);
      if (eventos.length === 0) {
        return res.status(404).json({
            mensagem: 'Evento não encontrado'
        });
       }
        res.json(eventos[0]);
     
        });

// Get evento by ID
/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Retorna um evento por id
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 */   
      router.get('/:id', async (req, res) => {
      const eventos = await db.query('select * from eventos where evento_id = ?', [req.params.id]);
       if (eventos.length === 0) {
        return res.status(404).json({
            mensagem: 'Evento não encontrado'
        });
       }
        res.json(eventos[0]);
     
        });
       
       //Quantidade de inscritos no evento
       /**
 * @swagger
 * /eventos/{idevento}/quantidade-participantes:
 *   get:
 *     summary: Retorna quantidade de inscritos no evento
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: idevento
 *         description: ID do evento  
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quantidade de participantes do evento
 *       404:
 *         description: Sem participantes
 */   
       router.get('/:idevento/quantidade-participantes',async (req, res) => {
        const participantes = await db.query('SELECT count(*) as quantidade ' +                   
                                             'FROM usuarios u ' +
                                           'JOIN evento_x_usuario exu ON evento_x_usuario_usuario_id = u.usuario_id ' +
                                             'JOIN eventos e ON e.evento_id = exu.evento_x_usuario_eventoid ' +           
                                             'WHERE e.evento_id = ?', [req.params.idevento]);
       
       if (participantes.length === 0) {
        return res.status(404).json({
            mensagem: 'Evento não encontrado'
        });
       }
        res.json(participantes[0]);
     
      })
       //Participantes do evento
       /**
 * @swagger
 * /eventos/{idevento}/participantes:
 *   get:
 *     summary: Retorna participantes do evento
 *     tags:
 *       - Eventos
 *     parameters:
 *       - in: path
 *         name: idevento
 *         description: ID do evento  
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participantes do evento
 *       404:
 *         description: Sem participantes
 */   
       router.get('/:idevento/participantes',async (req, res) => {
        const participantes = await db.query('SELECT * ' +                   
                                             'FROM usuarios u ' +
                                             'JOIN evento_x_usuario exu ON evento_x_usuario_usuario_id = u.usuario_id ' +
                                             'JOIN eventos e ON e.evento_id = exu.evento_x_usuario_eventoid ' +           
                                             'WHERE e.evento_id = ?', [req.params.idevento]);
       
       if (participantes.length === 0) {
        return res.status(404).json({
            mensagem: 'Evento não encontrado'
        });
       }
        res.json(participantes[0]);
     
      })
      // previsao do tempo atual
         /**
 * @swagger
 * /eventos/{cidade}/{uf}/previsao:
 *   get:
 *     summary: Retorna a previsão do tempo para uma cidade
 *     tags:
 *       - Eventos 
 *     parameters:
 *       - in: path
 *         name: cidade
 *         description: Nome da cidade
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: uf
 *         description: Sigla do estado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Previsão do tempo para a cidade 
 *       404:
 *         description: Cidade não encontrada
 */   
      router.get('/:cidade/:uf/previsao', async (req, res) => {
        const { cidade, uf } = req.params;
        const response = await fetch(`https://api.hgbrasil.com/weather?format=json-cors&key=6bd9592b&city_name=${cidade},${uf}`);
        const data = await response.json();
        const filtered= {};
        filtered.cidade = data.results.city.split(',')[0];
        filtered.uf =data.results.city.split(',')[1];
        filtered.temperatura = data.results.temp + '°C';
        filtered.condicao = data.results.description;
       // filtered.forecast = data.results.forecast;
        filtered.min = data.results.forecast[0].min + '°C';
        filtered.max = data.results.forecast[0].max + '°C';
        filtered.probabilidade_chuva = data.results.forecast[0].rain_probability + '%';
        res.json(filtered);
      });

       module.exports = router;

