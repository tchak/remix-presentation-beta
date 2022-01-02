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
      {data ? <ProfileInfo profile={data} /> : null}

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
          errors={actionData?.errors}
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
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
