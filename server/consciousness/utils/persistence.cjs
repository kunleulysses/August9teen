import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function saveReality(reality) {
  await prisma.reality.upsert({
    where: { id: reality.id },
    update: { ...reality },
    create: { ...reality }
  });
}

export async function savePath(path) {
  await prisma.recursionPath.upsert({ where: { id: path.id }, update: { ...path }, create: { ...path } });
}

export async function saveField(field) {
  await prisma.consciousnessField.upsert({ where: { id: field.id }, update: { ...field }, create: { ...field } });
}

export async function incrementMetric(key, delta = 1) {
  await prisma.metric.upsert({
    where: { key },
    update: { value: { increment: delta } },
    create: { key, value: delta }
  });
}

export async function shutdown() { await prisma.$disconnect(); }