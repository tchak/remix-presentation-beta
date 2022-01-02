import Level from 'level-ts';
import { z } from 'zod';

export const Profile = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  vaccinated: z
    .string()
    .optional()
    .transform((checked) => checked == 'true'),
  country: z.string().min(2),
});
export type Profile = z.infer<typeof Profile>;

const db = new Level<Profile | null>('./db/profiles');

export const parse = (formData: FormData) =>
  Profile.safeParse(Object.fromEntries(formData));

export async function findOrCreate(email: string) {
  await db.get(email).catch(() => db.put(email, null));
  return { email };
}

export async function upsert(email: string, profile: Profile) {
  await db.put(email, profile);
}

export function get(email: string): Promise<Profile | null> {
  return db.get(email).catch(() => null);
}

export async function del(email: string) {
  db.del(email);
}
