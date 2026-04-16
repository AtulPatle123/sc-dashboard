import { toast, ToastOptions } from "react-toastify";

class ToastService {
  defaultOptions: ToastOptions = {
    position: "bottom-right",
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
    autoClose: 500,
  };

  success(msg: string): void {
    toast.success(msg, {
      ...this.defaultOptions,
    });
  }

  error(msg: string): void {
    toast.error(msg, {
      ...this.defaultOptions,
    });
  }
}
const toastService  = new ToastService()
export default toastService;
