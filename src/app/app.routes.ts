import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    loadComponent: () => import('./features/region-search/region-search')
      .then(c => c.RegionSearch)
  },
  {
    path: 'departments/:code/municipalities',
    loadComponent: () => import('./features/municipality-list/municipality-list')
      .then(c => c.MunicipalityList)
  }
];
