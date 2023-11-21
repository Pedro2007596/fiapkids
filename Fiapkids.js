//instalando programas
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
 
//configurando o roteamento para teste no postman
const router = require('express').Router();
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
const port = 3000;
 
//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/FiapKids', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 100000,
});
 
//cadastro do usuario
const CadastroSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, required: true},
    senha : {type : String}
});
const Cadastro = mongoose.model("Cadastro", CadastroSchema);
 
const BrinquedoSchema = new mongoose.Schema({
    codigo : {type : String, required: true},
    descricao : {type : String},
    fornecedor : {type : String},
    data_fabricacao : {type : String},
    quantidade_estoque : {type : String}
});
const Brinquedo = mongoose.model("Brinquedo", BrinquedoSchema);
//configurando os roteamentos
app.post("/cadastrarUsuario", async(req, res)=>{
	const nome = req.body.nome; 
	const email = req.body.email;
    const senha = req.body.senha;
    
    //testando se todos os campos foram prenchidos
    if(nome == null || email == null || senha == null ){
        return res.status(400).json({error: "Preencha todos os dados.."})
    }
 
    //teste se o email da existe
    const emailExistente = await Cadastro.findOne({email:email})
    if(emailExistente){
        return res.status(400).json({error : "O e-mail cadastrado já existe!!"})
    }
 
    //mandando para o banco
    const Cadastrado = new Cadastro({
        nome : nome,
        email : email,
		senha : senha
    })
 
    try{
        const newCadastro = await Cadastrado.save();
        res.json({error : null, msg : "Cadastro ok", cadastradoId : newCadastro._id});
    } catch(error){
        res.status(400).json({error});
    }
});
app.post("/cadastrarBrinquedo", async(req, res)=>{
	const codigo = req.body.codigo; 
	const descricao = req.body.descricao;
    const fornecedor = req.body.fornecedor;
    const data_fabricacao = req.body.data_fabricacao;
    const quantidade_estoque  = req.body.quantidade_estoque;
    
    //testando se todos os campos foram prenchidos
    if(codigo == null || descricao == null || fornecedor == null || data_fabricacao == null || quantidade_estoque == null){
        return res.status(400).json({error: "Preencha todos os dados.."})
    }
    const codigoExistente = await Brinquedo.findOne({codigo:codigo})
    if(codigoExistente){
        return res.status(400).json({error : "O codigo cadastrado já existe!!"})
    }
 
    //mandando para o banco
    const cadBrinquedo = new Brinquedo({
        codigo : codigo,
        descricao : descricao,
		fornecedor : fornecedor,
        data_fabricacao : data_fabricacao,
		quantidade_estoque : quantidade_estoque
    })
 
    try{
        const newBrinquedo = await cadBrinquedo.save();
        res.json({ error: null, msg: "Cadastro ok", BrinquedoId: newBrinquedo._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
 
//rota para o get de cadastro
app.get("/cadastrarUsuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrarUsu.html");
})
 
//rota para o get de login
app.get("/cadastrarBrinquedo", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrarBrinquedo.html");
})
 
//rota raiz - inw
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})
 
//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})