import type { MetaFunction } from 'remix';
import { NavLink, Outlet } from 'remix';
import { SkipNavContent } from '@reach/skip-nav';

import { buttonClassName } from '~/components/form';
import { Nav } from '~/components/nav';

export const meta: MetaFunction = () => ({ title: 'Super Form | Profile' });

export default function ProfileRoute() {
  return (
    <div>
      <Nav isAuthenticated={true}>
        <NavLink
          className={({ isActive }) =>
            buttonClassName({ size: 'sm', isActive })
          }
          to="html"
        >
          HTML Form
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            buttonClassName({ size: 'sm', isActive })
          }
          to="hydrated"
        >
          Remix Form
        </NavLink>
      </Nav>

      <SkipNavContent />

      <Outlet />
    </div>
  );
}
