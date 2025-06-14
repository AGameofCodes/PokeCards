export async function validateTcgDexNetApiResponse(res: Response): Promise<Response> {
  if (200 <= res.status && res.status < 300) {
    return res;
  } else {
    throw new Error('tcgdex.net api returned non-ok status code with body: ' + await res.text());
  }
}