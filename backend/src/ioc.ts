import {Container, Scope} from 'typescript-ioc';
import {IocContainer} from '@tsoa/runtime';
import {ConfigProvider} from './config/confighelper';

const iocContainer: () => IocContainer = () => Container;
Container.bind(ConfigProvider).to(ConfigProvider).scope(Scope.Singleton);

export {iocContainer};