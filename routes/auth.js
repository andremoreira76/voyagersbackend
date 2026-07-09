const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../database");

router.post("/login", async (req, res) => {

    try {

        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Usuário e senha são obrigatórios."
            });
        }

        const [rows] = await db.query(
            `SELECT *
             FROM usuarios
             WHERE usuario_usuario = ?
             LIMIT 1`,
            [usuario]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário ou senha inválidos."
            });
        }

        const user = rows[0];

        const senhaValida = await bcrypt.compare(
            senha,
            user.usuario_senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Usuário ou senha inválidos."
            });
        }

        const token = jwt.sign(
            {
                usuario_id: user.usuario_id,
                nome: user.usuario_nome
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES
            }
        );

        res.json({
            sucesso: true,
            token,
            usuario: {
                id: user.usuario_id,
                nome: user.usuario_nome,
                email: user.usuario_email
            }
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno."
        });

    }

});

module.exports = router;