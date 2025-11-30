import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RegionSearch } from './region-search';
import { RegionDto } from '../../core/domain/dtos/geo-api.dto';

describe('RegionSearch', () => {
  let component: RegionSearch;
  let fixture: ComponentFixture<RegionSearch>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionSearch],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegionSearch);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load suggestions when query changes', async () => {
    const mockRegions: RegionDto[] = [
      { code: '28', nom: 'Normandie' },
      { code: '75', nom: 'Nouvelle-Aquitaine' }
    ];

    component.searchControl.setValue('norm');

    await new Promise(resolve => setTimeout(resolve, 350));

    const req: TestRequest = httpMock.expectOne('https://geo.api.gouv.fr/regions');
    req.flush(mockRegions);

    expect(component.suggestions().length).toBe(1);
    expect(component.suggestions()[0].name).toBe('Normandie');
  });
});