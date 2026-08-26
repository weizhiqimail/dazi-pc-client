export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}
