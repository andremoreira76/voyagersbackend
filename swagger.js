const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Traveling Around API",
            version: "1.0.0",
            description: "API do sistema Traveling Around"
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ],

        components: {
            schemas: {
                Evento: {
                    type: "object",
                    properties: {
                        evento_id: { type: "integer", example: 1 },
                        evento_nome: { type: "string", example: "Festival de Verão" },
                        evento_descricao: { type: "string", nullable: true, example: "Evento comunitário com atrações e alimentação." },
                        evento_empresaid: { type: "integer", example: 1 },
                        evento_filialid: { type: "integer", example: 1 },
                        evento_datainicio: { type: "string", format: "date", example: "2026-12-10" },
                        evento_datafim: { type: "string", format: "date", example: "2026-12-12" },
                        evento_datalimiteinscricao: { type: "string", format: "date", nullable: true, example: "2026-12-01" },
                        evento_horainicialacesso: { type: "string", format: "time", nullable: true, example: "08:00:00" },
                        evento_horafinalacesso: { type: "string", format: "time", nullable: true, example: "22:00:00" },
                        evento_horainicialsaida: { type: "string", format: "time", nullable: true, example: "07:00:00" },
                        evento_horafinalsaida: { type: "string", format: "time", nullable: true, example: "23:00:00" },
                        evento_tipoevento: { type: "string", nullable: true, example: "SHOW" },
                        evento_valor: { type: "number", nullable: true, example: 120.5 },
                        evento_valorcrianca: { type: "number", nullable: true, example: 60.0 },
                        evento_vagas: { type: "integer", nullable: true, example: 300 },
                        evento_podebarraca: { type: "integer", nullable: true, example: 1 },
                        evento_podepet: { type: "integer", nullable: true, example: 0 },
                        evento_podesomalto: { type: "integer", nullable: true, example: 1 },
                        evento_horasilencioinicial: { type: "string", format: "time", nullable: true, example: "23:00:00" },
                        evento_horasilenciofinal: { type: "string", format: "time", nullable: true, example: "06:00:00" },
                        evento_tipopagamento: { type: "string", nullable: true, example: "PIX" },
                        evento_tipocobranca: { type: "string", nullable: true, example: "ONLINE" },
                        evento_idadecrianca: { type: "integer", nullable: true, example: 12 },
                        evento_logotipo: { type: "string", nullable: true, example: "logo.png" },
                        evento_local: { type: "string", nullable: true, example: "Parque Central" },
                        evento_endereco: { type: "string", nullable: true, example: "Rua das Flores, 100" },
                        evento_cidade: { type: "string", nullable: true, example: "São Paulo" },
                        evento_uf: { type: "string", nullable: true, example: "SP" },
                        evento_latitude: { type: "string", nullable: true, example: "-23.5505" },
                        evento_longitude: { type: "string", nullable: true, example: "-46.6333" },
                        evento_status: { type: "string", nullable: true, example: "ATIVO" },
                        evento_responsavel: { type: "string", nullable: true, example: "João da Silva" },
                        evento_foneresponsavel: { type: "string", nullable: true, example: "11999999999" },
                        evento_responsavelid: { type: "integer", nullable: true, example: 5 }
                    }
                },
                EventoInput: {
                    type: "object",
                    required: ["evento_nome", "evento_datainicio", "evento_datafim"],
                    properties: {
                        evento_nome: { type: "string", example: "Festival de Verão" },
                        evento_descricao: { type: "string", nullable: true, example: "Evento comunitário com atrações e alimentação." },
                        evento_empresaid: { type: "integer", example: 1 },
                        evento_filialid: { type: "integer", example: 1 },
                        evento_datainicio: { type: "string", format: "date", example: "2026-12-10" },
                        evento_datafim: { type: "string", format: "date", example: "2026-12-12" },
                        evento_datalimiteinscricao: { type: "string", format: "date", nullable: true, example: "2026-12-01" },
                        evento_horainicialacesso: { type: "string", format: "time", nullable: true, example: "08:00:00" },
                        evento_horafinalacesso: { type: "string", format: "time", nullable: true, example: "22:00:00" },
                        evento_horainicialsaida: { type: "string", format: "time", nullable: true, example: "07:00:00" },
                        evento_horafinalsaida: { type: "string", format: "time", nullable: true, example: "23:00:00" },
                        evento_tipoevento: { type: "string", nullable: true, example: "SHOW" },
                        evento_valor: { type: "number", nullable: true, example: 120.5 },
                        evento_valorcrianca: { type: "number", nullable: true, example: 60.0 },
                        evento_vagas: { type: "integer", nullable: true, example: 300 },
                        evento_podebarraca: { type: "integer", nullable: true, example: 1 },
                        evento_podepet: { type: "integer", nullable: true, example: 0 },
                        evento_podesomalto: { type: "integer", nullable: true, example: 1 },
                        evento_horasilencioinicial: { type: "string", format: "time", nullable: true, example: "23:00:00" },
                        evento_horasilenciofinal: { type: "string", format: "time", nullable: true, example: "06:00:00" },
                        evento_tipopagamento: { type: "string", nullable: true, example: "PIX" },
                        evento_tipocobranca: { type: "string", nullable: true, example: "ONLINE" },
                        evento_idadecrianca: { type: "integer", nullable: true, example: 12 },
                        evento_logotipo: { type: "string", nullable: true, example: "logo.png" },
                        evento_local: { type: "string", nullable: true, example: "Parque Central" },
                        evento_endereco: { type: "string", nullable: true, example: "Rua das Flores, 100" },
                        evento_cidade: { type: "string", nullable: true, example: "São Paulo" },
                        evento_uf: { type: "string", nullable: true, example: "SP" },
                        evento_latitude: { type: "string", nullable: true, example: "-23.5505" },
                        evento_longitude: { type: "string", nullable: true, example: "-46.6333" },
                        evento_status: { type: "string", nullable: true, example: "ATIVO" },
                        evento_responsavel: { type: "string", nullable: true, example: "João da Silva" },
                        evento_foneresponsavel: { type: "string", nullable: true, example: "11999999999" },
                        evento_responsavelid: { type: "integer", nullable: true, example: 5 }
                    }
                }
            }
        }
    },

    apis: [
        "./routes/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};