import { Observable } from 'rxjs';
import { RegionModel } from '../models/region.model';
import { DepartmentModel } from '../models/department.model';
import { MunicipalityModel } from '../models/municipality.model';

export interface GeoRepositoryInterface {
  searchRegions(query: string): Observable<RegionModel[]>;
  getDepartmentsByRegion(regionCode: string): Observable<DepartmentModel[]>;
  getMunicipalitiesByDepartment(departmentCode: string): Observable<MunicipalityModel[]>;
}