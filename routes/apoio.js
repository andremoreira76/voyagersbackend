const express = require('express');
const router = express.Router();
const db = require('../database.js');
// get apoio
/**
 * @swagger
 * /apoio:
 *   get:
 *     summary: Lista todos os pontos de apoio
 *     tags:
 *       - Pontos de Apoio  
 *     responses:
 *       200:
 *         description: Lista de pontos de apoio
 */
router.get('/', async (req, res) => {
      try {
        const apoio = await db.query('select * from apoio');
        res.status(200).json({apoio});
      } catch (erro) {
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar apoio.',
            erro: erro.message
        });
      }
      });
      module.exports = router;