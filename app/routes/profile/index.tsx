import type { LoaderFunction } from 'remix';
import { redirect } from 'remix';

import { authenticator } from '~/util/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, { failureRedirect: '/' });
  return redirect('/profile/html');
};
