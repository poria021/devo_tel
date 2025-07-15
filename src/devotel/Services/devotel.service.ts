import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UnifiedJobDto } from "src/DTO/UnifiedJobDto";
import { JobEntity } from "../Entity/Job.entity";
import { Repository } from "typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { JobOfferDto } from "src/DTO/JobOfferDto";

@Injectable()
export class DevotelService {
  private readonly logger = new Logger(DevotelService.name);
  constructor(
    @InjectRepository(JobEntity) private jobRepo: Repository<JobEntity>
  ) {}

  async getAllJobs(
    options: IPaginationOptions,
    query: JobOfferDto
  ): Promise<Pagination<JobEntity>> {
    const queryBuilder = this.jobRepo.createQueryBuilder("jobs");
    if (query.id) queryBuilder.where("jobs.id = :params", { params: query.id });
    else queryBuilder.orderBy("jobs.id", "DESC");

    if (query.title)
      queryBuilder.andWhere("jobs.title ILIKE :title", {
        title: `%${query.title}%`,
      });

    if (query.location)
      queryBuilder.andWhere("jobs.location ILIKE :location", {
        location: `%${query.location}%`,
      });

    if (query.salaryMin)
      queryBuilder.andWhere("jobs.salaryMin >= :salaryMin", {
        salaryMin: query.salaryMin,
      });

    if (query.salaryMax)
      queryBuilder.andWhere("jobs.salaryMax <= :salaryMax", {
        salaryMax: query.salaryMax,
      });

    return paginate<JobEntity>(queryBuilder, options);
  }

  async saveJobs(jobs: UnifiedJobDto[]): Promise<JobEntity[]> {
    const allQuery: JobEntity[] = [];
    for (const job of jobs) {
      const exists = await this.jobRepo.findOne({ where: { id: job.id } });
      if (exists) {
        this.logger.debug(
          `Job ${job.id} -----------------------------> already exists. Skipping.`
        );
        continue;
      }

      const { salaryMin, salaryMax } = this.parseSalary(job.salary);
      const jobEntity = this.jobRepo.create({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salaryMin,
        salaryMax,
        skills: job.skills,
        postedDate: new Date(job.postedDate),
        source: job.source,
      });

      //We can either save each job individually or batch them into an array and
      // save them all at once, depending on our API design and the volume of data.
      allQuery.push(jobEntity);
    }
    return this.jobRepo.save(allQuery);
  }

  private parseSalary(salaryStr: string): {
    salaryMin: number;
    salaryMax: number;
  } {
    const regex = /\$?(\d+)(k)?\s*-\s*\$?(\d+)(k)?/i;
    const match = salaryStr.match(regex);
    if (!match) return { salaryMin: null, salaryMax: null };

    const min = parseInt(match[1], 10) * (match[2] === "k" ? 1000 : 1);
    const max = parseInt(match[3], 10) * (match[4] === "k" ? 1000 : 1);
    return { salaryMin: min, salaryMax: max };
  }
}
