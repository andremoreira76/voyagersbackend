const express = require('express');
const router = express.Router();
const db = require('../database.js');
// get usuarios
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuarios
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', async (req, res) => {
      try {
        const usuarios = await db.query('select * from usuarios');
        res.status(200).json({usuarios});
      } catch (erro) {
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar usuarios.',
            erro: erro.message
        });
      }
      });
      // POST - Criar novo usuário
  /**
 * @swagger
 * /usuarios/novo-usuario:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_nome
 *               - usuario_usuario
 *               - usuario_senha
 *               - usuario_email
 *               - usuario_nascimento
 *               - usuario_cidade
 *               - usuario_uf
 *               - usuario_status
 *             properties:
 *               usuario_nome:
 *                 type: string
 *                 example: André Moreira
 *               usuario_usuario:
 *                 type: string
 *                 example: andre
 *               usuario_senha:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               usuario_email:
 *                 type: string
 *                 format: email
 *                 example: andre@email.com
 *               usuario_nascimento:
 *                 type: string
 *                 format: date
 *                 example: "1985-01-15"
 *               usuario_cidade:
 *                 type: string
 *                 example: Igrejinha
 *               usuario_uf:
 *                 type: string
 *                 example: RS
 *               usuario_status:
 *                 type: string
 *                 example: ATIVO
 *               usuario_empresaid:
 *                 type: integer
 *                 example: 1
 *               usuario_filialid:
 *                 type: integer
 *                 example: 1
 *               usuario_cep:
 *                 type: string
 *                 example: "95650-000"
 *               usuario_lat:
 *                 type: string
 *                 example: "-29.574821"
 *               usuario_long:
 *                 type: string
 *                 example: "-50.790253"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
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
 *                   example: Usuário cadastrado com sucesso.
 *                 usuario_id:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
  router.post('/novo-usuario', async (req, res) => {
    const { usuario_nome,
            usuario_usuario,
            usuario_senha,
            usuario_email,
            usuario_nascimento,
            usuario_cidade,
            usuario_uf,          
            usuario_status,
            usuario_empresaid,
            usuario_filialid,
            usuario_cep,
            usuario_lat,
            usuario_long
          } = req.body;  
       try {
        const bcrypt = require("bcrypt");
        const senhaHash = await bcrypt.hash(usuario_senha, 10);
        const usuarios = await db.query('INSERT INTO usuarios (usuario_nome, usuario_usuario, usuario_senha, usuario_email, usuario_nascimento, usuario_cidade, usuario_uf, usuario_status, usuario_empresaid, usuario_filialid, usuario_cep, usuario_lat, usuario_long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [usuario_nome, usuario_usuario, senhaHash, usuario_email, usuario_nascimento, usuario_cidade, usuario_uf, usuario_status, usuario_empresaid, usuario_filialid, usuario_cep, usuario_lat, usuario_long]);  
        res.status(201).json({
            sucesso: true,
            mensagem: 'Usuário cadastrado com sucesso.',
            usuario_id: usuarios[0].insertId
        });
      } catch (erro) {   
          console.error(erro);
          res.status(500).json({
              sucesso: false,
              mensagem: 'Erro ao buscar usuarios.',
              erro: erro.message
          });
      }
  })
      module.exports = router;