import { Module } from "@nestjs/common";
import { DevotelService } from "./Services/devotel.service";
import { DevotelController } from "./devotel.controller";
import { BullModule } from "@nestjs/bullmq";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CornServices } from "./Corn/CronTasksService";
import { JobsQueueProducer } from "./Queue-processor/queue.producer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { JobFetchService } from "./Services/JobFetch.service";
import { JobEntity } from "./Entity/Job.entity";
import { JobQueueProcessor } from "./Queue-processor/queue.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "jobs_queue", // The name of the queue
    }),
    HttpModule,
    TypeOrmModule.forFeature([JobEntity]),
  ],
  providers: [
    DevotelService,
    CornServices,
    JobsQueueProducer,
    JobFetchService,
    JobQueueProcessor,
  ],
  controllers: [DevotelController],
})
export class DevotelModule {}
