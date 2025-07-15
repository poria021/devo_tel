import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Logger } from "@nestjs/common";
import { CronJob } from "cron";
import { JobFetchService } from "../Services/JobFetch.service";
import { CornServices } from "./CronTasksService";
import { JobsQueueProducer } from "../Queue-processor/queue.producer";

describe("CornServices", () => {
  let service: CornServices;
  let jobFetchService: JobFetchService;
  let configService: ConfigService;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CornServices,
        {
          provide: JobFetchService,
          useValue: {
            fetchAllJobs: jest.fn().mockResolvedValue([
              {
                id: "123",
                title: "Job A",
                company: "Comp A",
                location: "Loc A",
                salary: "$50k - $60k",
                skills: [],
                postedDate: new Date().toISOString(),
                source: "provider1",
              },
            ]),
          },
        },
        {
          provide: JobsQueueProducer,
          useValue: {
            addJobs: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === "CRON_SCHEDULE") return "*/1 * * * * *";
              return null;
            }),
          },
        },
        {
          provide: SchedulerRegistry,
          useValue: {
            addCronJob: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CornServices>(CornServices);
    jobFetchService = module.get<JobFetchService>(JobFetchService);
    configService = module.get<ConfigService>(ConfigService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should register cron job with config value", () => {
    const cronTime = configService.get("CRON_SCHEDULE");
    expect(configService.get).toHaveBeenCalledWith("CRON_SCHEDULE");
    expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
      "api-job",
      expect.any(CronJob)
    );
  });

  it("should fetch and log jobs when cron runs", async () => {
    const spy = jest.spyOn(jobFetchService, "fetchAllJobs");
    await service.handlejobs();
    expect(spy).toHaveBeenCalled();
  });

  it("should handle fetch errors gracefully", async () => {
    jest
      .spyOn(jobFetchService, "fetchAllJobs")
      .mockRejectedValueOnce(new Error("Network Error"));

    const loggerErrorSpy = jest
      .spyOn(Logger.prototype, "error")
      .mockImplementation(() => {});

    await service.handlejobs();

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      "error in Calling Api And @Cron  : ",
      expect.any(Error)
    );
  });
});
