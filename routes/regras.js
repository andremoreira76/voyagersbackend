const express = require('express');
const router = express.Router();
const db = require('../database.js');

/**
 * @swagger
 * /regras/cadastrarRegra:
 *   post:
 *     summary: Cadastra uma nova regra
 *     tags:
 *       - Regras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:              
 *               - regras_tipo
 *               - regras_descricao
 *               - regras_eventoid
 *             properties:
 *               regras_tipo:
 *                 type: string
 *                 example: valores serão PROIBIDO PERMITIDO e OBRIGATÓRIO
 *               regras_descricao:
 *                 type: string
 *                 example: Respeitar o horário de silêncio do evento
 *               regras_eventoid:
 *                 type: integer
 *                 example: 10
 *               regras_obs:
 *                 type: string
 *                 nullable: true
 *                 example: Aplicável às áreas de camping
 *     responses:
 *       200:
 *         description: Regra cadastrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Regras cadastradas com sucesso!
 *       500:
 *         description: Erro ao cadastrar a regra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao cadastrar regra
*/
router.post('/cadastrarRegra', async (req,res) =>{
    const {
            regras_tipo,
            regras_descricao,
            regras_eventoid,
            regras_obs
    } = req.body;
    res.status(200).json({message: 'Regras cadastradas com sucesso!'});

    try{
    const [result] = await db.query('Insert into regras (regras_tipo, regras_descricao, regras_eventoid, regras_obs) values (?,?,?,?)',[regras_tipo, regras_descricao, regras_eventoid, regras_obs])
    res.json(result);
    }catch(erro){
        res.status(500).json({message:'Erro ao cadastrar regra: ' + erro.message});
    }
})
/**
 * @swagger
 * /regras/listarRegrasEvento/{eventoId}:
 *   get:
 *     summary: Lista as regras de um evento
 *     tags:
 *       - Regras
 *     parameters:
 *       - in: path
 *         name: eventoId
 *         required: true
 *         description: Identificador do evento
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Regras encontradas para o evento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   regras_id:
 *                     type: integer
 *                     example: 1
 *                   regras_tipo:
 *                     type: string
 *                     example: OBRIGATÓRIO
 *                   regras_descricao:
 *                     type: string
 *                     example: Respeitar o horário de silêncio do evento
 *                   regras_eventoid:
 *                     type: integer
 *                     example: 10
 *                   regras_obs:
 *                     type: string
 *                     nullable: true
 *                     example: Aplicável às áreas de camping
 *       404:
 *         description: Nenhuma regra encontrada para este evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhuma regra encontrada para este evento
 *       500:
 *         description: Erro ao listar regras
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar regras
 */
router.get('/listarRegrasEvento/:eventoId', async (req, res) => {
     const eventoId = req.params.eventoId;
     try{
     const [regras] = await db.query('SELECT * FROM regras WHERE regras_eventoid = ?', [parseInt(eventoId, 10)]);
     if (regras.length > 0) {
        res.status(200).json(regras);
     } else {
        res.status(404).json({message: 'Nenhuma regra encontrada para este evento'});
     }
     }catch(erro){
        res.status(500).json({message:'Erro ao listar regras: ' + erro.message});
     }
    })
/**
 * @swagger
 * /regras/atualizarRegra/{regraId}:
 *   put:
 *     summary: Atualiza uma regra existente
 *     tags:
 *       - Regras
 *     parameters:
 *       - in: path
 *         name: regraId
 *         required: true
 *         description: Identificador da regra a atualizar
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - regras_tipo
 *               - regras_descricao
 *             properties:
 *               regras_tipo:
 *                 type: string
 *                 example: OBRIGATÓRIO
 *               regras_descricao:
 *                 type: string
 *                 example: Respeitar o horário de silêncio do evento
 *               regras_obs:
 *                 type: string
 *                 nullable: true
 *                 example: Aplicável às áreas de camping
 *     responses:
 *       200:
 *         description: Regra atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Regra atualizada com sucesso!
 *       500:
 *         description: Erro ao atualizar a regra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao atualizar regra
 */
router.put('/atualizarRegra/:regraId', async (req, res) => {
    const regraId = req.params.regraId;
    const { regras_tipo, regras_descricao, regras_obs } = req.body; 
    const updateQuery = 'UPDATE regras SET regras_tipo = ?, regras_descricao = ?, regras_obs = ? WHERE regras_id = ?';
    try {
        const [result] = await db.query(updateQuery, [regras_tipo, regras_descricao, regras_obs, regraId]);    
        res.status(200).json({ message: 'Regra atualizada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ message: 'Erro ao atualizar regra: ' + erro.message });
    }
});
/**
 * @swagger
 * /regras/deletarRegra/{regraId}:
 *   delete:
 *     summary: Exclui uma regra
 *     tags:
 *       - Regras
 *     parameters:
 *       - in: path
 *         name: regraId
 *         required: true
 *         description: Identificador da regra a excluir
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Regra excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Regra deletada com sucesso!
 *       404:
 *         description: Regra não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Regra não encontrada
 *       500:
 *         description: Erro ao excluir a regra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao deletar regra
 */
router.delete('/deletarRegra/:regraId', async (req, res) => {
    const regraId = req.params.regraId; 
    const deleteQuery = 'DELETE FROM regras WHERE regras_id = ?';
    try {
        const [result] = await db.query(deleteQuery, [regraId]);    
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Regra deletada com sucesso!' });
        } else {
            res.status(404).json({ message: 'Regra não encontrada' });
        }
    } catch (erro) {
        res.status(500).json({ message: 'Erro ao deletar regra: ' + erro.message });
    }
}); 
module.exports = router;
