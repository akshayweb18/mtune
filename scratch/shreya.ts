import { saavnApi } from '../src/services/api';

async function getShreya() {
  const data = await saavnApi.searchArtists('Shreya Ghoshal', 1, 1);
  console.log(JSON.stringify(data.results[0], null, 2));
}

getShreya();
