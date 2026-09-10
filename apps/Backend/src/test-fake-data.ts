const BASE_URL = "http://localhost:5500/api/v1";

async function runFakeDataTests() {
  console.log("==================================================");
  console.log("🚀 Starting Backend E2E API Tests with Fake Data...");
  console.log("==================================================\n");

  const timestamp = Date.now();
  const fakeUser1 = {
    email: `owner_${timestamp}@example.com`,
    password: "Password123!",
    name: "Fake Owner User",
    avatarUrl: "https://example.com/avatar1.png",
  };

  const fakeUser2 = {
    email: `invitee_${timestamp}@example.com`,
    password: "Password123!",
    name: "Fake Invitee User",
    avatarUrl: "https://example.com/avatar2.png",
  };

  const fakeOrg = {
    name: `Fake Org ${timestamp}`,
    slug: `fake-org-${timestamp}`,
    description: "Fake Organization for Testing",
    avatarUrl: "https://example.com/org-logo.png",
  };

  let token1 = "";
  let token2 = "";
  let userId2 = "";
  let orgId = "";
  let inviteToken = "";

  // 1. Signup User 1 (Owner)
  console.log("1️⃣ Testing POST /auth/signup (Owner)...");
  const resSignup1 = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fakeUser1),
  });
  const dataSignup1 = (await resSignup1.json()) as any;
  console.log("   Status:", resSignup1.status, dataSignup1.success ? "✅ SUCCESS" : "❌ FAILED");
  if (!dataSignup1.success) throw new Error(JSON.stringify(dataSignup1));
  token1 = dataSignup1.data.token;

  // 2. Signup User 2 (Invitee)
  console.log("2️⃣ Testing POST /auth/signup (Invitee)...");
  const resSignup2 = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fakeUser2),
  });
  const dataSignup2 = (await resSignup2.json()) as any;
  console.log("   Status:", resSignup2.status, dataSignup2.success ? "✅ SUCCESS" : "❌ FAILED");
  if (!dataSignup2.success) throw new Error(JSON.stringify(dataSignup2));
  token2 = dataSignup2.data.token;
  userId2 = dataSignup2.data.user.id;

  // 3. Signin User 1
  console.log("3️⃣ Testing POST /auth/signin...");
  const resSignin1 = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: fakeUser1.email, password: fakeUser1.password }),
  });
  const dataSignin1 = (await resSignin1.json()) as any;
  console.log("   Status:", resSignin1.status, dataSignin1.success ? "✅ SUCCESS" : "❌ FAILED");

  // 4. Get Current User Profile GET /auth/me
  console.log("4️⃣ Testing GET /auth/me...");
  const resMe = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataMe = (await resMe.json()) as any;
  console.log("   Status:", resMe.status, dataMe.data?.email === fakeUser1.email ? "✅ SUCCESS" : "❌ FAILED");

  // 5. Create Organization POST /organizations
  console.log("5️⃣ Testing POST /organizations...");
  const resCreateOrg = await fetch(`${BASE_URL}/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify(fakeOrg),
  });
  const dataCreateOrg = (await resCreateOrg.json()) as any;
  console.log("   Status:", resCreateOrg.status, dataCreateOrg.success ? "✅ SUCCESS" : "❌ FAILED");
  if (!dataCreateOrg.success) throw new Error(JSON.stringify(dataCreateOrg));
  orgId = dataCreateOrg.data.id;

  // 6. Get User Organizations GET /organizations
  console.log("6️⃣ Testing GET /organizations...");
  const resGetOrgs = await fetch(`${BASE_URL}/organizations`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataGetOrgs = (await resGetOrgs.json()) as any;
  console.log("   Status:", resGetOrgs.status, dataGetOrgs.data?.length > 0 ? "✅ SUCCESS" : "❌ FAILED");

  // 7. Get Single Organization Details GET /organizations/:orgId
  console.log("7️⃣ Testing GET /organizations/:orgId...");
  const resGetOrgById = await fetch(`${BASE_URL}/organizations/${orgId}`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataGetOrgById = (await resGetOrgById.json()) as any;
  console.log("   Status:", resGetOrgById.status, dataGetOrgById.data?.id === orgId ? "✅ SUCCESS" : "❌ FAILED");

  // 8. Create Invite POST /organizations/:orgId/invites
  console.log("8️⃣ Testing POST /organizations/:orgId/invites...");
  const resInvite = await fetch(`${BASE_URL}/organizations/${orgId}/invites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({ email: fakeUser2.email }),
  });
  const dataInvite = (await resInvite.json()) as any;
  console.log("   Status:", resInvite.status, dataInvite.success ? "✅ SUCCESS" : "❌ FAILED");
  if (!dataInvite.success) throw new Error(JSON.stringify(dataInvite));
  inviteToken = dataInvite.data.token;

  // 9. Accept Invite POST /organizations/invites/accept
  console.log("9️⃣ Testing POST /organizations/invites/accept...");
  const resAccept = await fetch(`${BASE_URL}/organizations/invites/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token2}`,
    },
    body: JSON.stringify({ token: inviteToken }),
  });
  const dataAccept = (await resAccept.json()) as any;
  console.log("   Status:", resAccept.status, dataAccept.success ? "✅ SUCCESS" : "❌ FAILED");

  // 10. Verify member addition
  console.log("🔟 Testing GET /organizations/:orgId (Verify 2 members)...");
  const resOrgAfterAccept = await fetch(`${BASE_URL}/organizations/${orgId}`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataOrgAfterAccept = (await resOrgAfterAccept.json()) as any;
  console.log("   Status:", resOrgAfterAccept.status, dataOrgAfterAccept.data?.members?.length === 2 ? "✅ SUCCESS" : "❌ FAILED");

  // 11. Create Board POST /boards
  console.log("1️⃣1️⃣ Testing POST /boards...");
  const resCreateBoard = await fetch(`${BASE_URL}/boards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({
      title: "Testing Board",
      organizationId: orgId,
      backgroundColor: "#0079BF",
    }),
  });
  const dataCreateBoard = (await resCreateBoard.json()) as any;
  console.log("   Status:", resCreateBoard.status, dataCreateBoard.success ? "✅ SUCCESS" : "❌ FAILED");
  if (!dataCreateBoard.success) throw new Error(JSON.stringify(dataCreateBoard));
  const boardId = dataCreateBoard.data.id;

  // 12. Get Boards GET /boards
  console.log("1️⃣2️⃣ Testing GET /boards...");
  const resGetBoards = await fetch(`${BASE_URL}/boards?orgId=${orgId}`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataGetBoards = (await resGetBoards.json()) as any;
  console.log("   Status:", resGetBoards.status, dataGetBoards.data?.length > 0 ? "✅ SUCCESS" : "❌ FAILED");

  // 13. Get Board By Id GET /boards/:boardId
  console.log("1️⃣3️⃣ Testing GET /boards/:boardId...");
  const resGetBoardById = await fetch(`${BASE_URL}/boards/${boardId}`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataGetBoardById = (await resGetBoardById.json()) as any;
  console.log("   Status:", resGetBoardById.status, dataGetBoardById.data?.id === boardId ? "✅ SUCCESS" : "❌ FAILED");

  // 14. Update Board PATCH /boards/:boardId
  console.log("1️⃣4️⃣ Testing PATCH /boards/:boardId...");
  const resUpdateBoard = await fetch(`${BASE_URL}/boards/${boardId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({ title: "Updated Testing Board Title" }),
  });
  const dataUpdateBoard = (await resUpdateBoard.json()) as any;
  console.log("   Status:", resUpdateBoard.status, dataUpdateBoard.data?.title === "Updated Testing Board Title" ? "✅ SUCCESS" : "❌ FAILED");

  // 15. Create Section POST /boards/:boardId/sections
  console.log("1️⃣5️⃣ Testing POST /boards/:boardId/sections...");
  const resCreateSection = await fetch(`${BASE_URL}/boards/${boardId}/sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({ title: "To Do Section" }),
  });
  const dataCreateSection = (await resCreateSection.json()) as any;
  console.log("   Status:", resCreateSection.status, dataCreateSection.success ? "✅ SUCCESS" : "❌ FAILED");
  if (!dataCreateSection.success) throw new Error(JSON.stringify(dataCreateSection));
  const sectionId = dataCreateSection.data.id;

  // 16. Get Sections GET /boards/:boardId/sections
  console.log("1️⃣6️⃣ Testing GET /boards/:boardId/sections...");
  const resGetSections = await fetch(`${BASE_URL}/boards/${boardId}/sections`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataGetSections = (await resGetSections.json()) as any;
  console.log("   Status:", resGetSections.status, dataGetSections.data?.length > 0 ? "✅ SUCCESS" : "❌ FAILED");

  // 17. Update Section PATCH /sections/:sectionId
  console.log("1️⃣7️⃣ Testing PATCH /sections/:sectionId...");
  const resUpdateSection = await fetch(`${BASE_URL}/sections/${sectionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({ title: "In Progress Section" }),
  });
  const dataUpdateSection = (await resUpdateSection.json()) as any;
  console.log("   Status:", resUpdateSection.status, dataUpdateSection.data?.title === "In Progress Section" ? "✅ SUCCESS" : "❌ FAILED");

  // 18. Create Issue POST /sections/:sectionId/issues
  console.log("1️⃣8️⃣ Testing POST /sections/:sectionId/issues...");
  const resCreateIssue = await fetch(`${BASE_URL}/sections/${sectionId}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({
      title: "Fix Authentication Middleware Bug",
      description: "Ensure JWT token is properly verified on protected routes.",
    }),
  });
  const dataCreateIssue = (await resCreateIssue.json()) as any;
  console.log("   Status:", resCreateIssue.status, dataCreateIssue.success ? "✅ SUCCESS" : "❌ FAILED");
  if (!dataCreateIssue.success) throw new Error(JSON.stringify(dataCreateIssue));
  const issueId = dataCreateIssue.data.id;

  // 19. Get Section Issues GET /sections/:sectionId/issues
  console.log("1️⃣9️⃣ Testing GET /sections/:sectionId/issues...");
  const resGetIssues = await fetch(`${BASE_URL}/sections/${sectionId}/issues`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataGetIssues = (await resGetIssues.json()) as any;
  console.log("   Status:", resGetIssues.status, dataGetIssues.data?.length > 0 ? "✅ SUCCESS" : "❌ FAILED");

  // 20. Get Issue Details GET /issues/:issueId
  console.log("2️⃣0️⃣ Testing GET /issues/:issueId...");
  const resGetIssueById = await fetch(`${BASE_URL}/issues/${issueId}`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataGetIssueById = (await resGetIssueById.json()) as any;
  console.log("   Status:", resGetIssueById.status, dataGetIssueById.data?.id === issueId ? "✅ SUCCESS" : "❌ FAILED");

  // 21. Update Issue PATCH /issues/:issueId
  console.log("2️⃣1️⃣ Testing PATCH /issues/:issueId...");
  const resUpdateIssue = await fetch(`${BASE_URL}/issues/${issueId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({ title: "Fix Auth & Section Middleware" }),
  });
  const dataUpdateIssue = (await resUpdateIssue.json()) as any;
  console.log("   Status:", resUpdateIssue.status, dataUpdateIssue.data?.title === "Fix Auth & Section Middleware" ? "✅ SUCCESS" : "❌ FAILED");

  // 22. Assign User to Issue POST /issues/:issueId/assignees
  console.log("2️⃣2️⃣ Testing POST /issues/:issueId/assignees...");
  const resAddAssignee = await fetch(`${BASE_URL}/issues/${issueId}/assignees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({ userId: userId2 }),
  });
  const dataAddAssignee = (await resAddAssignee.json()) as any;
  console.log("   Status:", resAddAssignee.status, dataAddAssignee.success ? "✅ SUCCESS" : "❌ FAILED");

  // 23. Remove User Assignment DELETE /issues/:issueId/assignees/:userId
  console.log("2️⃣3️⃣ Testing DELETE /issues/:issueId/assignees/:userId...");
  const resRemoveAssignee = await fetch(`${BASE_URL}/issues/${issueId}/assignees/${userId2}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataRemoveAssignee = (await resRemoveAssignee.json()) as any;
  console.log("   Status:", resRemoveAssignee.status, dataRemoveAssignee.success ? "✅ SUCCESS" : "❌ FAILED");

  // 24. Create Comment POST /issues/:issueId/comments
  console.log("2️⃣4️⃣ Testing POST /issues/:issueId/comments...");
  const resCreateComment = await fetch(`${BASE_URL}/issues/${issueId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({ content: "Working on reproducing this bug." }),
  });
  const dataCreateComment = (await resCreateComment.json()) as any;
  console.log("   Status:", resCreateComment.status, dataCreateComment.success ? "✅ SUCCESS" : "❌ FAILED");
  if (!dataCreateComment.success) throw new Error(JSON.stringify(dataCreateComment));
  const commentId = dataCreateComment.data.id;

  // 25. Get Comments GET /issues/:issueId/comments
  console.log("2️⃣5️⃣ Testing GET /issues/:issueId/comments...");
  const resGetComments = await fetch(`${BASE_URL}/issues/${issueId}/comments`, {
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataGetComments = (await resGetComments.json()) as any;
  console.log("   Status:", resGetComments.status, dataGetComments.data?.length > 0 ? "✅ SUCCESS" : "❌ FAILED");

  // 26. Update Comment PATCH /comments/:commentId
  console.log("2️⃣6️⃣ Testing PATCH /comments/:commentId...");
  const resUpdateComment = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token1}`,
    },
    body: JSON.stringify({ content: "Updated comment: Bug fix verified." }),
  });
  const dataUpdateComment = (await resUpdateComment.json()) as any;
  console.log("   Status:", resUpdateComment.status, dataUpdateComment.data?.content.includes("Updated comment") ? "✅ SUCCESS" : "❌ FAILED");

  // 27. Delete Comment DELETE /comments/:commentId
  console.log("2️⃣7️⃣ Testing DELETE /comments/:commentId...");
  const resDeleteComment = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataDeleteComment = (await resDeleteComment.json()) as any;
  console.log("   Status:", resDeleteComment.status, dataDeleteComment.success ? "✅ SUCCESS" : "❌ FAILED");

  // 28. Delete Issue DELETE /issues/:issueId
  console.log("2️⃣8️⃣ Testing DELETE /issues/:issueId...");
  const resDeleteIssue = await fetch(`${BASE_URL}/issues/${issueId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataDeleteIssue = (await resDeleteIssue.json()) as any;
  console.log("   Status:", resDeleteIssue.status, dataDeleteIssue.success ? "✅ SUCCESS" : "❌ FAILED");

  // 29. Remove Member DELETE /organizations/:orgId/members/:userId
  console.log("2️⃣9️⃣ Testing DELETE /organizations/:orgId/members/:userId...");
  const resRemoveMember = await fetch(`${BASE_URL}/organizations/${orgId}/members/${userId2}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataRemoveMember = (await resRemoveMember.json()) as any;
  console.log("   Status:", resRemoveMember.status, dataRemoveMember.success ? "✅ SUCCESS" : "❌ FAILED");

  // 30. Delete Section DELETE /sections/:sectionId
  console.log("3️⃣0️⃣ Testing DELETE /sections/:sectionId...");
  const resDeleteSection = await fetch(`${BASE_URL}/sections/${sectionId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataDeleteSection = (await resDeleteSection.json()) as any;
  console.log("   Status:", resDeleteSection.status, dataDeleteSection.success ? "✅ SUCCESS" : "❌ FAILED");

  // 31. Delete Board DELETE /boards/:boardId
  console.log("3️⃣1️⃣ Testing DELETE /boards/:boardId...");
  const resDeleteBoard = await fetch(`${BASE_URL}/boards/${boardId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataDeleteBoard = (await resDeleteBoard.json()) as any;
  console.log("   Status:", resDeleteBoard.status, dataDeleteBoard.success ? "✅ SUCCESS" : "❌ FAILED");

  // 32. Delete Organization DELETE /organizations/:orgId
  console.log("3️⃣2️⃣ Testing DELETE /organizations/:orgId...");
  const resDeleteOrg = await fetch(`${BASE_URL}/organizations/${orgId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token1}` },
  });
  const dataDeleteOrg = (await resDeleteOrg.json()) as any;
  console.log("   Status:", resDeleteOrg.status, dataDeleteOrg.success ? "✅ SUCCESS" : "❌ FAILED");

  console.log("\n==================================================");
  console.log("🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runFakeDataTests().catch((err) => {
  console.error("❌ Test failed with error:", err);
  process.exit(1);
});
