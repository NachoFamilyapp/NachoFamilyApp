export interface AppModules {
  map: boolean;
  vlag: boolean;
  speurtocht: boolean;
  morse: boolean;
  noodbericht: boolean;
}

export const DEFAULT_APP_MODULES: AppModules = {
  map: true,
  vlag: true,
  speurtocht: true,
  morse: true,
  noodbericht: true,
};
