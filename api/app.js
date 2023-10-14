const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { log } = require('console');
const cors = require('cors');

const app = express();

// 允许所有域名访问资源
app.use(cors());


// 使用 body-parser 中间件来解析请求体
app.use(bodyParser.json());

// 处理 POST 请求，将数据保存到 JSON 文件中

app.post('/updata', (req, res) => {
    const formData = req.body;
    log(formData)
    // 读取现有的 JSON 文件内容
    const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

    // 将新的数据追加到 JSON 数组中
    jsonData.push(formData);

    // 将更新后的数据写入到 JSON 文件中
    fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2), 'utf-8');

    res.send('Data saved successfully!');
});

// 处理 POST 请求，获取数据
app.post('/gitdata', (req, res) => {
    const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    log(jsonData)
    res.send(jsonData)
    res.send('获取成功');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
