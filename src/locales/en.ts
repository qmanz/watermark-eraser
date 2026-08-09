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
  footer: {
    about: 'About Us',
    contact: 'Contact Us',
    privacy: 'Privacy Policy',
    copyright: '© 2026 WatermarkEraser. All rights reserved.',
  },
  pages: {
    aboutTitle: 'About WatermarkEraser',
    aboutContent: 'WatermarkEraser is a free, privacy-first AI watermark removal tool. All processing runs locally in your browser — your images are never uploaded to any server. We use the state-of-the-art LaMa (Large Mask Inpainting) model to intelligently reconstruct the area behind watermarks, logos, text, and unwanted objects.',
    aboutFeatures: [
      '100% local processing — no image upload',
      'AI-powered LaMa inpainting model',
      'Support JPG, PNG, WebP formats',
      'Precise brush and rectangle selection tools',
      'Side-by-side before/after comparison',
      'Completely free, no registration required',
    ],
    contactTitle: 'Contact Us',
    contactIntro: 'Have questions, suggestions, or found a bug? We\'d love to hear from you.',
    contactEmail: 'Email',
    contactResponse: 'We typically respond within 24 hours.',
    privacyTitle: 'Privacy Policy',
    privacyContent: 'Last updated: August 2026\n\nWatermarkEraser is committed to protecting your privacy. Here\'s how we handle your data:\n\n1. All image processing happens locally in your browser using WebAssembly and ONNX Runtime. Your images never leave your device.\n\n2. We do not collect, store, or transmit any of your images or personal data to external servers.\n\n3. The only data stored on your device is your language preference (in localStorage) and the AI model file (cached in IndexedDB for faster repeated use).\n\n4. We use Google AdSense to display advertisements. AdSense may use cookies to serve personalized ads. You can learn more about how Google uses data at https://policies.google.com/technologies/ads\n\n5. We do not use any analytics or tracking tools beyond what AdSense provides.\n\n6. If you have any questions about this policy, please contact us at support@watermarkeraser.com',
  },
} as const;

export default en;