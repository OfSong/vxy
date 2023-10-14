# vxy

## 先下载项目

## npm i

### 修改 /vxy/src/App.vue 73和120行的ip为后端api端口

```
const response = await axios.post('http://101.43.142.222:13000/gitdata');
//修改IP和端口
```

### 修改 frp\frpc.ini 内网穿透

```
[common]
server_addr = 101.0.0.0
server_port = 0
token = 0

[sshserver]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 12000

[vue]
type = tcp
local_ip = 127.0.0.1
local_port = 5173
remote_port = 12300

[api]
type = tcp
local_ip = 127.0.0.1
local_port = 3000
remote_port = 13000
```

### 数据存放在 api\data.json

### 后台启动方法

#### Vue

```js
// 启动
nohup npm run dev >/dev/null 2>&1 & exit
// 停止
// 输入 ps -A 调出任务管理器，kill 掉 node 进程。
```

#### node

```js
npm install -g pm2
pm2 start app.js        // 启动
pm2 start app.js -i max //启动 使用所有CPU核心的集群
pm2 stop app.js         // 停止
pm2 stop all            // 停止所有
pm2 restart app.js      // 重启
pm2 restart all         // 重启所有
pm2 delete  app.js      // 关闭
```

