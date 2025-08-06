const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function saveReality(reality) {
  await prisma.reality.upsert({
    where: { id: reality.id },
    update: { ...reality },
    create: { ...reality }
  });
}

async function savePath(path) {
  await prisma.recursionPath.upsert({ where: { id: path.id }, update: { ...path }, create: { ...path } });
}

async function saveField(field) {
  await prisma.consciousnessField.upsert({ where: { id: field.id }, update: { ...field }, create: { ...field } });
}

async function incrementMetric(key, delta = 1) {
  await prisma.metric.upsert({
    where: { key },
    update: { value: { increment: delta } },
    create: { key, value: delta }
  });
}

async function shutdown() { await prisma.$disconnect(); }

module.exports = {
  saveReality,
  savePath,
  saveField,
  incrementMetric,
  shutdown,
};