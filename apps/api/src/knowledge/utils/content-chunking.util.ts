/**
 * 纯文本内容分片工具。
 *
 * 范围边界（重要）：本工具只负责把文章正文切成若干文本片段写入KnowledgeChunks表，
 * **不生成embedding向量**。生成向量需要调用Embedding模型，属于
 * ai-infrastructure-v1.md定义的Model Gateway职责范围，而AI Assistant是
 * TASK-102明确排除的范围。KnowledgeChunks.embedding在Prisma Schema里被声明为
 * `Unsupported("vector(1536)")`类型——这不是疏漏，是刻意的：Prisma对Unsupported
 * 类型字段不提供任何读写接口，意味着本Sprint的代码在类型层面就不可能给embedding赋值，
 * 这是比"写注释提醒自己别做"更可靠的范围约束方式。
 * 后续AI Assistant Service的Sprint需要用$executeRaw这类原生SQL方式回填embedding。
 */

const MAX_CHUNK_LENGTH = 800; // 字符数，非Token数，粗略切分，精细的Token级切分留待RAG Sprint按所选Embedding模型的实际限制调整

export function splitIntoChunks(content: string): string[] {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if ((current + '\n\n' + paragraph).length > MAX_CHUNK_LENGTH && current) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}
