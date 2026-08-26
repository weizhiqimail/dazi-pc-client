import { createHashRouter } from 'react-router-dom';
import { ROUTE_LIST } from './routes';

/** Hash 路由兼容 Electron 打包后的 file 协议。 */
export const ROUTER = createHashRouter(ROUTE_LIST);
