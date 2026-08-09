const ar = {
  app: {
    title: 'WatermarkEraser - إزالة العلامات المائية بالذكاء الاصطناعي',
    description: 'أداة محلية لإزالة العلامات المائية بالذكاء الاصطناعي. الخصوصية أولاً، لا حاجة للرفع.',
  },
  header: {
    title: 'WatermarkEraser',
  },
  dropzone: {
    dragHint: 'اسحب الصورة هنا، أو',
    clickHere: 'انقر للاختيار',
    formats: 'يدعم JPG / PNG / WebP · الحد الأقصى 50MB',
  },
  toolbar: {
    title: 'الأدوات',
    brush: 'فرشاة',
    eraser: 'ممحاة',
    rectangle: 'مستطيل',
    undo: 'تراجع',
    clear: 'مسح',
    undoShortcut: 'تراجع (Ctrl+Z)',
    clearShortcut: 'مسح القناع',
  },
  brushSettings: {
    title: 'إعدادات الفرشاة',
    size: 'حجم الفرشاة',
    maskColor: 'لون القناع',
  },
  shortcuts: {
    title: 'اختصارات',
    brush: 'فرشاة',
    eraser: 'ممحاة',
    rectangle: 'مستطيل',
    undo: 'تراجع',
    keys: {
      B: 'B',
      E: 'E',
      R: 'R',
      ctrlZ: 'Ctrl+Z',
    },
  },
  model: {
    title: 'نموذج الذكاء الاصطناعي',
    description: 'Large Mask Inpainting · 200MB · أفضل جودة',
    downloading: 'جاري التحميل',
    unloaded: 'غير محمل',
    ready: 'جاهز',
    error: 'فشل',
    retryHint: 'فشل التحميل، يرجى تحديث الصفحة',
  },
  actions: {
    reupload: 'صورة جديدة',
    startErase: 'إزالة العلامة المائية',
    processing: 'جاري المعالجة...',
    download: 'تنزيل النتيجة',
    downloadSuccess: 'تم التنزيل بنجاح!',
    downloadFail: 'فشل التنزيل',
    noResultDownload: 'لا توجد نتيجة للتنزيل',
  },
  progress: {
    loading: 'جاري تحميل الصورة...',
    inferring: 'الذكاء الاصطناعي يعالج...',
  },
  compare: {
    title: 'مقارنة',
    result: 'النتيجة',
    original: 'الأصلي',
  },
  toast: {
    maskRequired: 'يرجى تحديد منطقة العلامة المائية أولاً',
    eraseSuccess: 'تمت إزالة العلامة المائية!',
    eraseFail: 'فشلت المعالجة، يرجى المحاولة مرة أخرى',
  },
  infoBar: {
    privacy: { label: 'الخصوصية', value: 'معالجة محلية' },
    formats: { label: 'الصيغ', value: 'JPG / PNG / WebP' },
    maxFile: { label: 'الحجم الأقصى', value: '50MB' },
    speed: { label: 'السرعة', value: '3-15 ثانية' },
  },
  errorBoundary: {
    title: 'حدث خطأ ما',
    unknown: 'حدث خطأ غير معروف',
    refresh: 'تحديث الصفحة',
  },
  ad: {
    label: 'إعلان',
  },
  language: {
    label: 'اللغة',
  },
} as const;

export default ar;