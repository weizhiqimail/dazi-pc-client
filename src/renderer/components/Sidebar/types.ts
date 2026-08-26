export interface SidebarProps {
  activePath: string;
  open: boolean;
  expandedGroups: ReadonlySet<string>;
  onToggleSidebar: () => void;
  onToggleGroup: (id: string) => void;
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
}
