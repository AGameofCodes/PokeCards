import type {Request as Req} from 'express';
import {ConfigProvider} from '../../../config/confighelper';
import {Controller, Get, Request, Route, SuccessResponse, Tags} from 'tsoa';
import {Inject} from 'typescript-ioc';

interface ConfigVmV1 {
  registerEnabled: boolean;
}

@Route('api/v1/config')
@Tags('config')
export class ConfigController extends Controller {
  private readonly config: ConfigProvider;

  constructor(@Inject config: ConfigProvider) {
    super();
    this.config = config;
  }

  @Get()
  @SuccessResponse(200, 'Ok')
  async getConfig(@Request() req: Req): Promise<ConfigVmV1> {
    return {
      registerEnabled: (await this.config.get()).server.features.auth.register,
    };
  }
}

