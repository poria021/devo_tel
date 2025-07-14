import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { log } from "console";
import { UnifiedJobDto } from "src/DTO/UnifiedJobDto";

@Injectable()
export class JobsQueueProducer {
  constructor(@InjectQueue("jobs_queue") private readonly jobsQueue: Queue) {}

  async addJobs(jobs: UnifiedJobDto[]) {
    await this.jobsQueue.add("generateJobs", jobs, {
      // delay: 50, // 5 seconds delay
      attempts: 3, // Retry the job 3 times if it fails
      removeOnComplete: true,
    });
  }
}
