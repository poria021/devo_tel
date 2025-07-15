// // cron.service.spec.ts

// import { Test, TestingModule } from "@nestjs/testing";
// import { CronService } from "./cron.service";

// import { JobService } from "../jobs/job.service";
// import { ConfigService } from "@nestjs/config";
// import { Logger } from "@nestjs/common";
// import { ProviderOneAdapter } from "../utility/ProviderOneAdapter";
// import { ProvidertwoAdapter } from "../utility/ProviderTwoAdapter";

// describe("CronService", () => {
//   let service: CronService;
//   let provider1: ProviderOneAdapter;
//   let provider2: ProvidertwoAdapter;
//   let jobService: JobService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         CronService,
//         {
//           provide: ProviderOneAdapter,
//           useValue: { fetchAndTransformJobs: jest.fn() },
//         },
//         {
//           provide: ProvidertwoAdapter,
//           useValue: { fetchAndTransformJobs: jest.fn() },
//         },
//         {
//           provide: JobService,
//           useValue: { upsertMany: jest.fn() },
//         },
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn().mockReturnValue("* * * * *"), // test cron
//           },
//         },
//         {
//           provide: Logger,
//           useValue: { log: jest.fn(), error: jest.fn() },
//         },
//       ],
//     }).compile();

//     service = module.get<CronService>(CronService);
//     provider1 = module.get<ProviderOneAdapter>(ProviderOneAdapter);
//     provider2 = module.get<PictureInPictureWindow>(PictureInPictureWindow);
//     jobService = module.get<JobService>(JobService);
//   });

//   it("should call both API providers and save the unified jobs", async () => {
//     const mockJobs1 = [
//       {
//         id: "P1-123",
//         title: "Frontend Dev",
//         company: "DataWorks",
//         location: "Seattle",
//         salary: "$60k - $90k",
//         skills: ["React"],
//         postedDate: new Date(),
//         source: "provider1",
//       },
//     ];
//     const mockJobs2 = [
//       {
//         id: "job-77",
//         title: "Backend Dev",
//         company: "TechCorp",
//         location: "Austin",
//         salary: "$70k - $95k",
//         skills: ["Node.js"],
//         postedDate: new Date(),
//         source: "provider2",
//       },
//     ];

//     jest.spyOn(provider1, "fetchAndTransformJobs").mockResolvedValue(mockJobs1);
//     jest.spyOn(provider2, "fetchAndTransformJobs").mockResolvedValue(mockJobs2);
//     const upsertSpy = jest
//       .spyOn(jobService, "upsertMany")
//       .mockResolvedValue(undefined);

//     await service.handleCron();

//     expect(provider1).toHaveBeenCalled();
//     expect(provider2.fetchAndTransformJobs).toHaveBeenCalled();
//     expect(upsertSpy).toHaveBeenCalledWith([...mockJobs1, ...mockJobs2]);
//   });

//   it("should log error if an exception occurs", async () => {
//     jest
//       .spyOn(provider1, "fetchAndTransformJobs")
//       .mockRejectedValue(new Error("API1 failed"));
//     jest.spyOn(provider2, "fetchAndTransformJobs").mockResolvedValue([]);
//     const errorSpy = jest.spyOn(Logger.prototype, "error").mockImplementation();

//     await service.handleCron();

//     expect(errorSpy).toHaveBeenCalledWith(
//       "Scheduled job failed",
//       expect.any(Error)
//     );
//   });
// });

import { Test, TestingModule } from "@nestjs/testing";
// import { CornServices } from "./corn.service";
// import { JobFetchService } from "./job-fetch.service";
// import { JobsQueueProducer } from "../queue/jobs.queue.producer";
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
      "hotel-comments-job",
      expect.any(CronJob)
    );
  });

  it("should fetch and log jobs when cron runs", async () => {
    const spy = jest.spyOn(jobFetchService, "fetchAllJobs");
    await service.handleHotelComments();
    expect(spy).toHaveBeenCalled();
  });

  //   it("should handle fetch errors gracefully", async () => {
  //     const errorService = module.get<JobFetchService>(JobFetchService);
  //     jest
  //       .spyOn(errorService, "fetchAllJobs")
  //       .mockRejectedValueOnce(new Error("Network Error"));

  //     const loggerErrorSpy = jest
  //       .spyOn(Logger.prototype, "error")
  //       .mockImplementation(() => {});

  //     await service.handleHotelComments();

  //     expect(loggerErrorSpy).toHaveBeenCalledWith(
  //       "error in  @Cron  : ",
  //       expect.any(Error)
  //     );
  //   });
});
