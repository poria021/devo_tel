import { Processor, WorkerHost } from "@nestjs/bullmq";
import { DevotelService } from "../Services/devotel.service";
import { log } from "console";
import { ClientProxy } from "@nestjs/microservices";
import { Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Processor("jobs_queue")
export class JobQueueProcessor extends WorkerHost {
  constructor(private devotelServices: DevotelService) {
    super();
  }
  private readonly logger = new Logger(ConfigService.name);
  async process(job: any): Promise<void> {
    switch (job.name) {
      case "generateJobs": {
        await this.devotelServices.saveJobs(job.data);
        this.logger.log(
          `Processing job  Done and insert ${job.data.length} items.`
        );
        break;
      }
    }
  }
}
