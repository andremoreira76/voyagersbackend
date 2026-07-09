
require('dotenv').config( {quiet: true} );

const express = require('express');
const app = express();
const port = 3000;
const db = require('./database.js');


app.get('/', (req, res) => {
  res.send('Olá Mundo!');
});


// rotas
app.use(express.json());
const auth = require("./routes/auth");
app.use("/api", auth);
const eventosRouter = require('./routes/eventos.js');
const apoioRouter = require('./routes/apoio.js');
const { swaggerUi, swaggerSpec } = require('./swagger');

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


app.use('/eventos', eventosRouter);
app.use('/apoio', apoioRouter);
app.use('/usuarios', require('./routes/usuarios.js'));

// teste de conexão com o banco de dados
app.get('/teste-banco', async (req, res) => {

    try {

        const [rows] = await db.query('SELECT NOW() AS dataHora');

        res.status(200).json({
            sucesso: true,
            mensagem: 'Conexão com o banco realizada com sucesso!',
            servidor: rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao conectar ao banco.',
            erro: erro.message
        });

    }
  })
  
// get estados/ufs
app.get('/estados/',(req,res)=>{

    const estados = [
        {uf:'AC', nome:'Acre'},
        {uf:'AL', nome:'Alagoas'},
        {uf:'AP', nome:'Amapá'},
        {uf:'AM', nome:'Amazonas'},
        {uf:'BA', nome:'Bahia'},
        {uf:'CE', nome:'Ceará'},
        {uf:'DF', nome:'Distrito Federal'},
        {uf:'ES', nome:'Espírito Santo'},
        {uf:'GO', nome:'Goiás'},
        {uf:'MA', nome:'Maranhão'},
        {uf:'MT', nome:'Mato Grosso'},
        {uf:'MS', nome:'Mato Grosso do Sul'},
        {uf:'MG', nome:'Minas Gerais'},
        {uf:'PA', nome:'Pará'},
        {uf:'PB', nome:'Paraíba'},
        {uf:'PR', nome:'Paraná'},
        {uf:'PE', nome:'Pernambuco'},
        {uf:'PI', nome:'Piauí'},
        {uf:'RJ', nome:'Rio de Janeiro'},
        {uf:'RN', nome:'Rio Grande do Norte'},
        {uf:'RS', nome:'Rio Grande do Sul'},
        {uf:'RO', nome:'Rondônia'},
        {uf:'RR', nome:'Roraima'},
        {uf:'SC', nome:'Santa Catarina'},
        {uf:'SP', nome:'São Paulo'},
        {uf:'SE', nome:'Sergipe'},
        {uf:'TO', nome:'Tocantins'}
    ]
    res.json(estados);
}); 



app.get('/frasesfilhos/:filho',(req,res)=>{
  const filho = req.params.filho;
  const frases = [
    {filho:'Vinicius',frase:'Ninguem te ama cara!!! ninguém te ama!!!'},
    {filho:'Vinicius',frase:'Mil dils cara!!'},
    {filho:'Vinicius',frase:'Olha issooo!!!!'},
    {filho:'Sofia',frase:'Eu vi um movimento na água!!!'},
    {filho:'Sofia',frase:'Que deselegância!!!'},
    
  ]
   const frasesFilho = frases.filter(f => f.filho.toLowerCase() === filho.toLocaleLowerCase());            
   if(frasesFilho.length === 0 ){
      res.json({error:'Filho não encontrado'});
   }else{
      res.json(frasesFilho);
   }
   
})
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});