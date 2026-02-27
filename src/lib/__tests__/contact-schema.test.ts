import { z } from "zod";

// Recreate the schema for testing (same as in contact-form.tsx)
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  organization: z.string().min(2, "Organization is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide more detail"),
});

const validData = {
  name: "John Doe",
  organization: "Acme Corp",
  email: "john@example.com",
  phone: "+1 555 123 4567",
  message: "I would like to learn more about your services.",
};

describe("contactSchema", () => {
  describe("valid data", () => {
    it("passes validation with all fields provided", () => {
      const result = contactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("passes validation with phone omitted (undefined)", () => {
      const dataWithoutPhone = { name: validData.name, organization: validData.organization, email: validData.email, message: validData.message };
      const result = contactSchema.safeParse(dataWithoutPhone);
      expect(result.success).toBe(true);
    });

    it("passes validation with phone as empty string", () => {
      const result = contactSchema.safeParse({ ...validData, phone: "" });
      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("fails when name has less than 2 characters", () => {
      const result = contactSchema.safeParse({ ...validData, name: "A" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (i) => i.path[0] === "name",
        );
        expect(nameError).toBeDefined();
        expect(nameError!.message).toBe("Name must be at least 2 characters");
      }
    });

    it("fails when name is empty", () => {
      const result = contactSchema.safeParse({ ...validData, name: "" });
      expect(result.success).toBe(false);
    });

    it("passes when name has exactly 2 characters", () => {
      const result = contactSchema.safeParse({ ...validData, name: "AB" });
      expect(result.success).toBe(true);
    });
  });

  describe("organization validation", () => {
    it("fails when organization has less than 2 characters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        organization: "X",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const orgError = result.error.issues.find(
          (i) => i.path[0] === "organization",
        );
        expect(orgError).toBeDefined();
        expect(orgError!.message).toBe("Organization is required");
      }
    });

    it("fails when organization is empty", () => {
      const result = contactSchema.safeParse({
        ...validData,
        organization: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("fails with email missing @", () => {
      const result = contactSchema.safeParse({
        ...validData,
        email: "notanemail",
      });
      expect(result.success).toBe(false);
    });

    it("fails with email missing domain", () => {
      const result = contactSchema.safeParse({
        ...validData,
        email: "user@",
      });
      expect(result.success).toBe(false);
    });

    it("fails with empty email", () => {
      const result = contactSchema.safeParse({ ...validData, email: "" });
      expect(result.success).toBe(false);
    });

    it("passes with a valid email", () => {
      const result = contactSchema.safeParse({
        ...validData,
        email: "test@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("has the expected error message for invalid email", () => {
      const result = contactSchema.safeParse({
        ...validData,
        email: "bad-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find(
          (i) => i.path[0] === "email",
        );
        expect(emailError).toBeDefined();
        expect(emailError!.message).toBe("Please enter a valid email");
      }
    });
  });

  describe("phone validation", () => {
    it("accepts undefined phone", () => {
      const result = contactSchema.safeParse({
        ...validData,
        phone: undefined,
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty string phone", () => {
      const result = contactSchema.safeParse({ ...validData, phone: "" });
      expect(result.success).toBe(true);
    });

    it("accepts a phone number string", () => {
      const result = contactSchema.safeParse({
        ...validData,
        phone: "+44 20 7946 0958",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("message validation", () => {
    it("fails when message has less than 10 characters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        message: "Short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const msgError = result.error.issues.find(
          (i) => i.path[0] === "message",
        );
        expect(msgError).toBeDefined();
        expect(msgError!.message).toBe("Please provide more detail");
      }
    });

    it("fails when message is empty", () => {
      const result = contactSchema.safeParse({ ...validData, message: "" });
      expect(result.success).toBe(false);
    });

    it("passes when message has exactly 10 characters", () => {
      const result = contactSchema.safeParse({
        ...validData,
        message: "Exactly 10",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("multiple validation errors", () => {
    it("returns errors for all invalid fields at once", () => {
      const result = contactSchema.safeParse({
        name: "",
        organization: "",
        email: "invalid",
        message: "Short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorPaths = result.error.issues.map((i) => i.path[0]);
        expect(errorPaths).toContain("name");
        expect(errorPaths).toContain("organization");
        expect(errorPaths).toContain("email");
        expect(errorPaths).toContain("message");
      }
    });

    it("error messages match expected strings", () => {
      const result = contactSchema.safeParse({
        name: "A",
        organization: "B",
        email: "bad",
        message: "Too short",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain("Name must be at least 2 characters");
        expect(messages).toContain("Organization is required");
        expect(messages).toContain("Please enter a valid email");
        expect(messages).toContain("Please provide more detail");
      }
    });
  });
});
