import type { MetaFunction, LoaderFunction } from 'remix';
import { Link, useLoaderData } from 'remix';
import { SkipNavContent } from '@reach/skip-nav';

import { authenticator } from '~/util/auth.server';
import { Nav } from '~/components/nav';
import { buttonClassName } from '~/components/form';

export const meta: MetaFunction = () => ({ title: 'Super Form' });

type LoaderData = { isAuthenticated: boolean };

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await authenticator.isAuthenticated(request);

  return { isAuthenticated: !!user };
};

export default function IndexRoute() {
  const { isAuthenticated } = useLoaderData<LoaderData>();

  return (
    <div>
      <Nav isAuthenticated={isAuthenticated} />

      <SkipNavContent />

      {isAuthenticated ? (
        <Link
          to="profile"
          className={buttonClassName({ primary: true, size: 'lg' })}
        >
          Profile
        </Link>
      ) : (
        <p className="text-sm text-gray-800">To continue please sign in!</p>
      )}
    </div>
  );
}
