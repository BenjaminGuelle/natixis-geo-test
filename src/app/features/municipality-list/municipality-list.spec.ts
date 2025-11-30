import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { MunicipalityList } from './municipality-list';
import { MunicipalityDto, DepartmentDto } from '../../core/domain/dtos/geo-api.dto';

describe('MunicipalityList', () => {
  let component: MunicipalityList;
  let fixture: ComponentFixture<MunicipalityList>;
  let httpMock: HttpTestingController;

  const mockDepartment: DepartmentDto = {
    code: '14',
    nom: 'Calvados',
    codeRegion: '28'
  };

  const mockMunicipalities: MunicipalityDto[] = [
    { code: '14001', nom: 'Ablon', codeDepartement: '14', population: 1177 },
    { code: '14003', nom: 'Caen', codeDepartement: '14', population: 105000 },
    { code: '14005', nom: 'Cabourg', codeDepartement: '14', population: 3700 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MunicipalityList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ code: '14' }))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MunicipalityList);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const deptReq: TestRequest = httpMock.expectOne('https://geo.api.gouv.fr/departements/14');
    deptReq.flush(mockDepartment);

    const municipalitiesReq: TestRequest = httpMock.expectOne('https://geo.api.gouv.fr/departements/14/communes');
    municipalitiesReq.flush(mockMunicipalities);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load department name', () => {
    expect(component.department()?.name).toBe('Calvados');
  });

  it('should load municipalities from API', () => {
    expect(component.municipalities().length).toBe(3);
  });

  it('should calculate total population', () => {
    expect(component.totalPopulation()).toBe(109877);
  });

  it('should filter municipalities by name', () => {
    component.filterQuery.set('cab');

    expect(component.municipalities().length).toBe(1);
    expect(component.municipalities()[0].name).toBe('Cabourg');
  });

  it('should be case insensitive', () => {
    component.filterQuery.set('CAEN');

    expect(component.municipalities().length).toBe(1);
    expect(component.municipalities()[0].name).toBe('Caen');
  });

  it('should return all when filter is empty', () => {
    component.filterQuery.set('');

    expect(component.municipalities().length).toBe(3);
  });

  it('should sort by name ascending', () => {
    component.toggleSort('name');

    expect(component.municipalities()[0].name).toBe('Ablon');
    expect(component.municipalities()[2].name).toBe('Caen');
  });

  it('should sort by population descending', () => {
    component.toggleSort('population');
    component.toggleSort('population');

    expect(component.municipalities()[0].name).toBe('Caen');
    expect(component.municipalities()[2].name).toBe('Ablon');
  });
});