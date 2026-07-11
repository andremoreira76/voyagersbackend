const cron = require('node-cron');
const db = require('../database');

module.exports = function iniciarEventos() {
  cron.schedule('0 6 * * *', async () => {
    try {
      const [eventos] = await db.query('SELECT evento_id, evento_cidade, evento_uf FROM eventos');

      for (const evento of eventos) {
        const response = await fetch(
          `http://localhost:3000/eventos/${encodeURIComponent(evento.evento_cidade)}/${evento.evento_uf}/${evento.evento_id}/previsao`,
          {
            method: 'PUT'
          }
        );

        if (response.status === 400) {
          console.log(`Previsão já atualizada hoje para o evento ${evento.evento_id}`);
        } else if (response.ok) {
          console.log(`Previsão do tempo atualizada para o evento ${evento.evento_id}`);
        } else {
          console.error(`Erro ao atualizar previsão do tempo para o evento ${evento.evento_id}: ${response.status}`);
        }
      }

      console.log('Atualizando Previsão do Tempo - Tarefa executada:', new Date());
    } catch (erro) {
      console.error('Erro na tarefa de previsão do tempo:', erro);
    }
  });
};