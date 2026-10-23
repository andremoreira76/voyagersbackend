const express = require('express');
const router = express.Router();
// get usuarios
/**
 * @swagger
 * /uteis/distancia/{lat1}/{lon1}/{lat2}/{lon2}:
 *   get:
 *     summary: Calcula a distância entre duas coordenadas
 *     tags:
 *       - Uteis
 *     parameters:
 *       - name: lat1
 *         in: path
 *         description: Latitude do primeiro ponto
 *         required: true
 *         type: number
 *       - name: lon1
 *         in: path
 *         description: Longitude do primeiro ponto
 *         required: true
 *         type: number
 *       - name: lat2
 *         in: path
 *         description: Latitude do segundo ponto
 *         required: true
 *         type: number
 *       - name: lon2
 *         in: path
 *         description: Longitude do segundo ponto
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Distância entre as coordenadas
 */
router.get('/distancia/:lat1/:lon1/:lat2/:lon2/', async (req, res) => {
      try {

        const lat1 = parseFloat(req.params.lat1);
        const lon1 = parseFloat(req.params.lon1);
        const lat2 = parseFloat(req.params.lat2);
        const lon2 = parseFloat(req.params.lon2);

        // Validação
        if (
            isNaN(lat1) || isNaN(lon1) ||
            isNaN(lat2) || isNaN(lon2)
        ) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Latitude e longitude inválidas."
            });
        }

        // Fórmula de Haversine
        const R = 6371; // km

        const toRad = (value) => value * Math.PI / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distancia = Number((R * c).toFixed(2));

        return res.json({
            sucesso: true,
            distancia,
            unidade: "km"
        });

    } catch (erro) {

        return res.status(500).json({
            sucesso: false,
            mensagem: erro.message
        });

    }
      });
/**
 * @swagger
 * /uteis/dateBr/{sigla}:
 *   get:
 *     summary: Converte a sigla do mês para a abreviação em português
 *     tags:
 *       - Uteis
 *     parameters:
 *       - name: sigla
 *         in: path
 *         description: Sigla do mês em inglês, em letras maiúsculas
 *         required: true
 *         schema:
 *           type: string
 *           enum: [JAN, FEV, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC]
 *         example: APR
 *     responses:
 *       200:
 *         description: Sigla do mês convertida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   example: ABR
 */
router.get('/dateBr/:sigla', async (req, res) => {
    switch (req.params.sigla) {
        case 'JAN':
            return res.json({ sucesso: true, data: 'JAN' });
        case 'FEV':
            return res.json({ sucesso: true, data: 'FEV' });
        case 'MAR':
            return res.json({ sucesso: true, data: 'MAR' });
        case 'APR':
            return res.json({ sucesso: true, data: 'ABR' });                            
        // Adicione mais casos conforme necessário
        case 'MAY':
            return res.json({ sucesso: true, data: 'MAI' });
        case 'JUN':
            return res.json({ sucesso: true, data: 'JUN' });    
        case 'JUL':
            return res.json({ sucesso: true, data: 'JUL' });
        case 'AUG':
            return res.json({ sucesso: true, data: 'AGO' });
        case 'SEP':
            return res.json({ sucesso: true, data: 'SET' });
        case 'OCT':
            return res.json({ sucesso: true, data: 'OUT' });
        case 'NOV':
            return res.json({ sucesso: true, data: 'NOV' });
        case 'DEC':
            return res.json({ sucesso: true, data: 'DEZ' });                            
    }

});
module.exports = router;