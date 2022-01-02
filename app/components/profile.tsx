import type { ZodError } from 'zod';

import type { InputProps, SelectProps } from './form';
import type { Profile } from '~/util/db.server';
import { Input } from './form';

export type Errors = Record<
  keyof Profile,
  { message?: string; value?: string } | undefined
>;
export type ProfileData = {
  data: Profile | null;
  errors?: Errors;
};
type ProfileInputProps = InputProps<keyof Profile> | SelectProps<keyof Profile>;

const FIELDS: ProfileInputProps[] = [
  { label: 'First Name', name: 'firstName', required: true },
  { label: 'Last Name', name: 'lastName', required: true },
  { label: 'Country', name: 'country', options: [], required: true },
  { label: 'Vaccinated', name: 'vaccinated', type: 'checkbox' },
];

export function ProfileInfo({
  profile,
  form,
}: {
  profile: Profile;
  form?: FormData;
}) {
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
          {FIELDS.map(({ label, name, ...field }) => (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {isCheckbox(field) ? (
                  <input
                    type="checkbox"
                    readOnly
                    disabled
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    defaultChecked={getBooleanValue(name, profile, form)}
                  />
                ) : (
                  getStringValue(name, profile, form)
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function getStringValue(
  name: keyof Profile,
  profile: Profile,
  form?: FormData
): string {
  if (form && form.has(name)) {
    return String(form.get(name));
  }
  return String(profile[name]);
}

function getBooleanValue(
  name: keyof Profile,
  profile: Profile,
  form?: FormData
): boolean {
  return !!((form && form.get(name) == 'true') || profile[name]);
}

function isCheckbox(field: Partial<ProfileInputProps>): boolean {
  return 'type' in field && field.type == 'checkbox';
}

export function ProfileFields({
  id,
  legend,
  values,
  errors,
  options,
  disabled,
}: {
  id: string;
  legend: string;
  values?: Partial<Profile> | null;
  errors?: Errors;
  disabled?: boolean;
  options?: Partial<Record<keyof Profile, SelectProps['options'] | undefined>>;
}) {
  const fields: ProfileInputProps[] = FIELDS.map(({ name, ...props }) => {
    const errorMessage = errors && errors[name]?.message;
    const defaultValue = errorMessage
      ? (errors && errors[name]?.value) ?? (values && values[name]) ?? undefined
      : (values && values[name]) ?? undefined;
    return {
      disabled,
      name,
      id: name,
      errorMessage,
      ...(typeof defaultValue == 'boolean'
        ? { defaultChecked: defaultValue, value: 'true' }
        : { defaultValue }),
      ...props,
      ...(options && options[name] ? { options: options[name] } : undefined),
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
  const errors: Record<string, unknown> = {};
  const issues = Object.fromEntries(
    error.issues.map(({ message, path }) => [path[0], message])
  );
  for (const [name, value] of formData) {
    errors[name] = { value: String(value), message: issues[name] };
  }
  return errors as Errors;
}
