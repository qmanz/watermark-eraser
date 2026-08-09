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
  footer: {
    about: 'من نحن',
    contact: 'اتصل بنا',
    privacy: 'سياسة الخصوصية',
    copyright: '© 2026 WatermarkEraser. جميع الحقوق محفوظة.',
  },
  pages: {
    aboutTitle: 'حول WatermarkEraser',
    aboutContent: 'WatermarkEraser هي أداة مجانية لإزالة العلامات المائية بالذكاء الاصطناعي تركز على الخصوصية. تتم جميع المعالجات محليًا في متصفحك — لا يتم رفع صورك أبدًا إلى أي خادم. نستخدم نموذج LaMa (Large Mask Inpainting) المتطور لإعادة بناء المنطقة خلف العلامات المائية والشعارات والنصوص والكائنات غير المرغوب فيها بذكاء.',
    aboutFeatures: [
      'معالجة محلية 100% — بدون رفع الصور',
      'نموذج LaMa للترميم بالذكاء الاصطناعي',
      'دعم صيغ JPG و PNG و WebP',
      'أدوات فرشاة وتحديد مستطيل دقيقة',
      'مقارنة جنبًا إلى جنب قبل/بعد',
      'مجاني تمامًا، بدون تسجيل',
    ],
    contactTitle: 'اتصل بنا',
    contactIntro: 'هل لديك أسئلة أو اقتراحات أو وجدت خطأ؟ نود أن نسمع منك.',
    contactEmail: 'البريد الإلكتروني',
    contactResponse: 'نرد عادةً خلال 24 ساعة.',
    privacyTitle: 'سياسة الخصوصية',
    privacyContent: 'آخر تحديث: أغسطس 2026\n\nتلتزم WatermarkEraser بحماية خصوصيتك. إليك كيفية تعاملنا مع بياناتك:\n\n1. تتم جميع معالجات الصور محليًا في متصفحك باستخدام WebAssembly و ONNX Runtime. صورك لا تغادر جهازك أبدًا.\n\n2. لا نقوم بجمع أو تخزين أو نقل أي من صورك أو بياناتك الشخصية إلى خوادم خارجية.\n\n3. البيانات الوحيدة المخزنة على جهازك هي تفضيل اللغة (في localStorage) وملف نموذج الذكاء الاصطناعي (مخزن مؤقتًا في IndexedDB للاستخدام المتكرر الأسرع).\n\n4. نستخدم Google AdSense لعرض الإعلانات. قد تستخدم AdSense ملفات تعريف الارتباط لتقديم إعلانات مخصصة. يمكنك معرفة المزيد حول كيفية استخدام Google للبيانات على https://policies.google.com/technologies/ads\n\n5. لا نستخدم أي أدوات تحليل أو تتبع تتجاوز ما توفره AdSense.\n\n6. إذا كانت لديك أي أسئلة حول هذه السياسة، يرجى الاتصال بنا على support@watermarkeraser.com',
  },
} as const;

export default ar;