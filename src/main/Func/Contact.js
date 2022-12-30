import openUrl from 'openurl';

export default async ({ global, TYPE }) => {
  if (typeof global.contacts[TYPE] == 'string') {
    const ENDPOINT = global.contacts[TYPE];
    console.log(ENDPOINT);
    return openUrl.open(ENDPOINT);
  }
};
