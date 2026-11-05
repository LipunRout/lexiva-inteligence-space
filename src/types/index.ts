export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type BadgeVariant = 'default' | 'success' | 'alert';
export type CardVariant = 'default' | 'elevated' | 'pricing';

export interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

export interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export interface InputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
  ctaHref: string;
}
