import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, 'data');

const prisma = new PrismaClient();

type ListItem = {
  id: number;
  title: string;
  company: string;
  badgeLetters: string;
  daysAgo: number;
  relevanceScore: number;
  date: string;
  seniority: string;
  tags: string[];
  remote: boolean;
};

type DetailFile = {
  public: boolean;
  jobItem: ListItem & {
    description: string;
    qualifications: string[];
    reviews: string[];
    duration: string;
    salary: string;
    location: string;
    coverImgURL: string;
    companyURL: string;
  };
};

async function main() {
  const listPath = path.join(DATA_DIR, 'jobs.json');
  const detailsDir = path.join(DATA_DIR, 'job-details');

  const list = JSON.parse(fs.readFileSync(listPath, 'utf-8')) as {
    jobItems: ListItem[];
  };

  console.log(`Seeding ${list.jobItems.length} jobs...`);
  await prisma.jobItem.deleteMany();

  for (const item of list.jobItems) {
    const detailPath = path.join(detailsDir, `${item.id}.json`);
    const detail = (JSON.parse(fs.readFileSync(detailPath, 'utf-8')) as DetailFile)
      .jobItem;

    await prisma.jobItem.create({
      data: {
        id: String(item.id),
        title: detail.title,
        company: detail.company,
        badgeLetters: detail.badgeLetters,
        daysAgo: detail.daysAgo,
        relevanceScore: detail.relevanceScore,
        date: item.date,
        seniority: item.seniority,
        tags: JSON.stringify(item.tags),
        remote: item.remote,
        description: detail.description,
        qualifications: JSON.stringify(detail.qualifications),
        reviews: JSON.stringify(detail.reviews),
        duration: detail.duration,
        salary: detail.salary,
        location: detail.location,
        coverImgURL: detail.coverImgURL,
        companyURL: detail.companyURL,
      },
    });
  }

  const count = await prisma.jobItem.count();
  console.log(`Done. ${count} jobs in DB.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
