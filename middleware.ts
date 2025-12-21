import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {

  const accessToken = request.cookies.get("accessToken")?.value;
  const pathName = request.nextUrl.pathname;
   
  // Nếu không có token và truy cập trang root → chuyển thẳng tới login
  if (!accessToken && pathName === "/") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  // Nếu không có token và đang truy cập dashboard hoặc trang entrance → redirect về login
  if (!accessToken && (pathName.startsWith("/dashboard") || pathName.startsWith("/entrance"))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (accessToken) {
    try {
      const base64 = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(Buffer.from(base64, "base64").toString());
      const role = decodedPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const isPlacementTestDone = decodedPayload["IsPlacementTestDone"];
      const isReviewerActive = decodedPayload["IsReviewerActive"];
      const reviewerStatus = decodedPayload["ReviewerStatus"]; // "Pending" | "Active" | etc.

      // Nếu vào root "/" và đã có token → redirect về dashboard theo role
      if (pathName === "/") {
        if (role === "LEARNER") {
          if (!isPlacementTestDone) {
            return NextResponse.redirect(new URL("/entrance_test", request.url));
          }
          return NextResponse.redirect(new URL("/dashboard-learner-layout?menu=enrollingCourses", request.url));
        }
        if (role === "REVIEWER") {
          // isReviewerActive = false → chưa upload certificate → entrance_information
          if (!isReviewerActive) {
            return NextResponse.redirect(new URL("/entrance_information", request.url));
          }
          // isReviewerActive = true, ReviewerStatus = "Pending" → đang chờ duyệt → reviewer-waiting
          if (reviewerStatus === "Pending") {
            return NextResponse.redirect(new URL("/reviewer-waiting", request.url));
          }
          // isReviewerActive = true, ReviewerStatus = "Active" → đã duyệt → dashboard
          return NextResponse.redirect(new URL("/dashboard-reviewer-layout", request.url));
        }
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard-admin-layout", request.url));
        }
        if (role === "MANAGER") {
          return NextResponse.redirect(new URL("/dashboard-manager-layout", request.url));
        }
      }

      // Nếu LEARNER chưa làm placement test → chuyển hướng tới trang test
      if (
        role === "LEARNER" &&
        !isPlacementTestDone &&
        pathName !== "/entrance_test" 
      ) {
        return NextResponse.redirect(new URL("/entrance_test", request.url));
      }

      // Nếu REVIEWER chưa upload certificate (isReviewerActive = false) → entrance_information
      if (
        role === "REVIEWER" &&
        !isReviewerActive &&
        pathName !== "/entrance_information"
      ) {
        return NextResponse.redirect(
          new URL("/entrance_information", request.url)
        );
      }

      // Nếu REVIEWER đã upload certificate nhưng đang chờ duyệt (Pending) → reviewer-waiting
      if (
        role === "REVIEWER" &&
        isReviewerActive &&
        reviewerStatus === "Pending" &&
        pathName !== "/reviewer-waiting" &&
        pathName !== "/entrance_information" // Cho phép vào để chỉnh sửa certificate
      ) {
        return NextResponse.redirect(
          new URL("/reviewer-waiting", request.url)
        );
      }

      // Nếu REVIEWER đã Active (được duyệt) mà vào entrance_information hoặc reviewer-waiting → về dashboard
      if (
        role === "REVIEWER" &&
        isReviewerActive &&
        reviewerStatus === "Active" &&
        (pathName === "/entrance_information" || pathName === "/reviewer-waiting")
      ) {
        return NextResponse.redirect(
          new URL("/dashboard-reviewer-layout", request.url)
        );
      }

      // Reviewer thì KHÔNG ĐƯỢC vào trang entrance_test (dành riêng cho Learner)
      if (role === "REVIEWER" && pathName === "/entrance_test") {
        return NextResponse.redirect(
          new URL("/dashboard-reviewer-layout", request.url)
        );
      }

      // Nếu REVIEWER đã active nhưng vẫn cố vào trang /entrance_information → đá về dashboard-reviewer-layout
      if (
        role === "LEARNER" &&
        isPlacementTestDone &&
        pathName === "/entrance_test"
      ) {
        return NextResponse.redirect(
          new URL("/dashboard-learner-layout?menu=enrollingCourses", request.url)
        );
      }

      // Nếu có token mà vẫn truy cập auth pages → redirect dashboard
      if (["/sign-in", "/sign-up", "/forgot-password"].includes(pathName)) {
        if (role === "LEARNER") {
          if (!isPlacementTestDone) {
            return NextResponse.redirect(
              new URL("/entrance_test", request.url)
            );
          }
          return NextResponse.redirect(
            new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
          );
        }
        if (role === "REVIEWER") {
          // Chưa upload certificate → entrance_information
          if (!isReviewerActive) {
            return NextResponse.redirect(
              new URL("/entrance_information", request.url)
            );
          }
          // Đang chờ duyệt → reviewer-waiting
          if (reviewerStatus === "Pending") {
            return NextResponse.redirect(
              new URL("/reviewer-waiting", request.url)
            );
          }
          // Đã được duyệt → dashboard
          return NextResponse.redirect(
            new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
          );
        }

        // Admin / Manager
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }

      // Check role với dashboard route
      if (pathName.startsWith("/dashboard-admin-layout") && role !== "ADMIN") {
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }
      if (
        pathName.startsWith("/dashboard-manager-layout") &&
        role !== "MANAGER"
      ) {
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }

      if (
        pathName.startsWith("/dashboard-reviewer-layout") &&
        role !== "REVIEWER"
      ) {
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }

      if (
        pathName.startsWith("/dashboard-learner-layout?menu=learningPath") &&
        role !== "LEARNER"
      ) {
        return NextResponse.redirect(
          new URL(`/dashboard-${role?.toLowerCase()}-layout`, request.url)
        );
      }
    } catch (err) {
      // Nếu token bị malformed → redirect login
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/dashboard-admin-layout/:path*",
    "/dashboard-reviewer-layout/:path*",
    "/dashboard-learner-layout/:path*",
    "/entrance",
    "/entrance_test",
    "/entrance_information",
    "/reviewer-waiting",
  ],
};