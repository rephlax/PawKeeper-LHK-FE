import React from 'react'
import { styles } from './Button.styles'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  as = 'button',
  href,
  ...props
}) => {
  const Component = as

  const buttonStyle = {
    ...styles.base,
    ...styles.variants[variant],
    ...styles.sizes[size],
    ...(disabled ? styles.disabled : {}),
    ...(fullWidth ? styles.fullWidth : {}),
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-cream-600 text-white hover:bg-cream-700'
      case 'secondary':
        return 'border-cream-400 text-cream-700 hover:bg-cream-50'
      case 'ghost':
        return 'text-cream-700 hover:bg-cream-50'
      default:
        return ''
    }
  }

  const componentProps = {
    style: buttonStyle,
    className: `${getVariantClasses()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`,
    onClick: disabled ? undefined : onClick,
    disabled: Component === 'button' ? disabled : undefined,
    type: Component === 'button' ? type : undefined,
    href: Component === 'a' ? href : undefined,
    ...props,
  }

  return <Component {...componentProps}>{children}</Component>
}

export default Button
