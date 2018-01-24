export interface ChildMenuItem {
  path: string;
  title: string;
  disabled?: boolean;
  requireRole?: string[];
}

export interface MenuItem extends ChildMenuItem {
  type: string;
  icon: string;
  children?: ChildMenuItem[];
}