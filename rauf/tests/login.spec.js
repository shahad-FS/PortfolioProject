const { test, expect } = require("@playwright/test");

test.describe("Login Page Use Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    // [السر هنا] نجبر Playwright على الانتظار حتى يكتمل تحميل كل الـ JavaScript
    // ولا تقوم بأي إجراء حتى تهدأ الشبكة تماماً
    await page.waitForLoadState("networkidle");
  });

  test("should show input and button correctly", async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should raise error in login", async ({ page }) => {
    // 1. اعتراض الطلب وإرجاع 400 بدلاً من 401 لتجاوز إعادة التوجيه التلقائية
    await page.route(/\/accounts\/login/, async (route) => {
      if (route.request().method() === "OPTIONS") {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 400, // 👈 التغيير السحري هنا
        contentType: "application/json",
        body: JSON.stringify({ detail: "Invalid credentials" }),
      });
    });

    // 2. تعبئة الحقول
    await page.locator('input[name="email"]').fill("test@test.com");
    await page.locator('input[name="password"]').fill("password123");

    // 3. انتظار رد الـ API
    const responsePromise = page.waitForResponse(/\/accounts\/login/);

    // 4. النقر على الزر
    await page.locator('button[type="submit"]').click();

    // 5. انتظار اكتمال طلب الـ API
    await responsePromise;

    // 6. التحقق من ظهور رسالة الخطأ (لن يحدث Refresh للصفحة الآن)
    const errorAlert = page.getByTestId("login-error");
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText("⚠️");
  });
});
