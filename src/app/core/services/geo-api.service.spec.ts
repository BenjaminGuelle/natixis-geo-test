import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { GeoApiService } from './geo-api.service';
import { DepartmentDto, RegionDto } from '../domain/dtos/geo-api.dto';

describe('GeoApiService', () => {
  let service: GeoApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        GeoApiService
      ]
    });
    service = TestBed.inject(GeoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should return filtered regions', () => {
    const mockRegions: RegionDto[]  = [
      { code: '44', nom: 'Grand Est' },
      { code: '75', nom: 'Nouvelle-Aquitaine' },
      { code: '28', nom: 'Normandie' }
    ];

    service.searchRegions('norm').subscribe(regions => {
      expect(regions.length).toBe(1);
      expect(regions[0].name).toBe('Normandie');
      expect(regions[0].code).toBe('28');
    });

    const req = httpMock.expectOne('https://geo.api.gouv.fr/regions');
    expect(req.request.method).toBe('GET');
    req.flush(mockRegions);
  });

  it('should use cache on second call', () => {
    const mockRegions: RegionDto[] = [
      { code: '44', nom: 'Grand Est' },
      { code: '28', nom: 'Normandie' }
    ];

    service.searchRegions('grand').subscribe(regions => {
      expect(regions.length).toBe(1);
      expect(regions[0].name).toBe('Grand Est');
    });

    const req = httpMock.expectOne('https://geo.api.gouv.fr/regions');
    req.flush(mockRegions);

    service.searchRegions('norm').subscribe(regions => {
      expect(regions.length).toBe(1);
      expect(regions[0].name).toBe('Normandie');
    });

    httpMock.expectNone('https://geo.api.gouv.fr/regions');
  });

  it('should map departments correctly', () => {
    const mockDepartments: DepartmentDto[] = [
      { code: '14', nom: 'Calvados', codeRegion: '28' },
      { code: '50', nom: 'Manche', codeRegion: '28' }
    ];

    service.getDepartmentsByRegion('28').subscribe(departments => {
      expect(departments.length).toBe(2);
      expect(departments[0].code).toBe('14');
      expect(departments[0].name).toBe('Calvados');
      expect(departments[0].regionCode).toBe('28');
    });

    const req: TestRequest = httpMock.expectOne('https://geo.api.gouv.fr/regions/28/departements');
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });
});