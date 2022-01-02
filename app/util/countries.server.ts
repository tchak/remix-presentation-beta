import { getNames, LocalizedCountryNames } from 'i18n-iso-countries';

export type CountryNames = {
  countries: LocalizedCountryNames<{ select: 'official' }>;
};

export function getCountries(): CountryNames['countries'] {
  return getNames('en');
}
