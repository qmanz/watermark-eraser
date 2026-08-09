const es = {
  app: {
    title: 'WatermarkEraser - Eliminación de Marcas de Agua con IA',
    description: 'Herramienta local de eliminación de marcas de agua con IA. Privacidad primero, sin necesidad de subir.',
  },
  header: {
    title: 'WatermarkEraser',
  },
  dropzone: {
    dragHint: 'Arrastra la imagen aquí, o',
    clickHere: 'haz clic para seleccionar',
    formats: 'Formatos JPG / PNG / WebP · Máx 50MB',
  },
  toolbar: {
    title: 'Herramientas',
    brush: 'Pincel',
    eraser: 'Borrador',
    rectangle: 'Rectángulo',
    undo: 'Deshacer',
    clear: 'Limpiar',
    undoShortcut: 'Deshacer (Ctrl+Z)',
    clearShortcut: 'Limpiar máscara',
  },
  brushSettings: {
    title: 'Ajustes de Pincel',
    size: 'Tamaño',
    maskColor: 'Color de Máscara',
  },
  shortcuts: {
    title: 'Atajos',
    brush: 'Pincel',
    eraser: 'Borrador',
    rectangle: 'Rectángulo',
    undo: 'Deshacer',
    keys: {
      B: 'B',
      E: 'E',
      R: 'R',
      ctrlZ: 'Ctrl+Z',
    },
  },
  model: {
    title: 'Modelo IA',
    description: 'Large Mask Inpainting · 200MB · Mejor Calidad',
    downloading: 'Descargando',
    unloaded: 'No cargado',
    ready: 'Listo',
    error: 'Error',
    retryHint: 'Error al cargar, por favor actualiza la página',
  },
  actions: {
    reupload: 'Nueva Imagen',
    startErase: 'Eliminar Marca de Agua',
    processing: 'Procesando...',
    download: 'Descargar Resultado',
    downloadSuccess: '¡Descarga exitosa!',
    downloadFail: 'Descarga fallida',
    noResultDownload: 'No hay resultado para descargar',
  },
  progress: {
    loading: 'Cargando imagen...',
    inferring: 'IA procesando...',
  },
  compare: {
    title: 'Comparar',
    result: 'Resultado',
    original: 'Original',
  },
  toast: {
    maskRequired: 'Por favor marca primero el área de la marca de agua',
    eraseSuccess: '¡Marca de agua eliminada!',
    eraseFail: 'Error de inferencia, por favor intenta de nuevo',
  },
  infoBar: {
    privacy: { label: 'Privacidad', value: 'Procesamiento Local' },
    formats: { label: 'Formatos', value: 'JPG / PNG / WebP' },
    maxFile: { label: 'Tamaño Máx', value: '50MB' },
    speed: { label: 'Velocidad', value: '3-15 seg' },
  },
  errorBoundary: {
    title: 'Algo salió mal',
    unknown: 'Ocurrió un error desconocido',
    refresh: 'Actualizar Página',
  },
  ad: {
    label: 'Anuncio',
  },
  language: {
    label: 'Idioma',
  },
  footer: {
    about: 'Sobre Nosotros',
    contact: 'Contáctanos',
    privacy: 'Política de Privacidad',
    copyright: '© 2026 WatermarkEraser. Todos los derechos reservados.',
  },
  pages: {
    aboutTitle: 'Acerca de WatermarkEraser',
    aboutContent: 'WatermarkEraser es una herramienta gratuita de eliminación de marcas de agua con IA que prioriza la privacidad. Todo el procesamiento se ejecuta localmente en tu navegador: tus imágenes nunca se suben a ningún servidor. Utilizamos el modelo de vanguardia LaMa (Large Mask Inpainting) para reconstruir inteligentemente el área detrás de marcas de agua, logotipos, texto y objetos no deseados.',
    aboutFeatures: [
      'Procesamiento 100% local — sin subida de imágenes',
      'Modelo de restauración LaMa impulsado por IA',
      'Soporte para formatos JPG, PNG, WebP',
      'Herramientas precisas de pincel y selección rectangular',
      'Comparación lado a lado antes/después',
      'Completamente gratis, sin registro',
    ],
    contactTitle: 'Contáctanos',
    contactIntro: '¿Tienes preguntas, sugerencias o encontraste un error? Nos encantaría saber de ti.',
    contactEmail: 'Correo electrónico',
    contactResponse: 'Normalmente respondemos en 24 horas.',
    privacyTitle: 'Política de Privacidad',
    privacyContent: 'Última actualización: Agosto 2026\n\nWatermarkEraser se compromete a proteger tu privacidad. Así es como manejamos tus datos:\n\n1. Todo el procesamiento de imágenes ocurre localmente en tu navegador usando WebAssembly y ONNX Runtime. Tus imágenes nunca salen de tu dispositivo.\n\n2. No recopilamos, almacenamos ni transmitimos ninguna de tus imágenes o datos personales a servidores externos.\n\n3. Los únicos datos almacenados en tu dispositivo son tu preferencia de idioma (en localStorage) y el archivo del modelo de IA (en caché en IndexedDB para un uso repetido más rápido).\n\n4. Usamos Google AdSense para mostrar anuncios. AdSense puede usar cookies para servir anuncios personalizados. Puedes obtener más información sobre cómo Google utiliza los datos en https://policies.google.com/technologies/ads\n\n5. No utilizamos ninguna herramienta de análisis o seguimiento más allá de lo que proporciona AdSense.\n\n6. Si tienes alguna pregunta sobre esta política, contáctanos en support@watermarkeraser.com',
  },
} as const;

export default es;