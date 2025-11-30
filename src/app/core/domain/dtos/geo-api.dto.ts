export interface RegionDto {
  code: string;
  nom: string;
}

export interface DepartmentDto {
  code: string;
  nom: string;
  codeRegion: string;
}

export interface MunicipalityDto {
  code: string;
  nom: string;
  codeDepartement: string;
  population?: number;
  codesPostaux?: string[];
}