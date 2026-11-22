/*
 * @Description: 批量压缩 public/images/emoji 下的 PNG 表情（保留透明通道）
 * 依赖：sharp（pnpm add -D sharp）
 * 运行：pnpm compress:emoji
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/** 弹窗中表情最大显示 72px，保留 2 倍以上余量 */
const MAX_SIZE = 162;
/** pngquant 质量，100 最接近原图（实测约省 55% 体积） */
const QUALITY = 100;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/images/emoji");

async function findPng(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const groups = await Promise.all(
		entries.map((entry) => {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) return findPng(full);
			return entry.name.endsWith(".png") ? [full] : [];
		})
	);
	return groups.flat();
}

async function compress(file) {
	const before = (await fs.stat(file)).size;
	const output = await sharp(file)
		.resize({ width: MAX_SIZE, height: MAX_SIZE, fit: "inside", withoutEnlargement: true })
		.png({
			palette: true,
			quality: QUALITY,
			effort: 10,
			compressionLevel: 9
		})
		.toBuffer();

	const after = output.length;
	// 压缩后反而变大就跳过，避免负优化
	if (after < before) {
		const temp = `${file}.tmp`;
		await fs.writeFile(temp, output);
		await fs.rename(temp, file);
	}
	return {
		folder: path.basename(path.dirname(file)),
		before,
		after: Math.min(after, before)
	};
}

const files = await findPng(root);
const results = await Promise.all(files.map(compress));
const totals = new Map();

for (const { folder, before, after } of results) {
	const current = totals.get(folder) ?? { count: 0, before: 0, after: 0 };
	current.count += 1;
	current.before += before;
	current.after += after;
	totals.set(folder, current);
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
let beforeAll = 0;
let afterAll = 0;
for (const [folder, t] of totals) {
	beforeAll += t.before;
	afterAll += t.after;
	const percent = (((t.before - t.after) / t.before) * 100).toFixed(1);
	console.log(`${folder}: ${t.count} 张，${kb(t.before)} → ${kb(t.after)}，省 ${percent}%`);
}
console.log(`合计：${kb(beforeAll)} → ${kb(afterAll)}，省 ${(((beforeAll - afterAll) / beforeAll) * 100).toFixed(1)}%`);
