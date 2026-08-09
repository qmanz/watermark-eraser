const en = {
  app: {
    title: 'WatermarkEraser - AI Watermark Removal',
    description: 'AI-powered local watermark removal tool. Privacy-first, no upload needed.',
  },
  header: {
    title: 'WatermarkEraser',
  },
  dropzone: {
    dragHint: 'Drag & drop image here, or',
    clickHere: 'click to select',
    formats: 'Supports JPG / PNG / WebP · Max 50MB',
  },
  toolbar: {
    title: 'Tools',
    brush: 'Brush',
    eraser: 'Eraser',
    rectangle: 'Rectangle',
    undo: 'Undo',
    clear: 'Clear',
    undoShortcut: 'Undo (Ctrl+Z)',
    clearShortcut: 'Clear mask',
  },
  brushSettings: {
    title: 'Brush Settings',
    size: 'Brush Size',
    maskColor: 'Mask Color',
  },
  shortcuts: {
    title: 'Shortcuts',
    brush: 'Brush',
    eraser: 'Eraser',
    rectangle: 'Rectangle',
    undo: 'Undo',
    keys: {
      B: 'B',
      E: 'E',
      R: 'R',
      ctrlZ: 'Ctrl+Z',
    },
  },
  model: {
    title: 'AI Model',
    description: 'Large Mask Inpainting · 200MB · Best Quality',
    downloading: 'Downloading',
    unloaded: 'Not loaded',
    ready: 'Ready',
    error: 'Failed',
    retryHint: 'Failed to load, please refresh the page',
  },
  actions: {
    reupload: 'New Image',
    startErase: 'Remove Watermark',
    processing: 'Processing...',
    download: 'Download Result',
    downloadSuccess: 'Download successful!',
    downloadFail: 'Download failed',
    noResultDownload: 'No result to download',
  },
  progress: {
    loading: 'Loading image...',
    inferring: 'AI is processing...',
  },
  compare: {
    title: 'Compare',
    result: 'Result',
    original: 'Original',
  },
  toast: {
    maskRequired: 'Please mark the watermark area first',
    eraseSuccess: 'Watermark removed!',
    eraseFail: 'Inference failed, please try again',
  },
  infoBar: {
    privacy: { label: 'Privacy', value: 'Local Processing' },
    formats: { label: 'Formats', value: 'JPG / PNG / WebP' },
    maxFile: { label: 'Max Size', value: '50MB' },
    speed: { label: 'Speed', value: '3-15 sec' },
  },
  errorBoundary: {
    title: 'Something went wrong',
    unknown: 'An unknown error occurred',
    refresh: 'Refresh Page',
  },
  ad: {
    label: 'Ad',
  },
  language: {
    label: 'Language',
  },
} as const;

export default en;