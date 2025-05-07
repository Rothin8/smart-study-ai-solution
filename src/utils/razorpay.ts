
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in smallest currency unit (paise for INR)
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async (options: RazorpayOptions): Promise<any> => {
  const isLoaded = await loadRazorpayScript();
  
  if (!isLoaded) {
    throw new Error("Failed to load Razorpay SDK");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      ...options,
      handler: (response: any) => {
        resolve(response);
        if (options.handler) {
          options.handler(response);
        }
      },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment cancelled by user"));
          if (options.modal?.ondismiss) {
            options.modal.ondismiss();
          }
        }
      }
    });
    
    rzp.open();
  });
};
