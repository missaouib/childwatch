import {ToastOptions} from 'ng2-toastr';

export class CustomOption extends ToastOptions {
  animate = 'fade'; 
  newestOnTop = false;
  showCloseButton = true;
  toastLife = 5000;
  positionClass = 'toast-bottom-right';
};
