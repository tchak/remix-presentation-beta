import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { z } from 'zod';

import { sessionStorage } from './session.server';
import * as Profile from './db.server';

export const User = z.object({
  email: z.string().refine((email) => EMAIL.test(email), 'Invalid email'),
});
export type User = z.infer<typeof User>;

export const authenticator = new Authenticator<User>(sessionStorage);

const EMAIL = /.*@.*/;

authenticator.use(
  new FormStrategy(({ form }) => {
    const user = User.safeParse(Object.fromEntries(form));

    if (user.success) {
      return Profile.findOrCreate(user.data.email);
    }
    throw new AuthorizationError(user.error.issues[0].message);
  }),
  'email'
);
