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
    try {
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

      // Validar campos obrigatórios
      if (!usuario_nome || !usuario_usuario || !usuario_senha || !usuario_email) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Nome, usuário, senha e email são obrigatórios.'
        });
      }

      // Verificar se usuário já existe
      const [existe] = await db.query(`
            SELECT usuario_id
            FROM usuarios
            WHERE UPPER(usuario_nome)=UPPER(?)
               OR UPPER(usuario_email)=UPPER(?)
               OR UPPER(usuario_usuario)=UPPER(?)
        `,
        [
            usuario_nome,
            usuario_email,
            usuario_usuario
        ]);

      if (existe.length > 0) {
        return res.status(409).json({
            sucesso: false,
            mensagem: "Usuário já cadastrado"
        });
      }    
      
      const bcrypt = require("bcrypt");
      const senhaHash = await bcrypt.hash(usuario_senha, 10);
      const [result] = await db.query('INSERT INTO usuarios (usuario_nome, usuario_usuario, usuario_senha, usuario_email, usuario_nascimento, usuario_cidade, usuario_uf, usuario_status, usuario_empresaid, usuario_filialid, usuario_cep, usuario_lat, usuario_long) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [usuario_nome, usuario_usuario, senhaHash, usuario_email, usuario_nascimento, usuario_cidade, usuario_uf, usuario_status, usuario_empresaid, usuario_filialid, usuario_cep, usuario_lat, usuario_long]);  
      
      // Vincula perfil padrão (3)
      await db.query(`
          INSERT INTO perfil_x_usuario(
              perfil_x_usuario_usuarioid,
              perfil_x_usuario_perfilid
          )
          VALUES (?,3)
      `,
      [
          result.insertId
      ]);
      
      res.status(201).json({
          sucesso: true,
          mensagem: 'Usuário cadastrado com sucesso.',
          usuario_id: result.insertId
      });
    } catch (erro) {   
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar usuário.',
            erro: erro.message
        });
    }
  })
   // Reset password
   /**
 * @swagger
 * /usuarios/reset-password:
 *   post:
 *     summary: Reseta a senha do usuário
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_email
 *             properties:
 *               usuario_email:
 *                 type: string
 *                 format: email
 *                 example: andre@email.com
 *     responses:
 *       200:
 *         description: Senha resetada com sucesso.
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
 *                   example: Senha resetada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

  router.post('/reset-password', async (req, res) => {
    try {
      const { usuario_email } = req.body;

      if (!usuario_email) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email do usuário é obrigatório.'
        });
      }

      const bcrypt = require("bcrypt");
      const novaSenha = Math.random().toString(36).slice(-8);
      const senhaHash = await bcrypt.hash(novaSenha, 10);
      const [result] = await db.query('UPDATE usuarios SET usuario_senha = ? WHERE usuario_email = ?', [senhaHash, usuario_email]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Usuário não encontrado.'
        });
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Senha resetada com sucesso.'
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao resetar senha.',
        erro: erro.message
      });
    }
  });
  module.exports = router;