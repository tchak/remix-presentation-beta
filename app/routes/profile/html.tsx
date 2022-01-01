import type { LoaderFunction, ActionFunction } from 'remix';
import { useLoaderData, json } from 'remix';
import { redirectBack } from 'remix-utils';

import { authenticator } from '~/util/auth.server';
import { commitSession, getSession } from '~/util/session.server';
import * as Profile from '~/util/db.server';
import { Button } from '~/components/form';
import {
  ProfileInfo,
  ProfileFields,
  getErrors,
  ProfileData as LoaderData,
} from '~/components/profile';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const data = await Profile.get(user.email);
  const session = await getSession(request.headers.get('cookie'));
  const errors: LoaderData['errors'] = session.get('errors');

  return json(
    { data, errors },
    { headers: { 'set-cookie': await commitSession(session) } }
  );
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/signin',
  });

  const form = await request.formData();
  const profile = Profile.parse(form);

  if (profile.success) {
    await Profile.upsert(user.email, profile.data);

    return redirectBack(request, { fallback: '/profile/html' });
  }

  const session = await getSession(request.headers.get('cookie'));
  session.flash('errors', getErrors(profile.error, form));

  return redirectBack(request, {
    fallback: '/profile/html',
    headers: { 'set-cookie': await commitSession(session) },
  });
};

export default function ProfileHTMLFormRoute() {
  const { data, errors } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      {data ? <ProfileInfo profile={data} /> : null}

      <form
        method="post"
        noValidate
        className="space-y-6"
        aria-labelledby="html-form"
      >
        <ProfileFields
          id="html-form"
          legend="HTML Form"
          values={data}
          errors={errors}
        />

        <div className="flex items-center justify-end">
          <Button type="submit" primary>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
