const express = require('express');
const router = express.Router();
const db = require('../database.js');
/**
 * @swagger
 * /eventosorganizador/listarEventosOrganizador/{organizadorId}:
 *   get:
 *     summary: Lista todos os eventos de um organizador específico
 *     tags:
 *       - EventosOrganizador
 *     parameters:
 *       - in: path
 *         name: organizadorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de eventos do organizador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Nenhum evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum evento encontrado
 *
 */
router.get('/listarEventosOrganizador/:organizadorId', async (req, res) => {
    const organizadorId = req.params.organizadorId;
    const [eventos] = await db.query('SELECT * FROM eventos e ' +
                               ' join evento_x_usuario eu on e.evento_id = eu.evento_x_usuario_eventoid ' +
                               ' where e.evento_responsavelid = ?', [parseInt(organizadorId, 10)]);
     if (eventos.length > 0) {
        res.json(eventos);
     }else{
        res.status(404).json({ message: 'Nenhum evento encontrado'});
     }                             
});
/**
 * @swagger
 * /eventosorganizador/llistarParticipantesEvento/{eventoId}:
 *   get:
 *     summary: Lista todos os participantes do evento
 *     tags:
 *       - EventosOrganizador
 *     parameters:
 *       - in: path
 *         name: eventoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista Participantes do evento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Nenhum Participante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum Participante encontrado
 *
 */
router.get('/listarParticipantesEvento/:eventoId', async (req, res) => {
    const eventoId = req.params.eventoId;
    const [participantes] = await db.query('select usuario_id,usuario_nome,eu.evento_x_usuario_pago ' +
                                           ' from usuarios u ' +
                                           ' join evento_x_usuario eu on eu.evento_x_usuario_usuario_id = u.usuario_id ' +
                                           ' where eu.evento_x_usuario_eventoid = ?' + 
                                           ' and eu.evento_x_usuario_confirmado =1',[parseInt(eventoId)]);

     if (participantes.length > 0) {
        res.json(participantes);
     }else{
        res.status(404).json({ message: 'Nenhum Participante encontrado'});
     }                             
});
/**
 * @swagger
 * /eventosorganizador/aprovarPagamento/{eventoId}/{usuarioId}:
 *   put:
 *     summary: Aprovar comprovante de pagamento
 *     tags:
 *       - EventosOrganizador
 *     parameters:
 *       - in: path
 *         name: eventoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagamento Atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Nenhum pagamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhum pagamento encontrado
 *
 */
router.put('/aprovarPagamento/:eventoId/:usuarioId', async (req, res) => {
    const eventoId = req.params.eventoId;
    const usuarioId = req.params.usuarioId;
    const aprovado = await db.query('update evento_x_usuario ' +
                                    ' set evento_x_usuario_pago = 1' + 
                                    ' where evento_x_usuario_usuario_id = ? ' + 
                                    ' and evento_x_usuario_eventoid = ? ' +
                                    ' and evento_x_usuario_confirmado =1 ',[parseInt(usuarioId),parseInt(eventoId)]);
     if (aprovado.length > 0) {
        //res.json(aprovado);
        res.status(200).json({message: "Registro atualizado com sucesso",confirmado:1});
     }else{
        res.status(404).json({ message: 'Nenhum registro Atualizado'});
     }                             
});

module.exports = router;