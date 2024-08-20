import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseProviders } from './database.providers';

describe('DatabaseProviders', () => {
  let provider: DatabaseProviders;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseProviders],
    }).compile();

    provider = module.get<DatabaseProviders>(DatabaseProviders);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
