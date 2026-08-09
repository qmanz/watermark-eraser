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
} as const;

export default es;