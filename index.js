import express from 'express';
import fs from 'fs';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data); // Devuelve los datos parseados
    } catch (error) {
        console.log(error);
        return null; // En caso de error, devuelve null o maneja el error según tu lógica
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

// Llamamos a readData para obtener los datos
const jsonData = readData();

app.get("/", (req, res) => {
    res.send("Welcome!");
});

app.get("/libros", (req, res) => {
    if (jsonData) {
        res.json(jsonData.libros); 
    } else {
        res.status(500).send("Error obteniendo datos de libros"); 
    }
});
//
app.get("/libros/:id", (req, res) => {
    if (jsonData) {
        const data = readData();
        const id = parseInt(req.params.id);
        const libro = data.libros.find((libro) => libro.id === id);
        res.json(libro); 
    } else {
        res.status(500).send("Error obteniendo datos de libros"); 
    }
});

app.post("/new",(req,res)=>{
    if (jsonData) {
        const data = readData();
        const body=req.body;
        const newLibro= {
            id: data.libros.length +1,
            ...body,
        };
        data.libros.push(newLibro);
        writeData(data);
        res.json(newLibro);
    } else {
        const body=req.body;
        const newLibro= {
            id: 1,
            ...body,
        };
        data.libros.push(newLibro);
        writeData(data);
        res.json(newLibro);
    }
});

app.put("/libros/:id", (req, res) => {
    if (jsonData) {
        const data = readData();
        const body=req.body;
        const id = parseInt(req.params.id);
        const libroIndex = data.libros.findIndex((libro) => libro.id === id);
        data.libros[libroIndex]={
            ...data.libros[libroIndex],
            ...body,
        } 
        writeData(data);
        res.json(data.libros[libroIndex])
    } else {
        res.status(500).send("Error obteniendo datos de libros"); 
    }
});

app.delete("/libros/:id",(req,res)=>{
    if (jsonData) {
    const data = readData();
    const id = parseInt(req.params.id);
    const libroIndex = data.libros.findIndex((libro) => libro.id === id);
    data.libros.splice(libroIndex,1);
    writeData(data);
    res.json({message: "El libro se elimino correctamente"});
  } else {
    res.status(500).send("Error obteniendo datos de libros"); 
}
});

const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto: ${PUERTO}`);
});