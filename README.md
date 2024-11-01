# Barcode Scanner App 📱

Aplicación construida como ejemplo práctico, en este caso para escanear códigos QR, seleccionar desde la galería del celular, copiar al portapeles, y compartir a otras personas. Para ello utilizamos lo siguiente:

- @capacitor/clipboard 
- @capawesome/capacitor-file-picker
- @capacitor-mlkit/barcode-scanning
- @capacitor/share
- @capacitor/filesystem
- html2canvas

## Features:

- A través de la función startScanner() inicializamos el escaner con el componente _BarcodeScanningModalComponent_
- A través de la función downloadImage() descargamos la imagen _Version WEB_
- A través de la función shareImage() nos permite compartir imágenes a través del celular
- A través de la función readQRCode() leeremos la imagen obtenida previamente de la galería de nuestro celular
- A través de la función writeToClipboard() nos permite copiar y pegar en portapeles los datos obtenidos del código QR.

  
