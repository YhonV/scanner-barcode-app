import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  segment = 'scan';
  qrText = 'Dayana'
  scanResult = '';

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    if(this.platform.is('capacitor')){
      BarcodeScanner.isSupported().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  async startScanner() {
    const modal = await this.modalController.create({
    component: BarcodeScanningModalComponent,
    cssClass: 'barcode-scanning-modal',
    showBackdrop: false,
    componentProps: { 
      formats: [],
      LensFacing: LensFacing.Back
     }
    });
  
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data){
      this.scanResult = data?.barcode?.displayValue;
    }
  
  }

  // ====== Captura HTML element and convert it to canvas and get an image ====== //
  captureScreen(){
    const element = document.getElementById('qrImage') as HTMLElement;

    html2canvas(element).then((canvas: HTMLCanvasElement) =>{
      this.downloadImage(canvas);
      if(this.platform.is('capacitor')) this.shareImage(canvas);
      else this.downloadImage(canvas);
    })
  }

  // ====== Download image for web ====== //
  downloadImage(canvas: HTMLCanvasElement){
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'qr-code.png';
    link.click();
  }

    // ====== Share image for mobile ====== //
    async shareImage(canvas: HTMLCanvasElement){

      let base64 = canvas.toDataURL();
      let path = 'qr-code.png';

        const loading = await this.loadingController.create({spinner: 'crescent'});
        await loading.present();

      await Filesystem.writeFile({
          path,
          data: base64,
          directory: Directory.Cache,
        }).then(async (res) => {
          let uri = res.uri;
            await Share.share({url: uri});

            await Filesystem.deleteFile({
              path,
              directory: Directory.Cache
            })
        }).finally(() => {
          loading.dismiss();
        })
    }

  // ====== Read QR from an image ====== //
  async readQRCode(){
      const {files } = await FilePicker.pickImages();

      const path = files[0]?.path;

      if(!path){return;}

      const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
        path,
        formats: []
      }) 

      this.scanResult = barcodes[0]?.displayValue;
    };

  // ====== Read QR from an image ====== //
    writeToClipboard = async () => {
      await Clipboard.write({
        string: this.scanResult
      });
      const toast = await this.toastController.create({
        message: 'Copied to clipboard',
        duration: 1000,
        color: 'tertiary',
        icon: 'clipboard-outline',
        position: 'middle'
      });
      toast.present();

    };
}
