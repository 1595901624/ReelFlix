import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

// 加载环境变量
dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 代理路由 - 转发到外部 API
app.get('/api/proxy/vod', async (req: Request, res: Response): Promise<void> => {
  try {
    const baseUrl = req.query.baseUrl as string;
    if (!baseUrl) {
      res.status(400).json({ error: 'Missing baseUrl parameter' });
      return;
    }

    // 构建目标 URL
    const targetUrl = new URL(baseUrl);
    Object.keys(req.query).forEach(key => {
      if (key !== 'baseUrl') {
        targetUrl.searchParams.append(key, req.query[key] as string);
      }
    });

    // 转发请求
    const response = await axios.get(targetUrl.toString(), {
      timeout: 10000, // 10秒超时
      headers: {
        'User-Agent': 'ReelFlix/1.0'
      }
    });

    // 返回响应
    res.json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch from external API', 
      details: error.message 
    });
  }
});

// 路由
import moviesRouter from './routes/movies';
app.use('/api/movies', moviesRouter);

// 基本路由
app.get('/', (req: Request, res: Response) => {
  res.json({ message: '欢迎来到 ReelFlix 在线影视平台 API' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

export default app;