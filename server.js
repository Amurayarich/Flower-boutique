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
app.use(bodyParser.json());

// подключаемся к базе данных
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });

// выводим главное окно
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// обработка формы заказа
app.post('/submit-order', async (req, res) => {
    const { user_name, user_phone, user_address, user_wish, bouquetItems } = req.body;
    const order_date = new Date().toISOString();

    try {
        // вставка данных в таблицу order_registration
        const orderResult = await client.query(
            'INSERT INTO order_registration (user_name, user_phone, user_address, user_wish, order_date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [user_name, user_phone, user_address, user_wish, order_date]
        );
        const orderId = orderResult.rows[0].id;

        // проверка наличия данных о букетах
        if (!bouquetItems) {
            throw new Error('Bouquet items are missing');
        }

        // парсинг данных о букетах
        const parsedBouquetItems = JSON.parse(bouquetItems);

        // обработка каждого букета
        for (const item of parsedBouquetItems) {
            // поиск букета в таблице bouquet
            const bouquetResult = await client.query(
                'SELECT id FROM bouquet WHERE bouquet_name = $1 AND bouquet_price = $2',
                [item.title, item.price]
            );

            let bouquetId;
            if (bouquetResult.rows.length > 0) {
                // если букет найден, используем его id
                bouquetId = bouquetResult.rows[0].id;
            } 

            // вставка данных в таблицу order_product
            await client.query(
                'INSERT INTO order_product (order_id, bouquet_id, count) VALUES ($1, $2, $3)',
                [orderId, bouquetId, item.quantity]
            );
        }

        res.send('Заказ успешно оформлен!');
    } catch (err) {
        console.error('Error processing order', err);
        res.status(500).send('Ошибка при оформлении заказа');
    }
});

// слушаем порт 3000    
app.listen(port, () => console.log(`server listening on port ${port}`));
