import { prisma } from "db/client";

async function verifyDatabaseData() {
  console.log("==================================================");
  console.log("🔍 Direct Database Verification (Prisma ORM)...");
  console.log("==================================================\n");

  const usersCount = await prisma.user.count();
  const orgsCount = await prisma.organization.count();
  const boardsCount = await prisma.board.count();
  const sectionsCount = await prisma.section.count();
  const issuesCount = await prisma.issue.count();
  const assigneesCount = await prisma.issueAssignee.count();
  const commentsCount = await prisma.comment.count();

  console.log(`📊 Database Table Record Counts:`);
  console.log(` - Users:              ${usersCount}`);
  console.log(` - Organizations:      ${orgsCount}`);
  console.log(` - Boards:             ${boardsCount}`);
  console.log(` - Sections:           ${sectionsCount}`);
  console.log(` - Issues:             ${issuesCount}`);
  console.log(` - Issue Assignees:    ${assigneesCount}`);
  console.log(` - Comments:           ${commentsCount}\n`);

  const latestUsers = await prisma.user.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  console.log("👤 Sample Registered Users in Database:");
  console.table(latestUsers);

  console.log("\n==================================================");
  console.log("✅ DATABASE CONNECTION & QUERIES WORKING PROPERLY!");
  console.log("==================================================");
}

verifyDatabaseData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ DB Query Error:", err);
    process.exit(1);
  });
