import type { ActionFunction } from 'remix';
import { Form, useLoaderData, useActionData, useTransition, json } from 'remix';

import { authenticator } from '~/util/auth.server';
import { Button } from '~/components/form';
import * as Profile from '~/util/db.server';
import type { CountryNames } from '~/util/countries.server';
import {
  ProfileInfo,
  ProfileFields,
  getErrors,
  ProfileData as LoaderData,
} from '~/components/profile';

type ActionData = Pick<LoaderData, 'errors'>;

export const handle = { hydrate: true };
export { loader } from './html';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/signin',
  });

  const form = await request.formData();
  const profile = Profile.parse(form);

  if (profile.success) {
    await Profile.upsert(user.email, profile.data);

    return json({ data: profile.data });
  } else {
    return { errors: getErrors(profile.error, form) };
  }
};

export default function ProfileHydratedFormRoute() {
  const transition = useTransition();
  const { data, countries } = useLoaderData<LoaderData & CountryNames>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="space-y-6">
      {data ? (
        <ProfileInfo profile={data} form={transition.submission?.formData} />
      ) : null}

      <Form
        method="post"
        replace
        noValidate
        className="space-y-6"
        aria-labelledby="hydrated-form"
      >
        <ProfileFields
          id="hydrated-form"
          legend="Remix Form"
          values={data}
          errors={transition.type == 'idle' ? actionData?.errors : undefined}
          disabled={transition.state == 'submitting'}
          options={{
            country: Object.entries(countries).map(([value, label]) => ({
              label,
              value,
            })),
          }}
        />

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            disabled={transition.state == 'submitting'}
            primary
          >
            {transition.state == 'submitting' ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="hidden motion-safe:block animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
