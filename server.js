const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Client } = require('pg');

// инициализируем приложение
const app = express();
const port = 3000;
const client = new Client({
    user: 'myuser',
    password: '789456123',
    host: 'localhost',
    port: '5432',
    database: 'Flower butique',
});

// подключаем статические файлы
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// выводим главное окно
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// подключаемся к базе данных
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });

// выводим файл index.html
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});



// слушаем порт 3000    
app.listen(port, () => console.log(`server listening on port ${port}`));