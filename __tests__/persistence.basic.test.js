const path = require('path');
process.env.DATABASE_URL = "file:./consciousness-test.db";
const { PrismaClient } = require('@prisma/client');
const { saveReality } = require(
  path.join(__dirname, '../server/consciousness/utils/persistence.js')
);

const prisma = new PrismaClient();

describe('Persistence (basic)', () => {
  const sample = {
    id: 'test-reality-1',
    description: "Persistence test reality",
    parameters: { foo: "bar" },
    recursionDepth: 0,
    parentId: null,
    createdAt: new Date(),
    schemaVersion: 1
  };

  afterAll(async () => {
    await prisma.reality.deleteMany({ where: { id: sample.id } });
    await prisma.$disconnect();
  });

  test('saveReality can persist and retrieve', async () => {
    await saveReality(sample);
    const fetched = await prisma.reality.findUnique({ where: { id: sample.id } });
    expect(fetched).toBeTruthy();
    expect(fetched.id).toBe(sample.id);
    expect(fetched.description).toBe(sample.description);
    expect(fetched.parameters.foo).toBe("bar");
    expect(fetched.schemaVersion).toBe(1);
  });
});