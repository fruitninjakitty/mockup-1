
// This file is a re-export
// All functionality is in the shadcn/ui components
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToastActionType = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ToastActionElement;

export const toastVariants = {
  default: "bg-white border-gray-200 text-gray-900",
  destructive:
    "destructive group bg-red-500 text-white border-red-500 dark:border-red-500",
  success: "bg-green-100 border-green-500 text-green-600",
  warning: "bg-yellow-100 border-amber-500 text-amber-600",
};

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionType;
  variant?: keyof typeof toastVariants;
};

export type Toast = Omit<ToasterToast, "id">;

export interface ToastContextProps {
  toast: (props: Toast) => void;
  dismiss: (toastId?: string) => void;
}

export const useToast = () => {
  return {
    toast: (props: Toast) => {
      // This is just a stub - see components/ui/use-toast.ts for the actual implementation
      console.log("Toast", props);
    },
    dismiss: (toastId?: string) => {
      console.log("Dismiss", toastId);
    },
  };
};
