import {Pinia, Store} from 'pinia-class-component';
import {
  AuthApi,
  createConfiguration,
  HttpMethod,
  CardsApi,
  RequestContext,
  UsersApi,
  UserCardsApi,
} from 'pokecards-oas';

@Store({
  id: 'ApiStore',
  name: 'ApiStore',
})
export class ApiStore extends Pinia {
  private readonly _config = createConfiguration({
    baseServer: {
      makeRequestContext(endpoint: string, httpMethod: HttpMethod): RequestContext {
        return new RequestContext(endpoint, httpMethod);
      },
    },
  });

  //api
  private readonly _authApi = new AuthApi(this._config);
  private readonly _cardApi = new CardsApi(this._config);
  private readonly _userCardApi = new UserCardsApi(this._config);
  private readonly _userApi = new UsersApi(this._config);

  get authApi(): AuthApi {
    return this._authApi;
  }

  get cardApi(): LabelsApi {
    return this._cardApi;
  }

  get userApi(): UsersApi {
    return this._userApi;
  }

  get userCardApi(): UserCardsApi {
    return this._userCardApi;
  }
}