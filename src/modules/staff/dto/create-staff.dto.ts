// src/modules/staff/dto/create-staff.dto.ts
export interface CreateStaffDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title?: string;
  academicRank?: string;
  departmentId?: number;
  officeLocation?: string;
  phone?: string;
}