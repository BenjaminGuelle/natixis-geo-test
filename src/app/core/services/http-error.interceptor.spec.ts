import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through successful requests', () => {
    http.get('/test').subscribe(response => {
      expect(response).toEqual({ data: 'ok' });
    });

    const req: TestRequest = httpMock.expectOne('/test');
    req.flush({ data: 'ok' });
  });

  it('should retry once on error then throw', () => {
    let errorCaught = false;

    http.get('/test').subscribe({
      error: () => {
        errorCaught = true;
      }
    });

    const req1: TestRequest = httpMock.expectOne('/test');
    req1.flush('Error', { status: 500, statusText: 'Server Error' });

    const req2: TestRequest = httpMock.expectOne('/test');
    req2.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(errorCaught).toBe(true);
  });

  it('should succeed on retry', () => {
    let response: any;

    http.get('/test').subscribe(res => {
      response = res;
    });

    const req1: TestRequest = httpMock.expectOne('/test');
    req1.flush('Error', { status: 500, statusText: 'Server Error' });

    const req2: TestRequest = httpMock.expectOne('/test');
    req2.flush({ data: 'ok' });

    expect(response).toEqual({ data: 'ok' });
  });
});