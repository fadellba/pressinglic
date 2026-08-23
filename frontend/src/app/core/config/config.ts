import { environment } from '../../../environments/environment';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG: AppConfig = {
  apiUrl: environment.apiUrl,
};