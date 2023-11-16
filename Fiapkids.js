//instalando programas
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
 
//configurando o roteamento para teste no postman
const router = require('express').Router();
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;
 
//configurando o acesso ao mongodb
mongoose.connect('mongodb://127.0.0.1:27017/FiapKids',
{   useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS : 20000
});
 
//cadastro do usuario
const CadastroSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, required: true},
    senha : {type : String}
});
const Cadastro = mongoose.model("Cadastro", CadastroSchema);
 
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
 
//rota para o get de cadastro
app.get("/cadastrarUsuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrarUsu.html");
})
 
//rota para o get de login
app.get("/login", async(req, res)=>{
    res.sendFile(__dirname +"/Pgs/login.html");
})
 
//rota raiz - inw
app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})
 
//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})