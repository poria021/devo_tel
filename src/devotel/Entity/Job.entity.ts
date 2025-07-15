// job.entity.ts
import { Entity, Column, PrimaryColumn, Index } from "typeorm";
import { Default } from "./default.entity";
@Index("idx_jobs_title_location_salary", [
  "title",
  "location",
  "salaryMin",
  "salaryMax",
]) //  add index for improve query performance,
@Entity("jobs")
export class JobEntity extends Default {
  @Column()
  title: string;

  // @Column()
  // api_id: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column({ type: "int", nullable: true })
  salaryMin: number;

  @Column({ type: "int", nullable: true })
  salaryMax: number;

  @Column("jsonb", { nullable: false, default: [] })
  skills: string[];

  @Column({ type: "timestamp" })
  postedDate: Date;

  @Column()
  source: string;
}
