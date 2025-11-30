import { Injectable, signal, WritableSignal } from '@angular/core';
import { GeoRepositoryInterface } from '../domain/interfaces/geo.repository.interface';
import { RegionModel } from '../domain/models/region.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { DepartmentModel } from '../domain/models/department.model';
import { MunicipalityModel } from '../domain/models/municipality.model';
import { DepartmentDto, MunicipalityDto, RegionDto } from '../domain/dtos/geo-api.dto';

@Injectable({
  providedIn: 'root'
})
export class GeoApiService implements GeoRepositoryInterface {
  readonly #baseUrl: string = 'https://geo.api.gouv.fr';
  readonly #regionsCache: WritableSignal<RegionModel[]> = signal<RegionModel[]>([]);

  constructor(private http: HttpClient) {}

  searchRegions(query: string): Observable<RegionModel[]> {
    const normalizedQuery: string = query.toLowerCase().trim();

    if (this.#regionsCache().length > 0) {
      const filteredRegions = this.#regionsCache().filter(region => region.name.toLowerCase().includes(normalizedQuery));
      return of(filteredRegions);
    }

    return this.http.get<RegionDto[]>(`${this.#baseUrl}/regions`).pipe(
      map((dtos: RegionDto[]) => dtos.map((dto: RegionDto) => ({ code: dto.code, name: dto.nom }))),
      tap(regions => this.#regionsCache.set(regions)),
      map(regions => regions.filter(region =>
        region.name.toLowerCase().includes(normalizedQuery)
      ))
    );
  }

  getDepartmentsByRegion(regionCode: string): Observable<DepartmentModel[]> {
    return this.http.get<DepartmentDto[]>(`${this.#baseUrl}/regions/${regionCode}/departements`).pipe(
      map((dtos: DepartmentDto[]) => dtos.map((dto: DepartmentDto) => ({
        code: dto.code,
        name: dto.nom,
        regionCode: dto.codeRegion
      })))
    );
  }


  getMunicipalitiesByDepartment(departmentCode: string): Observable<MunicipalityModel[]> {
    return this.http.get<MunicipalityDto[]>(`${this.#baseUrl}/departements/${departmentCode}/communes`).pipe(
      map((dtos: MunicipalityDto[]) => dtos.map((dto: MunicipalityDto) => ({
        code: dto.code,
        name: dto.nom,
        departmentCode: dto.codeDepartement,
        population: dto.population,
        postalCodes: dto.codesPostaux
      })))
    );
  }
}