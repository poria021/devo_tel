// job-fetch.service.ts
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { ProviderOneAdapter } from "../utility/ProviderOneAdapter";
import { ProvidertwoAdapter } from "../utility/ProviderTwoAdapter";
import { UnifiedJobDto } from "src/DTO/UnifiedJobDto";
import { ConfigService } from "@nestjs/config";
import { getFromServe } from "../utility/httpRequest";
import { log } from "console";

@Injectable()
export class JobFetchService {
  private readonly logger = new Logger(JobFetchService.name);

  constructor(
    private readonly http: HttpService,
    private config: ConfigService
  ) {}

  async fetchAllJobs(): Promise<UnifiedJobDto[]> {
    const [data1, data2] = await Promise.all([
      getFromServe(this.config.get<string>("ApiOne"), {}, this.http, 60000),
      getFromServe(this.config.get<string>("ApiTwo"), {}, this.http, 60000),
    ]);

    const jobs1 = ProviderOneAdapter.transform(data1);
    const jobs2 = ProvidertwoAdapter.transform(data2);
    const allJobs = [...jobs1, ...jobs2];
    return this.removeDuplicates(allJobs);
  }

  private removeDuplicates(jobs: UnifiedJobDto[]): UnifiedJobDto[] {
    const seen = new Set();
    return jobs.filter((job) => {
      const key = `${job.title}-${job.company}-${job.location}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
