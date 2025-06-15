let _pokemonTcgIoApiKey: string | undefined = undefined;

export function setApiKey(apiKey: string | undefined): void {
  _pokemonTcgIoApiKey = apiKey;
}

export function getApiKey(): string | undefined {
  return _pokemonTcgIoApiKey;
}

export function getHeaders(): HeadersInit {
  const headers = {} as any;
  if (getApiKey()) {
    headers['X-Api-Key'] = getApiKey();
  }
  return headers;
}