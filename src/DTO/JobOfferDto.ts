import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Index } from "typeorm";

@Index("idx_jobs_title_location_salary", [
  "title",
  "location",
  "salaryMin",
  "salaryMax",
]) //  add index for improve query performance,
export class JobOfferDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salaryMin: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salaryMax: number;

  @IsOptional()
  @IsString()
  id: string;
}
