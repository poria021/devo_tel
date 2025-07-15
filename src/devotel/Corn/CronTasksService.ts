import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { Cache } from "cache-manager";
import { DevotelService } from "../Services/devotel.service";
import { JobsQueueProducer } from "../Queue-processor/queue.producer";
import { log } from "console";
import { ConfigService } from "@nestjs/config";
import { CronJob } from "cron";
import { JobFetchService } from "../Services/JobFetch.service";

@Injectable()
export class CornServices {
  constructor(
    private queue: JobsQueueProducer,
    private config: ConfigService, // let cronExpression:number=3
    private readonly schedulerRegistry: SchedulerRegistry,
    private jobFetchService: JobFetchService
  ) {
    const time = this.config.get<string>("CRON_SCHEDULE") || "*/20 * * * * *";
    const job = new CronJob(time, () => {
      this.handleHotelComments();
    });

    this.schedulerRegistry.addCronJob("hotel-comments-job", job);
    job.start();

    this.logger.log(`Hotel comments cron job started with expression: ${time}`);
  }

  private readonly logger = new Logger(ConfigService.name);

  async handleHotelComments() {
    try {
      let jobs = await this.jobFetchService.fetchAllJobs();
      if (jobs.length > 0) await this.queue.addJobs(jobs);
      this.logger.debug("Called @Cron every 1Minute ", jobs.length);
    } catch (error) {
      //we can log all error in ELK or something else
      this.logger.error("error in Calling Api And @Cron  : ", error);
    }
  }
}
