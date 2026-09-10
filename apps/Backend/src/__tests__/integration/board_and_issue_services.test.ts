import { describe, expect, test } from "bun:test";
import { registerUser } from "../../services/auth.service";
import { createOrganizationService } from "../../services/org.service";
import {
  createBoardService,
  getBoardService,
  getBoardByIdService,
  updateBoardService,
  deleteBoardService,
} from "../../services/board.service";
import {
  createSectionService,
  getSectionsService,
  updateSectionService,
  deleteSectionService,
} from "../../services/section.service";
import {
  createIssueService,
  getSectionIssuesService,
  getIssueByIdService,
  updateIssueService,
  deleteIssueService,
  addIssueAssigneeService,
  removeIssueAssigneeService,
} from "../../services/issue.service";
import {
  createCommentService,
  getIssueCommentsService,
  updateCommentService,
  deleteCommentService,
} from "../../services/comments.service";

describe("Board, Section, Issue & Comment Services Integration Tests", () => {
  const timestamp = Date.now();
  let userId = "";
  let orgId = "";
  let boardId = "";
  let sectionId = "";
  let issueId = "";
  let commentId = "";

  test("Setup test user and org for board suite", async () => {
    const user = await registerUser({
      email: `board_tester_${timestamp}@example.com`,
      password: "Password123!",
      name: "Board Tester",
    });
    userId = user.user.id;

    const org = await createOrganizationService(userId, {
      name: `Board Suite Org ${timestamp}`,
      slug: `board-suite-org-${timestamp}`,
    });
    orgId = org.id;

    expect(userId).toBeDefined();
    expect(orgId).toBeDefined();
  });

  // ==========================================
  // Board Services Tests
  // ==========================================
  test("createBoardService creates board in org", async () => {
    const board = await createBoardService(userId, {
      title: "Kanban Test Board",
      organizationId: orgId,
      backgroundColor: "#0079BF",
    });

    expect(board.id).toBeDefined();
    expect(board.title).toBe("Kanban Test Board");
    boardId = board.id;
  });

  test("getBoardService lists active boards for user", async () => {
    const boards = await getBoardService(userId, orgId);
    expect(boards.length).toBeGreaterThan(0);
    expect(boards[0]!.id).toBe(boardId);
  });

  test("getBoardByIdService retrieves board with full structure", async () => {
    const board = await getBoardByIdService(userId, boardId);
    expect(board.id).toBe(boardId);
    expect(board.title).toBe("Kanban Test Board");
  });

  test("updateBoardService updates board title", async () => {
    const updated = await updateBoardService(userId, boardId, {
      title: "Updated Board Title",
    });
    expect(updated.title).toBe("Updated Board Title");
  });

  // ==========================================
  // Section Services Tests
  // ==========================================
  test("createSectionService creates section with auto-calculated order", async () => {
    const section = await createSectionService(userId, boardId, {
      title: "In Progress",
    });

    expect(section.id).toBeDefined();
    expect(section.order).toBe(65536.0);
    sectionId = section.id;
  });

  test("getSectionsService lists board sections", async () => {
    const sections = await getSectionsService(userId, boardId);
    expect(sections.length).toBe(1);
    expect(sections[0]!.id).toBe(sectionId);
  });

  test("updateSectionService updates section title", async () => {
    const updated = await updateSectionService(userId, sectionId, {
      title: "Done",
    });
    expect(updated.title).toBe("Done");
  });

  // ==========================================
  // Issue Services Tests
  // ==========================================
  test("createIssueService creates issue in section", async () => {
    const issue = await createIssueService(userId, sectionId, {
      title: "Unit Test Task",
      description: "Unit Test Description",
    });

    expect(issue.id).toBeDefined();
    expect(issue.title).toBe("Unit Test Task");
    expect(issue.order).toBe(65536.0);
    issueId = issue.id;
  });

  test("getSectionIssuesService fetches section issues", async () => {
    const issues = await getSectionIssuesService(userId, sectionId);
    expect(issues.length).toBe(1);
    expect(issues[0]!.id).toBe(issueId);
  });

  test("getIssueByIdService retrieves detailed issue", async () => {
    const issue = await getIssueByIdService(userId, issueId);
    expect(issue?.id).toBe(issueId);
    expect(issue?.title).toBe("Unit Test Task");
  });

  test("updateIssueService updates issue title", async () => {
    const updated = await updateIssueService(userId, issueId, {
      title: "Updated Unit Test Task",
    });
    expect(updated.title).toBe("Updated Unit Test Task");
  });

  test("addIssueAssigneeService assigns user to issue", async () => {
    const assignment = await addIssueAssigneeService(userId, issueId, userId);
    expect(assignment.issueId).toBe(issueId);
    expect(assignment.userId).toBe(userId);
  });

  test("removeIssueAssigneeService removes user assignment", async () => {
    const result = await removeIssueAssigneeService(userId, issueId, userId);
    expect(result.message).toBe("Assignee removed successfully");
  });

  // ==========================================
  // Comment Services Tests
  // ==========================================
  test("createCommentService posts comment on issue", async () => {
    const comment = await createCommentService(userId, issueId, {
      content: "Initial test comment",
    });

    expect(comment.id).toBeDefined();
    expect(comment.content).toBe("Initial test comment");
    commentId = comment.id;
  });

  test("getIssueCommentsService lists comments for issue", async () => {
    const comments = await getIssueCommentsService(userId, issueId);
    expect(comments.length).toBe(1);
    expect(comments[0]!.id).toBe(commentId);
  });

  test("updateCommentService edits comment content (Author check)", async () => {
    const updated = await updateCommentService(userId, commentId, {
      content: "Edited comment content",
    });
    expect(updated.content).toBe("Edited comment content");
  });

  test("deleteCommentService deletes comment (Author check)", async () => {
    const result = await deleteCommentService(userId, commentId);
    expect(result.message).toBe("Comment deleted successfully");
  });

  test("deleteIssueService deletes issue", async () => {
    const result = await deleteIssueService(userId, issueId);
    expect(result.message).toBe("Issue deleted successfully");
  });

  test("deleteSectionService deletes section", async () => {
    const result = await deleteSectionService(userId, sectionId);
    expect(result.message).toBe("Section deleted successfully");
  });

  test("deleteBoardService deletes board", async () => {
    const result = await deleteBoardService(userId, boardId);
    expect(result.message).toBe("Board deleted successfully");
  });
});
