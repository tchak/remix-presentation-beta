import type { ZodError } from 'zod';

import { Input, InputProps } from './form';
import type { Profile } from '~/util/db.server';

export type Errors = Record<
  keyof Profile,
  { message?: string; value?: string } | undefined
>;
export type ProfileData = {
  data: Profile | null;
  errors?: Errors;
};
type ProfileInputProps = InputProps & { name: keyof Profile };

const FIELDS: ProfileInputProps[] = [
  { label: 'First Name', name: 'firstName', required: true },
  { label: 'Last Name', name: 'lastName', required: true },
];

export function ProfileInfo({ profile }: { profile: Profile }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Profile Information
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Personal details and preferences.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">First Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.firstName}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {profile.lastName}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ProfileFields({
  id,
  legend,
  values,
  errors,
  disabled,
}: {
  id: string;
  legend: string;
  values?: Partial<Profile> | null;
  errors?: Errors;
  disabled?: boolean;
}) {
  const fields: ProfileInputProps[] = FIELDS.map(({ name, ...props }) => {
    const errorMessage = errors && errors[name]?.message;
    return {
      disabled,
      name,
      id: name,
      errorMessage,
      defaultValue: errorMessage
        ? (errors && errors[name]?.value) ??
          (values && values[name]) ??
          undefined
        : (values && values[name]) ?? undefined,
      ...props,
    };
  });
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg" id={id}>
        {legend}
      </legend>
      <div className="space-y-6">
        {fields.map((props) => (
          <Input key={props.id} {...props} />
        ))}
      </div>
    </fieldset>
  );
}

export function getErrors(error: ZodError, formData: FormData): Errors {
  const errors = {} as Record<string, unknown>;
  const issues = Object.fromEntries(
    error.issues.map(({ message, path }) => [path[0], message])
  );
  for (const [name, value] of formData) {
    errors[name] = { value: String(value), message: issues[name] };
  }
  return errors as Errors;
}
