import toast from "react-hot-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";



export function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
}


export const showToast = (message) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-base-100 text-secondary font-semibold rounded-lg p-4 flex items-center justify-center mt-10`}

      >
        <span className="text-center">{message}</span>
      </div>
    ),
    {
      duration: 4000,
      position: "bottom-middle-center",
    }
  );
};