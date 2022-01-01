import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { useId } from '@reach/auto-id';

export type ButtonClassNameProps = {
  isActive?: boolean;
  primary?: boolean;
  full?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function buttonClassName({
  isActive = false,
  size = 'md',
  primary = false,
  full = false,
  className,
}: ButtonClassNameProps) {
  return clsx(
    'inline-flex items-center border shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    primary ? 'border-transparent text-white' : 'border-gray-300 text-gray-700',
    primary
      ? isActive
        ? 'bg-blue-700'
        : 'bg-blue-600 hover:bg-blue-700'
      : isActive
      ? 'bg-gray-200 hover:bg-gray-50'
      : 'bg-white hover:bg-gray-50',
    {
      'px-2.5 py-1.5 text-xs rounded': size == 'sm',
      'px-3 py-2 text-sm leading-4 rounded-md': size == 'md',
      'px-4 py-2 text-sm rounded-md': size == 'lg',
      'w-full flex justify-center': full,
    },
    className
  );
}

export type ButtonProps = ButtonClassNameProps &
  ComponentPropsWithoutRef<'button'>;

export function Button({
  children,
  size,
  primary,
  full,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ size, primary, full, className })}
      {...props}
    >
      {children}
    </button>
  );
}

export type InputProps = {
  label: string;
  name: string;
  description?: string;
  errorMessage?: string;
  filled?: boolean;
} & ComponentPropsWithoutRef<'input'>;

export function Input({
  type = 'text',
  name,
  label,
  description,
  errorMessage,
  filled,
  className,
  id: inputId,
  ...props
}: InputProps) {
  const id = useId(inputId);

  return (
    <div>
      <div className="flex justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {!props.required ? (
          <span className="text-sm text-gray-500" id={`${id}-optional`}>
            Optional
          </span>
        ) : null}
      </div>
      <div
        className={clsx('mt-1', {
          'relative rounded-md shadow-sm': errorMessage,
        })}
      >
        <input
          type={type}
          name={name}
          id={id}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete={type == 'email' ? 'email' : 'off'}
          className={clsx(
            'sm:text-sm rounded-md block w-full',
            {
              'pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500':
                errorMessage,
              'shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300':
                !errorMessage,
            },
            className
          )}
          aria-invalid={errorMessage ? 'true' : undefined}
          aria-describedby={describedby({
            id,
            error: !!errorMessage,
            description: !!description,
            required: props.required,
          })}
          {...props}
        />
        {filled || errorMessage ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {filled ? (
              <CheckCircleIcon
                className="h-5 w-5 text-green-500"
                aria-hidden="true"
              />
            ) : (
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            )}
          </div>
        ) : null}
      </div>
      {errorMessage ? (
        <p
          role="alert"
          className="mt-2 text-sm text-red-600"
          id={`${id}-error`}
        >
          {errorMessage}
        </p>
      ) : description ? (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function describedby({
  id,
  error,
  description,
  required,
}: {
  id?: string;
  error?: boolean;
  description?: boolean;
  required?: boolean;
}): string | undefined {
  if (!id) {
    return;
  }
  if (error) {
    return `${id}-error`;
  }
  if (description) {
    return required ? `${id}-description` : `${id}-description ${id}-optional`;
  }
  if (!required) {
    return `${id}-optional`;
  }
}
