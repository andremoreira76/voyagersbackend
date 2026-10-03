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
        const [apoio] = await db.query('select * from apoio');
        res.status(200).json(apoio);
      } catch (erro) {
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar apoio.',
            erro: erro.message
        });
      }
      });
/**
 * @swagger
 * /apoio/cadastrarApoio:
 *   post:
 *     summary: Cadastra um ponto de apoio e suas fotos
 *     tags:
 *       - Pontos de Apoio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               apoio_nome:
 *                 type: string
 *                 example: Camping Recanto Verde
 *               apoio_descricao:
 *                 type: string
 *                 example: Área de camping próxima ao rio
 *               apoio_aceitarv:
 *                 type: integer
 *                 example: 1
 *               apoio_aceitapet:
 *                 type: integer
 *                 example: 1
 *               apoio_permitesom:
 *                 type: integer
 *                 example: 0
 *               apoio_voltagem:
 *                 type: string
 *                 example: "110/220V"
 *               apoio_luzeletrica:
 *                 type: integer
 *                 example: 1
 *               apoio_aguapotavel:
 *                 type: integer
 *                 example: 1
 *               apoio_chuveiroquente:
 *                 type: integer
 *                 example: 1
 *               apoio_cidade:
 *                 type: string
 *                 example: Curitiba
 *               apoio_uf:
 *                 type: string
 *                 example: PR
 *               apoio_wifi:
 *                 type: integer
 *                 example: 1
 *               apoio_endereco:
 *                 type: string
 *                 example: Estrada do Rio, 100
 *               apoio_latitude:
 *                 type: string
 *                 example: "-25.4284"
 *               apoio_longitude:
 *                 type: string
 *                 example: "-49.2733"
 *               apoio_telefone:
 *                 type: string
 *                 example: "41999999999"
 *               apoio_responsavel:
 *                 type: string
 *                 example: Maria da Silva
 *               apoio_energia:
 *                 type: integer
 *                 example: 1
 *               apoio_banheiro:
 *                 type: integer
 *                 example: 1
 *               apoio_chuveiro:
 *                 type: integer
 *                 example: 1
 *               fotos_x_apoio_fotomiatura:
 *                 type: array
 *                 description: Miniaturas correspondentes, na mesma ordem, a fotos_x_apoio_foto.
 *                 items:
 *                   type: string
 *                 example:
 *                   - miniatura1.jpg
 *                   - miniatura2.jpg
 *               fotos_x_apoio_foto:
 *                 type: array
 *                 description: Fotos associadas ao ponto de apoio. Deve ter a mesma quantidade de itens que fotos_x_apoio_fotomiatura.
 *                 items:
 *                   type: string
 *                 example:
 *                   - foto1.jpg
 *                   - foto2.jpg
 *     responses:
 *       200:
 *         description: Ponto de apoio cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ponto de apoio cadastrado com sucesso!
 *       400:
 *         description: Quantidade de miniaturas diferente da quantidade de fotos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Envie uma miniatura e uma foto para cada imagem.
 *       500:
 *         description: Erro ao cadastrar o ponto de apoio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao cadastrar ponto de apoio
 */
router.post('/cadastrarApoio', async (req, res) => {
  const {
    apoio_nome,
    apoio_descricao,
    apoio_aceitarv,
    apoio_aceitapet,
    apoio_permitesom,
    apoio_voltagem,
    apoio_luzeletrica,
    apoio_aguapotavel,
    apoio_chuveiroquente,
    apoio_cidade,
    apoio_uf,
    apoio_wifi,
    apoio_endereco,
    apoio_latitude,
    apoio_longitude,
    apoio_telefone,
    apoio_responsavel,
    apoio_energia,
    apoio_banheiro,
    apoio_chuveiro,
    fotos_x_apoio_fotomiatura,
    fotos_x_apoio_foto
  } = req.body;

  const miniaturas = fotos_x_apoio_fotomiatura === undefined
    ? []
    : Array.isArray(fotos_x_apoio_fotomiatura)
      ? fotos_x_apoio_fotomiatura
      : [fotos_x_apoio_fotomiatura];
  const fotos = fotos_x_apoio_foto === undefined
    ? []
    : Array.isArray(fotos_x_apoio_foto)
      ? fotos_x_apoio_foto
      : [fotos_x_apoio_foto];

  if (miniaturas.length !== fotos.length) {
    return res.status(400).json({
      message: 'Envie uma miniatura e uma foto para cada imagem.'
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [insertResult] = await connection.query(
      'INSERT INTO apoio (apoio_nome, apoio_descricao, apoio_aceitarv, apoio_aceitapet, apoio_permitesom, apoio_voltagem, apoio_luzeletrica, apoio_aguapotavel, apoio_chuveiroquente, apoio_cidade, apoio_uf, apoio_wifi, apoio_endereco, apoio_latitude, apoio_longitude, apoio_telefone, apoio_responsavel, apoio_energia, apoio_banheiro, apoio_chuveiro, apoio_status, apoio_atualizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        apoio_nome,
        apoio_descricao,
        apoio_aceitarv,
        apoio_aceitapet,
        apoio_permitesom,
        apoio_voltagem,
        apoio_luzeletrica,
        apoio_aguapotavel,
        apoio_chuveiroquente,
        apoio_cidade,
        apoio_uf,
        apoio_wifi,
        apoio_endereco,
        apoio_latitude,
        apoio_longitude,
        apoio_telefone,
        apoio_responsavel,
        apoio_energia,
        apoio_banheiro,
        apoio_chuveiro,
        'ATIVO',
        new Date()
      ]
    );

    if (fotos.length > 0) {
      const placeholders = fotos.map(() => '(?, ?, ?)').join(', ');
      const valoresFotos = fotos.flatMap((foto, indice) => [
        insertResult.insertId,
        miniaturas[indice],
        foto
      ]);

      await connection.query(
        `INSERT INTO fotos_x_apoio (fotos_x_apoio_apoioid, fotos_x_apoio_fotominiatura, fotos_x_apoio_foto) VALUES ${placeholders}`,
        valoresFotos
      );
    }

    await connection.commit();
    res.status(200).json({ message: 'Ponto de apoio cadastrado com sucesso!' });
  } catch (erro) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (erroRollback) {
        console.error('Erro ao desfazer cadastro do ponto de apoio:', erroRollback);
      }
    }
    console.error(erro);
    res.status(500).json({ message: 'Erro ao cadastrar ponto de apoio: ' + erro.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
router.get('/listaFotosApoio/:apoioId', async (req, res) => {
  const { apoioId } = req.params;
  try {
    const [fotos] = await db.query('SELECT * FROM fotos_x_apoio WHERE fotos_x_apoio_apoioid = ?', [apoioId]);
    if (fotos.length === 0) {
      return res.status(404).json({ message: 'Nenhuma foto encontrada para este ponto de apoio' });
    }
    return res.status(200).json(fotos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: 'Erro ao listar fotos do ponto de apoio: ' + erro.message });
  }
});
module.exports = router;