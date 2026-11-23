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
 *               apoio_barraca:
 *                 type: integer
 *                 example: 1
 *               apoio_certificado:
 *                 type: string
 *                 maxLength: 4
 *                 nullable: true
 *                 example: "2022"
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
 *               fotos_x_apoio_datafoto:
 *                 type: array
 *                 description: Data de cada foto, na mesma ordem dos arrays de miniaturas e fotos. Se omitido, será usada a data do cadastro.
 *                 items:
 *                   type: string
 *                   format: date
 *                 example:
 *                   - "2026-10-03"
 *                   - "2026-10-04"
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
 *         description: Quantidade de miniaturas diferente da quantidade de fotos ou de datas informadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Envie uma miniatura e uma foto para cada imagem; se informar as datas, envie uma para cada foto.
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
    apoio_barraca,
    apoio_certificado,
    fotos_x_apoio_fotomiatura,
    fotos_x_apoio_foto,
    fotos_x_apoio_datafoto
  } = req.body;

  if (apoio_certificado != null && (typeof apoio_certificado !== 'string' || apoio_certificado.length > 4)) {
    return res.status(400).json({
      message: 'apoio_certificado deve ser uma string com no máximo 4 caracteres.'
    });
  }

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
  const datasFotos = fotos_x_apoio_datafoto === undefined
    ? fotos.map(() => new Date().toISOString().slice(0, 10))
    : Array.isArray(fotos_x_apoio_datafoto)
      ? fotos_x_apoio_datafoto
      : [fotos_x_apoio_datafoto];

  if (miniaturas.length !== fotos.length || datasFotos.length !== fotos.length) {
    return res.status(400).json({
      message: 'Envie uma miniatura e uma foto para cada imagem; se informar as datas, envie uma para cada foto.'
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [insertResult] = await connection.query(
      'INSERT INTO apoio (apoio_nome, apoio_descricao, apoio_aceitarv, apoio_aceitapet, apoio_permitesom, apoio_voltagem, apoio_luzeletrica, apoio_aguapotavel, apoio_chuveiroquente, apoio_cidade, apoio_uf, apoio_wifi, apoio_endereco, apoio_latitude, apoio_longitude, apoio_telefone, apoio_responsavel, apoio_energia, apoio_banheiro, apoio_chuveiro, apoio_barraca, apoio_certificado, apoio_status, apoio_atualizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
        apoio_barraca,
        apoio_certificado ?? null,
        'ATIVO',
        new Date()
      ]
    );

    if (fotos.length > 0) {
      const placeholders = fotos.map(() => '(?, ?, ?, ?)').join(', ');
      const valoresFotos = fotos.flatMap((foto, indice) => [
        insertResult.insertId,
        miniaturas[indice],
        foto,
        datasFotos[indice]
      ]);

      await connection.query(
        `INSERT INTO fotos_x_apoio (fotos_x_apoio_apoioid, fotos_x_apoio_fotominiatura, fotos_x_apoio_foto, fotos_x_apoio_datafoto) VALUES ${placeholders}`,
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
/**
 * @swagger
 * /apoio/listaFotosApoio/{apoioId}:
 *   get:
 *     summary: Lista as fotos de um ponto de apoio
 *     tags:
 *       - Pontos de Apoio
 *     parameters:
 *       - name: apoioId
 *         in: path
 *         required: true
 *         description: Identificador do ponto de apoio
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Fotos encontradas para o ponto de apoio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fotos_x_apoio_id:
 *                     type: integer
 *                     example: 10
 *                   fotos_x_apoio_apoioid:
 *                     type: integer
 *                     example: 1
 *                   fotos_x_apoio_fotominiatura:
 *                     type: string
 *                     example: miniatura.jpg
 *                   fotos_x_apoio_foto:
 *                     type: string
 *                     example: foto.jpg
 *                   fotos_x_apoio_datafoto:
 *                     type: string
 *                     format: date
 *                     example: "2026-10-03"
 *       404:
 *         description: Nenhuma foto encontrada para este ponto de apoio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nenhuma foto encontrada para este ponto de apoio
 *       500:
 *         description: Erro ao listar as fotos do ponto de apoio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao listar fotos do ponto de apoio
 */
router.get('/listaFotosApoio/:apoioId', async (req, res) => {
  const { apoioId } = req.params;
  try {
    const [fotos] = await db.query(
      'SELECT fotos_x_apoio_id, fotos_x_apoio_apoioid, fotos_x_apoio_fotominiatura, fotos_x_apoio_foto, fotos_x_apoio_datafoto FROM fotos_x_apoio WHERE fotos_x_apoio_apoioid = ?',
      [apoioId]
    );
    if (fotos.length === 0) {
      return res.status(404).json({ message: 'Nenhuma foto encontrada para este ponto de apoio' });
    }
    return res.status(200).json(fotos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ message: 'Erro ao listar fotos do ponto de apoio: ' + erro.message });
  }
});
/**
 * @swagger
 * /apoio/atualizarApoio/{apoioId}:
 *   put:
 *     summary: Atualiza um ponto de apoio e, opcionalmente, suas fotos
 *     description: Os dados do ponto de apoio devem ser enviados no corpo. As fotos só são substituídas quando pelo menos um dos campos de foto é informado; envie miniaturas e fotos na mesma quantidade. Se as datas forem omitidas, será usada a data atual para cada foto.
 *     tags:
 *       - Pontos de Apoio
 *     parameters:
 *       - name: apoioId
 *         in: path
 *         required: true
 *         description: Identificador do ponto de apoio
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
 *               - apoio_nome
 *               - apoio_descricao
 *               - apoio_aceitarv
 *               - apoio_aceitapet
 *               - apoio_permitesom
 *               - apoio_voltagem
 *               - apoio_luzeletrica
 *               - apoio_aguapotavel
 *               - apoio_chuveiroquente
 *               - apoio_cidade
 *               - apoio_uf
 *               - apoio_wifi
 *               - apoio_endereco
 *               - apoio_latitude
 *               - apoio_longitude
 *               - apoio_telefone
 *               - apoio_responsavel
 *               - apoio_energia
 *               - apoio_banheiro
 *               - apoio_chuveiro
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
 *               apoio_certificado:
 *                 type: string
 *                 maxLength: 4
 *                 nullable: true
 *                 example: "2022"
 *               apoio_status:
 *                 type: string
 *                 description: Se omitido, o status será definido como ATIVO.
 *                 example: ATIVO
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
 *                 description: Envie a mesma quantidade de fotos e miniaturas. Uma lista vazia remove todas as fotos atuais.
 *                 items:
 *                   type: string
 *                 example:
 *                   - foto1.jpg
 *                   - foto2.jpg
 *               fotos_x_apoio_datafoto:
 *                 type: array
 *                 description: Data de cada foto, na mesma ordem dos arrays de miniaturas e fotos. Se omitido, será usada a data atual.
 *                 items:
 *                   type: string
 *                   format: date
 *                 example:
 *                   - "2026-10-03"
 *                   - "2026-10-04"
 *     responses:
 *       200:
 *         description: Ponto de apoio atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ponto de apoio atualizado com sucesso!
 *                 apoioId:
 *                   type: integer
 *                   example: 1
 *                 fotosAtualizadas:
 *                   type: boolean
 *                   description: Indica se as fotos foram substituídas nesta requisição.
 *                   example: true
 *       400:
 *         description: Quantidade de miniaturas diferente da quantidade de fotos ou de datas informadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     miniaturas:
 *                       value: Envie uma miniatura para cada foto.
 *                     datas:
 *                       value: Envie uma data para cada foto.
 *       404:
 *         description: Ponto de apoio não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ponto de apoio não encontrado.
 *       500:
 *         description: Erro ao atualizar o ponto de apoio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao atualizar ponto de apoio
 */
router.put('/atualizarApoio/:apoioId', async (req, res) => {
  const { apoioId } = req.params;

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
    apoio_barraca,
    apoio_certificado,
    apoio_status,
    fotos_x_apoio_fotomiatura,
    fotos_x_apoio_foto,
    fotos_x_apoio_datafoto
  } = req.body;

  if (apoio_certificado != null && (typeof apoio_certificado !== 'string' || apoio_certificado.length > 4)) {
    return res.status(400).json({
      message: 'apoio_certificado deve ser uma string com no máximo 4 caracteres.'
    });
  }

  // Normaliza os arrays de fotos.
  const normalizarArray = (valor) => {
    if (valor === undefined) return undefined;
    return Array.isArray(valor) ? valor : [valor];
  };

  const miniaturas = normalizarArray(fotos_x_apoio_fotomiatura);
  const fotos = normalizarArray(fotos_x_apoio_foto);
  let datasFotos = normalizarArray(fotos_x_apoio_datafoto);

  // Se qualquer campo de fotos for enviado, considera uma atualização das fotos.
  const atualizarFotos =
    miniaturas !== undefined ||
    fotos !== undefined ||
    datasFotos !== undefined;

  // Se fotos forem atualizadas, os três campos devem ser coerentes.
  if (atualizarFotos) {
    const listaMiniaturas = miniaturas ?? [];
    const listaFotos = fotos ?? [];

    if (listaMiniaturas.length !== listaFotos.length) {
      return res.status(400).json({
        message: 'Envie uma miniatura para cada foto.'
      });
    }

    if (datasFotos === undefined) {
      datasFotos = listaFotos.map(() =>
        new Date().toISOString().slice(0, 10)
      );
    }

    if (datasFotos.length !== listaFotos.length) {
      return res.status(400).json({
        message: 'Envie uma data para cada foto.'
      });
    }
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Verifica se o ponto de apoio existe.
    const [apoios] = await connection.query(
      'SELECT apoio_id FROM apoio WHERE apoio_id = ? FOR UPDATE',
      [apoioId]
    );

    if (apoios.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: 'Ponto de apoio não encontrado.'
      });
    }

    // Atualiza os dados do ponto de apoio.
    const [resultado] = await connection.query(
      `UPDATE apoio SET
        apoio_nome = ?,
        apoio_descricao = ?,
        apoio_aceitarv = ?,
        apoio_aceitapet = ?,
        apoio_permitesom = ?,
        apoio_voltagem = ?,
        apoio_luzeletrica = ?,
        apoio_aguapotavel = ?,
        apoio_chuveiroquente = ?,
        apoio_cidade = ?,
        apoio_uf = ?,
        apoio_wifi = ?,
        apoio_endereco = ?,
        apoio_latitude = ?,
        apoio_longitude = ?,
        apoio_telefone = ?,
        apoio_responsavel = ?,
        apoio_energia = ?,
        apoio_banheiro = ?,
        apoio_chuveiro = ?,
        apoio_barraca = ?,
        apoio_certificado = ?,
        apoio_status = ?,
        apoio_atualizacao = ?
      WHERE apoio_id = ?`,
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
        apoio_barraca,
        apoio_certificado ?? null,
        apoio_status ?? 'ATIVO',
        new Date(),
        apoioId
      ]
    );

    // Atualiza as fotos somente se algum campo de fotos foi enviado.
    if (atualizarFotos) {
      await connection.query(
        'DELETE FROM fotos_x_apoio WHERE fotos_x_apoio_apoioid = ?',
        [apoioId]
      );

      const listaMiniaturas = miniaturas ?? [];
      const listaFotos = fotos ?? [];

      if (listaFotos.length > 0) {
        const placeholders = listaFotos
          .map(() => '(?, ?, ?, ?)')
          .join(', ');

        const valoresFotos = listaFotos.flatMap((foto, indice) => [
          apoioId,
          listaMiniaturas[indice],
          foto,
          datasFotos[indice]
        ]);

        await connection.query(
          `INSERT INTO fotos_x_apoio
            (fotos_x_apoio_apoioid,
             fotos_x_apoio_fotominiatura,
             fotos_x_apoio_foto,
             fotos_x_apoio_datafoto)
           VALUES ${placeholders}`,
          valoresFotos
        );
      }
    }

    await connection.commit();

    return res.status(200).json({
      message: 'Ponto de apoio atualizado com sucesso!',
      apoioId: Number(apoioId),
      fotosAtualizadas: atualizarFotos
    });

  } catch (erro) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (erroRollback) {
        console.error(
          'Erro ao desfazer atualização do ponto de apoio:',
          erroRollback
        );
      }
    }

    console.error(erro);

    return res.status(500).json({
      message: 'Erro ao atualizar ponto de apoio: ' + erro.message
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
});
/**
 * @swagger
 * /apoio/criaCertificado:
 *   post:
 *     summary: Cria um certificado para um ponto de apoio
 *     tags:
 *       - Pontos de Apoio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - certificado_pontoid
 *               - certificado_usuarioid
 *             properties:
 *               certificado_pontoid:
 *                 type: integer
 *                 example: 10
 *               certificado_usuarioid:
 *                 type: integer
 *                 example: 123
 *               certificado_existe:
 *                 type: integer
 *                 default: 0
 *                 example: 1
 *               certificado_gratuito:
 *                 type: string
 *                 maxLength: 100
 *                 nullable: true
 *                 example: "sim"
 *               certificado_estrutura:
 *                 type: string
 *                 maxLength: 300
 *                 nullable: true
 *                 example: "Estrutura cadastrada"
 *               certificado_ano:
 *                 type: string
 *                 maxLength: 4
 *                 nullable: true
 *                 example: "2026"
 *               certificado_createat:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: "2026-11-23T12:00:00.000Z"
 *     responses:
 *       201:
 *         description: Certificado criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao criar certificado
 */
router.post('/criaCertificado', async (req, res) => {
  const {
    certificado_pontoid,
    certificado_usuarioid,
    certificado_existe = 0,
    certificado_gratuito = null,
    certificado_estrutura = null,
    certificado_ano = null,
    certificado_createat = new Date()
  } = req.body;

  const pontoId = Number(certificado_pontoid);

  if (
    certificado_pontoid === undefined ||
    certificado_pontoid === null ||
    certificado_pontoid === '' ||
    !Number.isInteger(pontoId)
  ) {
    return res.status(400).json({
      message: 'certificado_pontoid deve ser um número inteiro.'
    });
  }

  const usuarioId = Number(certificado_usuarioid);
  if (
    certificado_usuarioid === undefined ||
    certificado_usuarioid === null ||
    certificado_usuarioid === '' ||
    !Number.isInteger(usuarioId)
  ) {
    return res.status(400).json({
      message: 'certificado_usuarioid é obrigatório e deve ser um número inteiro.'
    });
  }

  if (!Number.isInteger(Number(certificado_existe))) {
    return res.status(400).json({
      message: 'certificado_existe deve ser um número inteiro.'
    });
  }

  const camposTexto = [
    ['certificado_gratuito', certificado_gratuito, 100],
    ['certificado_estrutura', certificado_estrutura, 300],
    ['certificado_ano', certificado_ano, 4]
  ];

  for (const [campo, valor, limite] of camposTexto) {
    if (valor !== null && (typeof valor !== 'string' || valor.length > limite)) {
      return res.status(400).json({
        message: `${campo} deve ser um texto com no máximo ${limite} caracteres.`
      });
    }
  }

  try {
    await db.query(
      `INSERT INTO certificado (
        certificado_pontoid,
        certificado_usuarioid,
        certificado_existe,
        certificado_gratuito,
        certificado_estrutura,
        certificado_ano,
        certificado_createat
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        pontoId,
        usuarioId,
        Number(certificado_existe),
        certificado_gratuito,
        certificado_estrutura,
        certificado_ano,
        certificado_createat
      ]
    );

    return res.status(201).json({
      message: 'Certificado criado com sucesso.',
      certificado_pontoid: pontoId
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      message: 'Erro ao criar certificado.',
      erro: erro.message
    });
  }
});
module.exports = router;