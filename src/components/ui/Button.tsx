'use client';

import Icon from './Icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'green' | 'amber' | 'ghost' | 'ink' | 'outline';
  onClick?: () => void;
  icon?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Button({
  children,
  variant = 'amber',
  onClick,
  icon,
  className = '',
  type = 'button',
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className}`.trim()}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
    >
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}
