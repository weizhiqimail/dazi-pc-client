export interface ToastMessage {
  id: number;
  title: string;
  detail?: string;
}
export interface ToastContextValue {
  push: (title: string, detail?: string) => void;
}
