
import * as React from "react";
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

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

interface State {
  toasts: ToasterToast[];
}

export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface ToastContextProps {
  toasts: ToasterToast[];
  toast: (props: Toast) => void;
  dismiss: (toastId?: string) => void;
}

const ToastContext = React.createContext<ToastContextProps | undefined>(
  undefined
);

function toastReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        const timeout = toastTimeouts.get(toastId);
        if (timeout) clearTimeout(timeout);
        toastTimeouts.delete(toastId);
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const toast = React.useCallback((props: Toast) => {
    const id = genId();
    const newToast = { ...props, id, open: true };

    dispatch({ type: "ADD_TOAST", toast: newToast });

    return id;
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }, []);

  const remove = React.useCallback((toastId?: string) => {
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, []);

  React.useEffect(() => {
    const timeouts = state.toasts.map((toast) => {
      if (toast.open) {
        const timeout = setTimeout(() => {
          dispatch({ type: "DISMISS_TOAST", toastId: toast.id });
          
          setTimeout(() => {
            dispatch({ type: "REMOVE_TOAST", toastId: toast.id });
          }, TOAST_REMOVE_DELAY);
        }, 5000);

        return { id: toast.id, timeout };
      }
      return null;
    });

    const validTimeouts = timeouts.filter(Boolean) as {
      id: string;
      timeout: ReturnType<typeof setTimeout>;
    }[];

    validTimeouts.forEach(({ id, timeout }) => {
      toastTimeouts.set(id, timeout);
    });

    return () => {
      validTimeouts.forEach(({ timeout }) => {
        clearTimeout(timeout);
      });
    };
  }, [state.toasts]);

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export const toast = {
  // Create a toast object with methods
  default: (props: Toast) => {
    const { toast } = useToast();
    return toast({ ...props, variant: "default" });
  },
  destructive: (props: Toast) => {
    const { toast } = useToast();
    return toast({ ...props, variant: "destructive" });
  },
  success: (props: Toast) => {
    const { toast } = useToast();
    return toast({ ...props, variant: "success" });
  },
  warning: (props: Toast) => {
    const { toast } = useToast();
    return toast({ ...props, variant: "warning" });
  }
};
