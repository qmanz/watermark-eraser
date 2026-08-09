const zh = {
  app: {
    title: 'WatermarkEraser - AI 水印擦除',
    description: '基于 AI 的本地水印擦除工具，保护隐私，无需上传',
  },
  header: {
    title: 'WatermarkEraser',
  },
  dropzone: {
    dragHint: '拖拽图片到此处，或',
    clickHere: '点击选择',
    formats: '支持 JPG / PNG / WebP · 最大 50MB',
  },
  toolbar: {
    title: '画笔工具',
    brush: '画笔',
    eraser: '橡皮擦',
    rectangle: '矩形选区',
    undo: '撤销',
    clear: '清除',
    undoShortcut: '撤销 (Ctrl+Z)',
    clearShortcut: '清除遮罩',
  },
  brushSettings: {
    title: '画笔设置',
    size: '画笔大小',
    maskColor: '遮罩颜色',
  },
  shortcuts: {
    title: '快捷键',
    brush: '画笔',
    eraser: '橡皮擦',
    rectangle: '矩形选区',
    undo: '撤销',
    keys: {
      B: 'B',
      E: 'E',
      R: 'R',
      ctrlZ: 'Ctrl+Z',
    },
  },
  model: {
    title: 'AI 模型',
    description: 'Large Mask Inpainting · 200MB · 效果最佳',
    downloading: '下载中',
    unloaded: '未加载',
    ready: '已就绪',
    error: '加载失败',
    retryHint: '加载失败，请刷新页面重试',
  },
  actions: {
    reupload: '重新上传',
    startErase: '开始擦除水印',
    processing: '处理中...',
    download: '下载结果',
    downloadSuccess: '下载成功！',
    downloadFail: '下载失败',
    noResultDownload: '没有可下载的结果',
  },
  progress: {
    loading: '加载图片中...',
    inferring: 'AI 正在推理...',
  },
  compare: {
    title: '对比预览',
    result: '结果',
    original: '原图',
  },
  toast: {
    maskRequired: '请先涂抹需要擦除的水印区域',
    eraseSuccess: '水印擦除完成！',
    eraseFail: '推理失败，请重试',
  },
  infoBar: {
    privacy: { label: '隐私安全', value: '本地运行' },
    formats: { label: '图像格式', value: 'JPG / PNG / WebP' },
    maxFile: { label: '最大文件', value: '50MB' },
    speed: { label: '处理速度', value: '3-15 秒' },
  },
  errorBoundary: {
    title: '出错了',
    unknown: '发生了未知错误',
    refresh: '刷新页面',
  },
  ad: {
    label: '广告',
  },
  language: {
    label: '语言',
  },
  footer: {
    about: '关于我们',
    contact: '联系我们',
    privacy: '隐私政策',
    copyright: '© 2026 WatermarkEraser. 保留所有权利。',
  },
  pages: {
    aboutTitle: '关于 WatermarkEraser',
    aboutContent: 'WatermarkEraser 是一款免费、注重隐私的 AI 水印擦除工具。所有处理均在您的浏览器本地运行——您的图片永远不会上传到任何服务器。我们使用最先进的 LaMa（Large Mask Inpainting）模型，智能重建水印、Logo、文字和不必要物体背后的区域。',
    aboutFeatures: [
      '100% 本地处理，无需上传图片',
      'AI 驱动的 LaMa 修复模型',
      '支持 JPG、PNG、WebP 格式',
      '精准画笔和矩形选区工具',
      '原图与结果并排对比',
      '完全免费，无需注册',
    ],
    contactTitle: '联系我们',
    contactIntro: '有问题、建议或发现 Bug？欢迎联系我们。',
    contactEmail: '电子邮箱',
    contactResponse: '我们通常在 24 小时内回复。',
    privacyTitle: '隐私政策',
    privacyContent: '最后更新：2026 年 8 月\n\nWatermarkEraser 致力于保护您的隐私。以下是数据处理方式：\n\n1. 所有图片处理均在您浏览器本地进行，使用 WebAssembly 和 ONNX Runtime。您的图片不会离开您的设备。\n\n2. 我们不收集、存储或传输您的任何图片或个人数据到外部服务器。\n\n3. 唯一存储在您设备上的数据是您的语言偏好（localStorage）和 AI 模型文件（缓存至 IndexedDB，方便下次更快使用）。\n\n4. 我们使用 Google AdSense 展示广告。AdSense 可能使用 Cookie 来提供个性化广告。您可以在 https://policies.google.com/technologies/ads 了解更多关于 Google 如何使用数据的信息。\n\n5. 除 AdSense 提供的功能外，我们不使用任何分析或追踪工具。\n\n6. 如有关于本政策的任何疑问，请通过 support@watermarkeraser.com 联系我们。',
  },
} as const;

export default zh;