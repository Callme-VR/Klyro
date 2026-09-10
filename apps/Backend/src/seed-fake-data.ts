import { prisma } from "db/client";

async function seedPersistentFakeData() {
  console.log("==================================================");
  console.log("🌱 Seeding Persistent Fake Data into Database...");
  console.log("==================================================\n");

  const timestamp = Date.now();

  // 1. Create Sample Users
  console.log("1️⃣ Creating Sample Users...");
  const user1 = await prisma.user.create({
    data: {
      email: `owner_${timestamp}@example.com`,
      passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$SampleHashUser1",
      name: "Alex Mercer (Owner)",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: `dev_${timestamp}@example.com`,
      passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$SampleHashUser2",
      name: "Sarah Connor (Developer)",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
  });
  console.log(`   ✅ Users created: ${user1.email}, ${user2.email}`);

  // 2. Create Organization & Members
  console.log("2️⃣ Creating Organization & Adding Members...");
  const org = await prisma.organization.create({
    data: {
      name: "Acme Engineering",
      slug: `acme-engineering-${timestamp}`,
      description: "Core Product & Backend Development Team",
      avatarUrl: "https://example.com/org-logo.png",
      members: {
        create: [
          { userId: user1.id, role: "OWNER" },
          { userId: user2.id, role: "MEMBER" },
        ],
      },
    },
  });
  console.log(`   ✅ Organization created: ${org.name} (ID: ${org.id})`);

  // 3. Create Boards
  console.log("3️⃣ Creating Board...");
  const board = await prisma.board.create({
    data: {
      title: "Sprint Planning Board",
      backgroundColor: "#0079BF",
      organizationId: org.id,
      creatorId: user1.id,
    },
  });
  console.log(`   ✅ Board created: ${board.title} (ID: ${board.id})`);

  // 4. Create Sections
  console.log("4️⃣ Creating Sections...");
  const todoSection = await prisma.section.create({
    data: {
      title: "To Do",
      order: 65536.0,
      boardId: board.id,
    },
  });

  const inProgressSection = await prisma.section.create({
    data: {
      title: "In Progress",
      order: 131072.0,
      boardId: board.id,
    },
  });

  const doneSection = await prisma.section.create({
    data: {
      title: "Done",
      order: 196608.0,
      boardId: board.id,
    },
  });
  console.log("   ✅ Sections created: 'To Do', 'In Progress', 'Done'");

  // 5. Create Issues
  console.log("5️⃣ Creating Issues...");
  const issue1 = await prisma.issue.create({
    data: {
      title: "Implement RESTful Issue Management Endpoints",
      description: "Add POST, GET, PATCH, DELETE for issues, assignees, and comments.",
      order: 65536.0,
      dueDate: new Date(Date.now() + 86400000 * 5),
      sectionId: inProgressSection.id,
    },
  });

  const issue2 = await prisma.issue.create({
    data: {
      title: "Setup Argon2id Password Hashing & JWT Auth",
      description: "Ensure secure signin and signup flows.",
      order: 65536.0,
      dueDate: new Date(Date.now() + 86400000 * 2),
      sectionId: doneSection.id,
    },
  });

  const issue3 = await prisma.issue.create({
    data: {
      title: "Configure WebSockets for Real-time Card Movement",
      description: "Broadcast section and issue position updates to all connected board users.",
      order: 65536.0,
      dueDate: new Date(Date.now() + 86400000 * 10),
      sectionId: todoSection.id,
    },
  });
  console.log("   ✅ Issues created in sections!");

  // 6. Add Assignees
  console.log("6️⃣ Adding Assignees to Issue...");
  await prisma.issueAssignee.createMany({
    data: [
      { issueId: issue1.id, userId: user1.id },
      { issueId: issue1.id, userId: user2.id },
      { issueId: issue2.id, userId: user1.id },
    ],
  });
  console.log("   ✅ Assignees assigned to issues!");

  // 7. Add Comments
  console.log("7️⃣ Adding Comments to Issue...");
  await prisma.comment.createMany({
    data: [
      {
        content: "API endpoints and validation schemas are completed.",
        issueId: issue1.id,
        userId: user1.id,
      },
      {
        content: "Verified all 32 endpoint test cases against the database!",
        issueId: issue1.id,
        userId: user2.id,
      },
    ],
  });
  console.log("   ✅ Comments posted on issue!");

  // 8. Report Final Database Row Counts
  console.log("\n==================================================");
  console.log("🎉 PERSISTENT SEED DATA SUCCESSFULLY CREATED IN DB!");
  console.log("==================================================");

  const counts = {
    users: await prisma.user.count(),
    organizations: await prisma.organization.count(),
    orgMembers: await prisma.organizationMember.count(),
    boards: await prisma.board.count(),
    sections: await prisma.section.count(),
    issues: await prisma.issue.count(),
    assignees: await prisma.issueAssignee.count(),
    comments: await prisma.comment.count(),
  };

  console.log("\n📊 Active Database Record Totals:");
  console.table(counts);
}

seedPersistentFakeData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  });
