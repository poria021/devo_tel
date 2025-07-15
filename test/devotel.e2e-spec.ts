import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JobEntity } from "../src/devotel/Entity/Job.entity";
import { Repository } from "typeorm";

describe("JobOffersController (e2e)", () => {
  let app: INestApplication;
  let jobRepo: Repository<JobEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jobRepo = moduleFixture.get<Repository<JobEntity>>(
      getRepositoryToken(JobEntity)
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/api/job-offers (GET)", () => {
    beforeEach(async () => {
      // Clean and seed database for predictable tests
      await jobRepo.clear();
      await jobRepo.save([
        jobRepo.create({
          id: "job-640",
          status: "active",
          title: "Backend Engineer",
          company: "DataWorks",
          location: "San Francisco, TX",
          salaryMin: 59000,
          salaryMax: 116000,
          skills: ["Java", "Spring Boot", "AWS"],
          postedDate: "2025-07-08T00:00:00.000Z",
          source: "provider2",
        }),
        jobRepo.create({
          id: "job-636",
          status: "active",
          title: "Backend Engineer",
          company: "Creative Design Ltd",
          location: "Austin, WA",
          salaryMin: 62000,
          salaryMax: 94000,
          skills: ["JavaScript", "Node.js", "React"],
          postedDate: "2025-07-07T00:00:00.000Z",
          source: "provider2",
        }),
      ]);
    });

    it("should return paginated job offers", async () => {
      const response = await request(app.getHttpServer())
        .get("/devotel/api/job-offers")
        .expect(200);

      expect(response.body).toHaveProperty("items");
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty("meta");
    });

    it("should filter job offers by title", async () => {
      const response = await request(app.getHttpServer())
        .get("/devotel/api/job-offers")
        .query({ title: "Backend Engineer" })
        .expect(200);

      expect(response.body.items).toHaveLength(2);
      expect(response.body.items[0].title).toBe("Backend Engineer");
    });

    it("should filter job return 400 Error", async () => {
      const response = await request(app.getHttpServer())
        .get("/devotel/api/job-offers")
        .query({ salaryMin: "Wrong 1000K" })
        .expect(400);

      expect(response.body).toHaveProperty("message");
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message).toContain(
        "salaryMin must be a number conforming to the specified constraints"
      );
    });

    it("should filter job offers by location and salaryMin", async () => {
      const response = await request(app.getHttpServer())
        .get("/devotel/api/job-offers")
        .query({ location: "Paris", salaryMin: 40000 })
        .expect(200);

      expect(response.body.items).toHaveLength(0);
    });

    it("should respect pagination", async () => {
      const response = await request(app.getHttpServer())
        .get("/devotel/api/job-offers")
        .query({ page: 1, limit: 1 })
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.meta).toHaveProperty("totalItems");
    });
  });
});
