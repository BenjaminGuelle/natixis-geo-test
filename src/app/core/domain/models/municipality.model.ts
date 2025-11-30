export interface MunicipalityModel {
  code: string;
  name: string;
  departmentCode: string;
  population?: number;
  postalCodes?: string[];
}