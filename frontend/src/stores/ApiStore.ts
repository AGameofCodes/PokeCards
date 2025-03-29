import {Pinia, Store} from 'pinia-class-component';
import {
  AuthApi,
  CardsApi,
  createConfiguration,
  HttpMethod,
  LabelsApi,
  RequestContext, SetsApi,
  UserCardsApi,
  UsersApi,
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
  private readonly _labelApi = new LabelsApi(this._config);
  private readonly _setApi = new SetsApi(this._config);
  private readonly _userCardApi = new UserCardsApi(this._config);
  private readonly _userApi = new UsersApi(this._config);

  get authApi(): AuthApi {
    return this._authApi;
  }

  get cardApi(): CardsApi {
    return this._cardApi;
  }

  get labelApi(): LabelsApi {
    return this._labelApi;
  }

  get setApi(): SetsApi {
    return this._setApi;
  }

  get userApi(): UsersApi {
    return this._userApi;
  }

  get userCardApi(): UserCardsApi {
    return this._userCardApi;
  }
}