import { Link, NavLink } from 'remix';
import type { ReactNode } from 'react';

import { buttonClassName } from './form';

export function Nav({
  isAuthenticated,
  children,
}: {
  isAuthenticated?: boolean;
  children?: ReactNode;
}) {
  return (
    <nav className="py-6">
      <div className="flex items-center justify-between">
        <h1>
          <Link to="/">Super Form</Link>
        </h1>
        <div className="hidden md:flex flex-grow px-3 space-x-3">
          {children}
        </div>
        <div>
          {isAuthenticated ? (
            <Link
              to="/signout"
              className={buttonClassName({ primary: true, size: 'sm' })}
            >
              Sign Out
            </Link>
          ) : (
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                isActive
                  ? 'hidden'
                  : buttonClassName({ primary: true, size: 'sm' })
              }
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
      <div className="flex md:hidden space-x-3 mt-3">{children}</div>
    </nav>
  );
}
