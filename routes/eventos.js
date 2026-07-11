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
        const [eventos] = await db.query('select * from eventos');
        res.status(200).json({ eventos });
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
      try {
        const [eventos] = await db.query("select * from eventos where evento_status='ATIVO' and evento_datafim >= curdate() order by evento_datainicio asc" );
        if (eventos.length === 0) {
          return res.status(404).json({
              mensagem: 'Evento não encontrado'
          });
        }
        res.json(eventos);
      } catch (erro) {
        console.error(erro);
        res.status(500).json({
          sucesso: false,
          mensagem: 'Erro ao buscar eventos ativos.',
          erro: erro.message
        });
      }
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
      try {
        const [eventos] = await db.query('select * from eventos where evento_id = ?', [req.params.id]);
        if (eventos.length === 0) {
          return res.status(404).json({
              mensagem: 'Evento não encontrado'
          });
        }
        res.json(eventos[0]);
      } catch (erro) {
        console.error(erro);
        res.status(500).json({
          sucesso: false,
          mensagem: 'Erro ao buscar evento por id.',
          erro: erro.message
        });
      }
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
        try {
          const [participantes] = await db.query('SELECT count(*) as quantidade ' +                   
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
        } catch (erro) {
          console.error(erro);
          res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar quantidade de participantes.',
            erro: erro.message
          });
        }
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
        try {
          const [participantes] = await db.query('SELECT * ' +                   
                                               'FROM usuarios u ' +
                                               'JOIN evento_x_usuario exu ON evento_x_usuario_usuario_id = u.usuario_id ' +
                                               'JOIN eventos e ON e.evento_id = exu.evento_x_usuario_eventoid ' +           
                                               'WHERE e.evento_id = ?', [req.params.idevento]);
         
         if (participantes.length === 0) {
          return res.status(404).json({
              mensagem: 'Evento não encontrado'
          });
         }
          res.json(participantes);
        } catch (erro) {
          console.error(erro);
          res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar participantes do evento.',
            erro: erro.message
          });
        }
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
  // previsao do tempo atual
         /**
 * @swagger
 * /eventos/{cidade}/{uf}/{idevento}/previsao:
 *   put:
 *     summary: Atualiza a previsão do tempo para uma cidade e evento
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
 *       - in: path
 *         name: idevento
 *         description: ID do evento
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Previsão do tempo para a cidade 
 *       404:
 *         description: Cidade não encontrada
 */   
      router.put('/:cidade/:uf/:idevento/previsao', async (req, res) => {
        try {
          const { cidade, uf } = req.params;
          const idevento = Number(req.params.idevento);
          const response = await fetch(`https://api.hgbrasil.com/weather?format=json-cors&key=6bd9592b&city_name=${cidade},${uf}`);
          const data = await response.json();
          const filtered= {};
          filtered.cidade = data.results.city.split(',')[0];
          filtered.uf =data.results.city.split(',')[1];
          filtered.temperatura = data.results.temp;
          filtered.condicao = data.results.description;
          filtered.codimagem = data.results.img_id;
         // filtered.forecast = data.results.forecast;
          filtered.min = data.results.forecast[0].min + '°C';
          filtered.max = data.results.forecast[0].max + '°C';
          filtered.probabilidade_chuva = data.results.forecast[0].rain_probability + '%';
          const [existeEvento] = await db.query('select * from evento_previsao  where evento_previsao_eventoid = ?', [req.params.idevento]);
          if (existeEvento.length === 0) {
            return res.status(404).json({ error: 'Evento não encontrado' });
          }
          const dataHoje = new Date().toISOString().split('T')[0];
          const dataAtual = existeEvento[0].evento_previsao_atualizacao.toISOString().split('T')[0];
          if (dataAtual === dataHoje) {
            return res.status(400).json({ error: 'A previsão do tempo já foi atualizada hoje' });
          }
          console.log('Data atual do evento -> ' + dataAtual + 'Data de hoje -> ' + new Date().toDateString());
         
          const [result] = await db.query(
            'UPDATE evento_previsao ' +
            'SET evento_previsao_previsao = ?, ' +
            'evento_previsao_temperatura = ?, ' +
            'evento_previsao_codimagem = ?, ' +
            'evento_previsao_atualizacao = ? ' +
            ' WHERE evento_previsao_eventoid = ?',
            [ filtered.condicao,Number(filtered.temperatura), filtered.codimagem, dataHoje, Number(req.params.idevento)]
          );

          if (result.affectedRows > 0) {
            res.json({ message: 'Previsão do tempo atualizada com sucesso', previsao: filtered });
          } else {
            res.status(500).json({ error: 'Erro ao atualizar previsão do tempo' });
          }
        } catch (erro) {
          console.error(erro);
          res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar previsão do tempo.',
            erro: erro.message
          });
        }
      });
       module.exports = router;

