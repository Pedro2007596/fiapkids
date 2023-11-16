const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/Fiapkids',
{   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});

const usuarioSchema = new mongoose.Schema({
    nome : {type: String},
    email: {type: String, required: true,},
    senha: {type : String}
  });
  
const Usuario = mongoose.model('Usuario', usuarioSchema);

app.post("/cadastrarUsuario", async (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    if (nome == null ||email == null || senha == null) {
        return res.status(400).json({ error: "Preencher todos os campos" });
    }

    const emailExiste = await Usuario.findOne({ email: email });
    if (emailExiste) {
        return res.status(400).json({ error: "O e-mail cadastrado já existe!!!" });
    }

    const usuario = new Usuario({
        nome : nome,
        email: email,
        senha: senha
    });

    try {
        const newUsuario = await usuario.save();
        res.json({ error: null, msg: "Cadastro ok", usuarioId: newUsuario._id });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.get("/cadastrarUsuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrarUsu.html");
});

const BrinquedoSchema = new mongoose.Schema({
    codigo: {type: String, required: true,},
    descricao: {type : String},
    marca: {type : String},
    data_fabricacao: {type : Date},
    quantidade_estoque: {type : Number},
  });

  const Brinquedo = mongoose.model('Brinquedo', BrinquedoSchema);
  
app.post("/cadastrarBrinquedo", async (req, res) => {
    const codigo = req.body.codigo;
    const descricao = req.body.descricao;
    const marca = req.body.marca;
    const data_fabricacao = req.body.data_fabricacao;
    const quantidade_estoque = req.body.quantidade_estoque;

    if (codigo == null || descricao == null || marca == null || data_fabricacao == null || quantidade_estoque == null) {
        return res.status(400).json({ error: "Preencher todos os campos" });
    }

    const BrinquedoExiste = await Brinquedo.findOne({ codigo: codigo });
    if (BrinquedoExiste) {
        return res.status(400).json({ error: "O produto já existe!!!" });
    }

    const brinquedo = new Brinquedo({
        codigo: codigo,
        descricao: descricao,
        marca: marca,
        data_fabricacao: data_fabricacao,
        quantidade_estoque: quantidade_estoque,
    });

    try {
        const newBrinquedo = await brinquedo.save();
        res.json({ error: null, msg: "Cadastro ok", BrinquedoId: brinquedo._id });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.get("/cadastrarBrinquedo", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrarBrinquedo.html");
});

app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
});

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})  