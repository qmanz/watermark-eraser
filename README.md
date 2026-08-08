<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/favicon.svg">
  <img src="public/favicon.svg" width="100" height="100" align="right" alt="logo">
</picture>

# WatermarkEraser

🪄 基于 AI 的浏览器端水印擦除工具 —— 所有处理完全在本地完成，图片绝不会上传到服务器。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ 特性

- 🔒 **隐私优先** — 所有图片处理都在浏览器本地完成，数据永不离开你的设备
- 🧠 **AI 驱动** — 使用 LaMa（Large Mask Inpainting）模型，擦除效果自然无痕
- 🖌️ **交互式涂抹** — Canvas 三明治图层，画笔/橡皮擦自由标注水印区域
- ⚡ **快速缓存** — 通过 IndexedDB 缓存 AI 模型（~200MB），首次下载后毫秒级加载
- 📱 **PWA 支持** — 可安装到桌面，支持离线使用
- 🎨 **对比预览** — 滑块拖拽对比原图和擦除结果
- 🚀 **轻量构建** — 打包产物仅 ~170KB（AI 模型从 CDN 按需加载）

## 🖼️ 效果预览

| 原图 | 涂抹水印 | AI 擦除结果 |
|------|----------|-------------|
| 上传带水印图片 | 用画笔涂抹水印区域 | 一键擦除，自然无痕 |

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 6 + Tailwind CSS 3 |
| AI 推理 | ONNX Runtime Web（CDN 加载） |
| AI 模型 | LaMa fp32 ONNX（~200MB） |
| 存储 | IndexedDB 模型缓存 |
| 离线 | PWA（Workbox Service Worker） |

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/你的用户名/watermark-eraser.git
cd watermark-eraser

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173`，上传一张带水印的图片，涂抹水印区域，点击"开始擦除水印"。

## 📦 构建部署

```bash
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建产物
```

`dist/` 目录可直接部署到任何静态文件服务器（Vercel / Netlify / Cloudflare Pages / Nginx 等）。

## 🏗️ 架构设计

```
src/
├── App.tsx                   # 应用主状态机（idle → editing → inferring → done）
├── constants.ts              # 全局常量（模型URL、推理参数、UI 配置）
├── components/
│   ├── Header.tsx            # 顶部导航 + 模型状态指示
│   ├── DropZone.tsx          # 图片拖拽/点击上传
│   ├── ImageEditor.tsx       # Canvas 三明治图层（原图 + 遮罩）
│   ├── ToolPanel.tsx         # 画笔/橡皮擦/撤销工具栏
│   ├── ModelSelector.tsx     # AI 模型信息面板
│   ├── ProgressBar.tsx       # 推理进度条
│   ├── CompareView.tsx       # 原图/结果滑块对比
│   ├── Toast.tsx             # 消息提示
│   └── ErrorBoundary.tsx     # React 错误边界
├── hooks/
│   ├── useCanvas.ts          # Canvas 交互 + 遮罩历史
│   ├── useImageUpload.ts     # 图片文件解析
│   └── useInference.ts       # ONNX 推理引擎
├── utils/
│   ├── image.ts              # Canvas 工具函数
│   ├── tensor.ts             # 张量转换（CHW ↔ ImageData）
│   ├── model.ts              # 模型下载/缓存
│   └── storage.ts            # IndexedDB 封装
├── workers/
│   └── inference.worker.ts   # Web Worker 推理（预留）
└── types/
    └── index.ts              # TypeScript 类型定义
```

### 推理流程

```
用户涂抹水印 → 获取原图+遮罩 ImageData
  → imageToTensor() / maskToTensor() [512×512 CHW Float32]
  → ONNX InferenceSession.run()
  → tensorToImageData() + resize [恢复原图尺寸]
  → 绘制回 Canvas + 滑块对比
```

## ⚠️ 注意事项

- **首次使用**需要下载 AI 模型（~200MB），请耐心等待（国内推荐使用代理加速）
- 推理使用 **WebAssembly** 后端，在浏览器中运行，处理 512×512 图片约 3-15 秒
- 当前仅支持 **LaMa** 模型。MI-GAN 因 hf-mirror CORS 限制暂不可用
- 建议使用 **Chrome / Edge** 浏览器，对 WebAssembly 支持最好

## 📄 License

MIT