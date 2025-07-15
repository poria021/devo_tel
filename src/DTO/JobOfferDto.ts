import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

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

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") return JSON.parse(value);
    else return value;
  })
  @IsArray()
  skills: string[];
}
