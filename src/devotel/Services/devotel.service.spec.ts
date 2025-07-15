import { Test, TestingModule } from "@nestjs/testing";
import { DevotelService } from "./devotel.service";

describe("DevotelService", () => {
  let service: DevotelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevotelService],
    }).compile();

    service = module.get<DevotelService>(DevotelService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
