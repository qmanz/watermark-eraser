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
} as const;

export default zh;