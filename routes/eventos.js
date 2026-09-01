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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Evento'
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

// POST - Criar novo evento
/**
 * @swagger
 * /eventos/criar-evento:
 *   post:
 *     summary: Cadastra um novo evento
 *     tags:
 *       - Eventos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventoInput'
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: Evento criado com sucesso.
 *                 evento_id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/criar-evento', async (req, res) => {
  try {
    const {
      evento_nome,
      evento_descricao,
      evento_empresaid = 1,
      evento_filialid = 1,
      evento_datainicio,
      evento_datafim,
      evento_datalimiteinscricao,
      evento_horainicialacesso,
      evento_horafinalacesso,
      evento_horainicialsaida,
      evento_horafinalsaida,
      evento_tipoevento,
      evento_valor,
      evento_valorcrianca,
      evento_vagas,
      evento_podebarraca,
      evento_podepet,
      evento_podesomalto,
      evento_horasilencioinicial,
      evento_horasilenciofinal,
      evento_tipopagamento,
      evento_tipocobranca,
      evento_idadecrianca,
      evento_logotipo,
      evento_local,
      evento_endereco,
      evento_cidade,
      evento_uf,
      evento_latitude,
      evento_longitude,
      evento_status = 'ATIVO',
      evento_responsavel,
      evento_foneresponsavel,
      evento_responsavelid
    } = req.body;

    if (!evento_nome || !evento_datainicio || !evento_datafim) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nome, data de início e data de fim são obrigatórios.'
      });
    }

    const camposEventos = [
      'evento_nome',
      'evento_descricao',
      'evento_empresaid',
      'evento_filialid',
      'evento_datainicio',
      'evento_datafim',
      'evento_datalimiteinscricao',
      'evento_horainicialacesso',
      'evento_horafinalacesso',
      'evento_horainicialsaida',
      'evento_horafinalsaida',
      'evento_tipoevento',
      'evento_valor',
      'evento_valorcrianca',
      'evento_vagas',
      'evento_podebarraca',
      'evento_podepet',
      'evento_podesomalto',
      'evento_horasilencioinicial',
      'evento_horasilenciofinal',
      'evento_tipopagamento',
      'evento_tipocobranca',
      'evento_idadecrianca',
      'evento_logotipo',
      'evento_local',
      'evento_endereco',
      'evento_cidade',
      'evento_uf',
      'evento_latitude',
      'evento_longitude',
      'evento_status',
      'evento_responsavel',
      'evento_foneresponsavel',
      'evento_responsavelid'
    ];

    const valoresEventos = [
      evento_nome,
      evento_descricao ?? null,
      evento_empresaid,
      evento_filialid,
      evento_datainicio,
      evento_datafim,
      evento_datalimiteinscricao ?? null,
      evento_horainicialacesso ?? null,
      evento_horafinalacesso ?? null,
      evento_horainicialsaida ?? null,
      evento_horafinalsaida ?? null,
      evento_tipoevento ?? null,
      evento_valor ?? null,
      evento_valorcrianca ?? null,
      evento_vagas ?? null,
      evento_podebarraca ?? null,
      evento_podepet ?? null,
      evento_podesomalto ?? null,
      evento_horasilencioinicial ?? null,
      evento_horasilenciofinal ?? null,
      evento_tipopagamento ?? null,
      evento_tipocobranca ?? null,
      evento_idadecrianca ?? null,
      evento_logotipo ?? null,
      evento_local ?? null,
      evento_endereco ?? null,
      evento_cidade ?? null,
      evento_uf ?? null,
      evento_latitude ?? null,
      evento_longitude ?? null,
      evento_status,
      evento_responsavel ?? null,
      evento_foneresponsavel ?? null,
      evento_responsavelid ?? null
    ];

    const [result] = await db.query(
      `INSERT INTO eventos (${camposEventos.join(', ')}) VALUES (${camposEventos.map(() => '?').join(', ')})`,
      valoresEventos
    );

    res.status(201).json({
      sucesso: true,
      mensagem: 'Evento criado com sucesso.',
      evento_id: result.insertId
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar evento.',
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evento'
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
 * /eventos/{idevento}/previsao:
 *   get:
 *     summary: Retorna a previsão do tempo para uma cidade
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
 *         description: Previsão do tempo para a cidade 
 *       404:
 *         description: Cidade não encontrada
 */   
      router.get('/:idevento/previsao', async (req, res) => {
        const eventoId = req.params.idevento;
        // busca cidade e estado do do evento
        const [cidadeUf] = await db.query('select evento_cidade, evento_uf from eventos where evento_id = ?', [eventoId]);  
        if (cidadeUf.length === 0) {
          return res.status(404).json({
              mensagem: 'Evento não encontrado'
          });
        }
        const cidade= cidadeUf[0].evento_cidade;
        const uf = cidadeUf[0].evento_uf;        
        const filtered= {};
        //verificar se já tem previsao do tempo para cidade e uf no dia
        const prevBanco = await db.query(' select * from eventos e ' +
                                         ' join evento_previsao ep on e.evento_id = ep.evento_previsao_eventoid ' +
                                         ' where e.evento_cidade  = ? ' +
                                         ' and e.evento_uf=? '+
                                         ' and evento_previsao_atualizacao = curdate()', [cidade, uf]);
        // se tem registro no banco para o dia, utiliza ele
        if (prevBanco[0].length > 0) {
            filtered.cidade = prevBanco[0][0].evento_cidade;
            filtered.uf = prevBanco[0][0].evento_uf;
            filtered.temperatura = prevBanco[0][0].evento_previsao_temperatura + '°C';
            filtered.condicao = prevBanco[0][0].evento_previsao_previsao;
            filtered.cod_condicao = Number(prevBanco[0][0].evento_previsao_codimagem);
            filtered.min = prevBanco[0][0].evento_previsao_temperatura + '°C';
            filtered.max = prevBanco[0][0].evento_previsao_temperatura + '°C';
            //filtered.probabilidade_chuva = prevBanco[0][0].evento_previsao_probabilidade_chuva + '%';
            filtered.icone = '';  
            filtered.idevento = prevBanco[0][0].evento_previsao_eventoid;          
            filtered.origin = 'Banco de Dados';
        } else {
            // Se não tem registro no banco, consome API
            const response = await fetch(`https://api.hgbrasil.com/weather?format=json-cors&key=6bd9592b&city_name=${cidade},${uf}`);
            const data = await response.json();        
            filtered.cidade = data.results.city.split(',')[0];
            filtered.uf =data.results.city.split(',')[1];
            filtered.temperatura = data.results.temp + '°C';
            filtered.condicao = data.results.description;
          // filtered.forecast = data.results.forecast;
            filtered.min = data.results.forecast[0].min + '°C';
            filtered.max = data.results.forecast[0].max + '°C';
            filtered.cod_condicao = Number(data.results.condition_code);
            //filtered.probabilidade_chuva = data.results.forecast[0].rain_probability + '%';
            filtered.icone = '';  
            filtered.idevento = eventoId;   
            filtered.origin = 'API';    
            // verifica se o evento existe no banco, se existir grava a previsão do tempo para o evento
            const [eventoExiste] = await db.query('select * from eventos where evento_id = ?', [eventoId]);
            if (eventoExiste.length > 0) {
               const updatePrevisaoEvento = await db.query('UPDATE evento_previsao SET evento_previsao_previsao=?, evento_previsao_temperatura=?, evento_previsao_codimagem=?, evento_previsao_atualizacao=curdate() WHERE evento_previsao_eventoid=?', [filtered.condicao, Number(data.results.temp), filtered.cod_condicao, eventoId]);  
            }else{
               const gravaPrevisaoEvento = await db.query('INSERT INTO evento_previsao (evento_previsao_eventoid,evento_previsao_previsao,evento_previsao_temperatura,evento_previsao_codimagem,evento_previsao_atualizacao) VALUES (?,?,?,?, curdate())', [eventoId, filtered.condicao, Number(data.results.temp),filtered.cod_condicao]);
            }
        
           // console.log('Gravou previsão do tempo no banco para evento -> ' + eventoId);
          }
        // tratamendo para código de condição
       const tempestade = [0,1,2,3,4,37,38,39,47];
       const neve = [5,7,13,14,15,16,17,18,35,41,42,43,46];
       const chuva = [6,9,10,11,12,40,45];
       const geada = [8,19,20,21,22];
       const nublado = [23,24,25,26];
       const noite_limpa = [27,31,33];
       const sol_nuvem = [28,30,44];
       const noite_nuvem = [29];
       const dia_limpo = [32,36];

       if(tempestade.includes(filtered.cod_condicao)){
          filtered.icone = 'cloud-lightning-rain';
       }
       if(neve.includes(filtered.cod_condicao)){
         filtered.icone = 'cloud-snow';
       }
       if(chuva.includes(filtered.cod_condicao)){
         filtered.icone = 'cloud-rain';
       }
       if(geada.includes(filtered.cod_condicao)){
         filtered.icone = 'cloud-fog';
       }
       if(nublado.includes(filtered.cod_condicao)){
         filtered.icone = 'cloudy';
       }
       if(noite_limpa.includes(filtered.cod_condicao)){
         filtered.icone = 'moon';
       }
       if(sol_nuvem.includes(filtered.cod_condicao)){
         filtered.icone = 'cloud-sun';
       }
       if(noite_nuvem.includes(filtered.cod_condicao)){
         filtered.icone = 'cloud-moon';
       }
       if(dia_limpo.includes(filtered.cod_condicao)){
         filtered.icone = 'sun';
       }         
         res.json(filtered);

      });
  // previsao do tempo atual
 
      
       module.exports = router;

