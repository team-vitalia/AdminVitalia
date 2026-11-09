import Swal, { SweetAlertOptions } from "sweetalert2";
import toast from "react-hot-toast";

const isDarkMode = (): boolean => {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

export const confirmModal = async ({
  title,
  text,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  isDanger = false,
}: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDanger?: boolean;
}): Promise<boolean> => {
  const dark = isDarkMode();
  const result = await Swal.fire({
    title,
    text,
    icon: isDanger ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    background: dark ? "#0f172a" : "#ffffff",
    color: dark ? "#f8fafc" : "#0f172a",
    buttonsStyling: false,
    customClass: {
      popup:
        "rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 font-sans backdrop-blur",
      title: "text-lg font-bold text-slate-900 dark:text-white mb-2",
      htmlContainer: "text-sm text-slate-600 dark:text-slate-300",
      actions: "flex items-center gap-3 mt-4",
      confirmButton: `inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition cursor-pointer ${
        isDanger
          ? "bg-rose-600 hover:bg-rose-500 focus:ring-2 focus:ring-rose-500/50"
          : "bg-emerald-600 hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500/50"
      }`,
      cancelButton:
        "inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 cursor-pointer",
    },
  });

  return result.isConfirmed;
};

export const showAlert = async (
  options: SweetAlertOptions & { isDanger?: boolean }
) => {
  const dark = isDarkMode();
  return Swal.fire({
    background: dark ? "#0f172a" : "#ffffff",
    color: dark ? "#f8fafc" : "#0f172a",
    buttonsStyling: false,
    customClass: {
      popup:
        "rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 font-sans backdrop-blur",
      title: "text-lg font-bold text-slate-900 dark:text-white mb-2",
      htmlContainer: "text-sm text-slate-600 dark:text-slate-300",
      confirmButton:
        "inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer",
    },
    ...options,
  });
};

export const swalToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs",
  },
});

export { Swal, toast };
