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
            mensagem: "Nome, usuário e email devem ser únicos. Já existe um usuário com esses dados."
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
 *               usuario_nova_senha:
 *                 type: string
 *                 format: password
 *                 example: novaSenha123
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

  router.post('/reset-password', async (req,res) => {
    try {
      const { usuario_email, usuario_nova_senha  } = req.body;      

      if (!usuario_email) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Email do usuário é obrigatório.'
        });
      }

      const bcrypt = require("bcrypt");
      const novaSenha = usuario_nova_senha;
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
/**
 * @swagger
 * /usuarios/update-location:
 *   post:
 *     summary: Atualiza a localização do usuário
 *     description: Atualiza as coordenadas geográficas de um usuário existente.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - latitude
 *               - longitude
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: -23.550520
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: -46.633303
 *     responses:
 *       200:
 *         description: Localização atualizada com sucesso.
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
 *                   example: Localização atualizada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */

  // atualiza coordenadas do usuário
  router.post('/update-location', async (req, res) => {
    try {
      const { usuario_id, latitude, longitude } = req.body;

      if (!usuario_id || !latitude || !longitude) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Dados inválidos.'
        });
      }

      const [result] = await db.query('UPDATE usuarios SET usuario_latitude = ?, usuario_longitude = ? WHERE usuario_id = ?', [latitude, longitude, usuario_id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Usuário não encontrado.'
        });
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Localização atualizada com sucesso.'
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao atualizar localização.',
        erro: erro.message
      });
    }
  });

  /**
   * @swagger
   * /usuarios/user/{username}:
   *   get:
   *     summary: Buscar usuário por nome de usuário
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - name: username
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   */
  router.get('/user/:username', async (req, res) => {
    try {
      const { username } = req.params;

      const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario_usuario = ?', [username]);

      if (rows.length === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Usuário não encontrado.'
        });
      }

      res.status(200).json({
        sucesso: true,
        mensagem: 'Usuário encontrado.',
        dados: rows[0]
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar usuário.',
        erro: erro.message
      });
    }
  });
  /**
   * @swagger
   * /usuarios/eventos/{usuario_id}/{evento_id}:
   *   get:
   *     summary: Buscar dados da participação do usuário no evento 
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - name: usuario_id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: evento_id
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   */
  router.get('/eventos/:usuario_id/:evento_id', async (req, res) => {
    try {
      const { usuario_id, evento_id } = req.params;
      const [meusEventos] = await db.query('select * from evento_x_usuario where evento_x_usuario_usuario_id = ? and evento_x_usuario_eventoid = ?' , [usuario_id, evento_id]);
      res.status(200).json({meusEventos});
    } catch (erro) {
      console.error(erro);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar eventos.',
        erro: erro.message
      });
    }
  });

  module.exports = router;