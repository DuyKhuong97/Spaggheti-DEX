
import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'ch5ei8m2',
  dataset: 'user-address',
  token: 'skFFY61NsawDdHRSgkUOvnmz1PRRwSFzUY76Eyl6g5ZWqfLcOZNTsrs08DYXq7mbINrA3QSCHIhNyPDxlNfScaS0qSyqVl2pV3zHNP3RrnSo9tvq7zRn2w4Jkp7yzBhvGrFBZq3UOkBRfaFZxhQghexAK7WVCJS5D7XibqKwgHYBX5ItB5CH',
  useCdn: false,
});