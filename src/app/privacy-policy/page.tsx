import fs from "fs";
import path from "path";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function PrivacyPolicyPage() {
  const filePath = path.join(process.cwd(), "src/app/privacy-policy/page.md");
  const fileContents = fs.readFileSync(filePath, "utf8");

  return (
    <main className="prose mx-auto px-4 py-8">
      <MarkdownRenderer content={fileContents} />
    </main>
  );
}
