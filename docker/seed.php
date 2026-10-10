<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This script can only be run from the command line.\n");
    exit(1);
}

$arguments = array_slice($argv, 1);
$cleanOnly = $arguments === array('--clean');
if ($arguments !== array() && !$cleanOnly) {
    fwrite(STDERR, "Usage: php seed.php [--clean]\n");
    exit(2);
}

if (!is_file('/app/config.inc.php')) {
    fwrite(STDERR, "Typecho config was not found at /app/config.inc.php.\n");
    exit(1);
}

require '/app/config.inc.php';

function seed_random_item(array $items): string
{
    return $items[array_rand($items)];
}

function seed_insert_meta($db, string $name, string $slug, string $type, string $description): int
{
    return (int) $db->query($db->insert('table.metas')->rows(array(
        'name' => $name,
        'slug' => $slug,
        'type' => $type,
        'description' => $description,
        'count' => 0,
        'order' => 0,
        'parent' => 0,
    )));
}

function seed_cleanup($db): array
{
    $contentRows = array_merge(
        $db->fetchAll($db->select('cid')->from('table.contents')
            ->where('type = ?', 'post')
            ->where('slug LIKE ?', 'seed-post-%')),
        $db->fetchAll($db->select('cid')->from('table.contents')
            ->where('type = ?', 'page')
            ->where('slug LIKE ?', 'seed-page-%'))
    );
    $contentIds = array();
    foreach ($contentRows as $row) {
        $contentIds[] = (int) $row['cid'];
    }

    foreach ($contentIds as $contentId) {
        $db->query($db->delete('table.comments')->where('cid = ?', $contentId));
        $db->query($db->delete('table.relationships')->where('cid = ?', $contentId));
        $db->query($db->delete('table.fields')->where('cid = ?', $contentId));
        $db->query($db->delete('table.contents')->where('cid = ?', $contentId));
    }

    $metaRows = array_merge(
        $db->fetchAll($db->select('mid')->from('table.metas')
            ->where('type = ?', 'category')
            ->where('slug LIKE ?', 'seed-cat-%')),
        $db->fetchAll($db->select('mid')->from('table.metas')
            ->where('type = ?', '_tag')
            ->where('slug LIKE ?', 'seed-tag-%'))
    );
    $metaIds = array();
    foreach ($metaRows as $row) {
        $metaIds[] = (int) $row['mid'];
    }

    foreach ($metaIds as $metaId) {
        $db->query($db->delete('table.relationships')->where('mid = ?', $metaId));
        $db->query($db->delete('table.metas')->where('mid = ?', $metaId));
    }

    return array(
        'contents' => count($contentIds),
        'metas' => count($metaIds),
    );
}

function seed_add_field($db, int $contentId, string $name, int $value): void
{
    $db->query($db->insert('table.fields')->rows(array(
        'cid' => $contentId,
        'name' => $name,
        'type' => 'str',
        'str_value' => (string) $value,
        'int_value' => 0,
        'float_value' => 0,
    )));
}

function seed_add_comment($db, int $contentId, int $ownerId, int $created, int $parent, array $names, array $sentences): int
{
    $name = seed_random_item($names);
    $text = seed_random_item($sentences);
    if (random_int(0, 1) === 1) {
        $text .= ' ' . seed_random_item($sentences);
    }
    if (random_int(0, 3) === 0) {
        $text .= ' ' . seed_random_item($sentences);
    }

    return (int) $db->query($db->insert('table.comments')->rows(array(
        'cid' => $contentId,
        'created' => $created,
        'author' => $name,
        'authorId' => 0,
        'ownerId' => $ownerId,
        'mail' => 'seed' . random_int(10000, 99999999) . '@example.com',
        'url' => '',
        'ip' => '127.0.0.1',
        'agent' => 'SeedData/1.0',
        'text' => $text,
        'type' => 'comment',
        'status' => 'approved',
        'parent' => $parent,
    )));
}

try {
    $db = \Typecho\Db::get();
    if (!$db) {
        throw new RuntimeException('Typecho database connection is not available.');
    }

    $admin = null;
    if (!$cleanOnly) {
        $admin = $db->fetchRow($db->select('uid')->from('table.users')
            ->where('uid = ?', 1)
            ->limit(1));
        if (!$admin) {
            throw new RuntimeException('Cannot seed data because Typecho user ID 1 does not exist.');
        }
    }

    $cleanupStats = seed_cleanup($db);
    if ($cleanOnly) {
        printf(
            "Seed data cleaned: %d contents, %d categories/tags.\n",
            $cleanupStats['contents'],
            $cleanupStats['metas']
        );
        exit(0);
    }

    $ownerId = (int) $admin['uid'];

    $sentences = array(
        '把复杂的问题拆开，往往就能找到清晰的路径。',
        '记录过程和结果一样重要。',
        '好的工具让重复劳动变得简单。',
        '从一个小改进开始，也能带来持续的变化。',
        '保持好奇，答案通常藏在细节里。',
        '先让方案跑通，再逐步打磨每个环节。',
        '稳定的节奏比短暂的冲刺更容易走得长远。',
        '清晰的边界能让协作变得轻松。',
        '给未来的自己留下足够明确的线索。',
        '每一次复盘都能让下一次尝试更有效。',
        '在真实场景中验证想法，收获会更加具体。',
        '把重要信息整理好，之后查找就不必从头开始。',
        '简单可靠的实现通常更容易维护。',
        '耐心处理边界情况，能让体验更加完整。',
        '循序渐进地调整，比一次性改动所有内容更稳妥。',
        '让数据保持一致，是许多功能正常运行的基础。',
        '持续观察反馈，才能找到真正值得改进的地方。',
        '明确目标以后，取舍也会容易很多。',
        '每个细节都可能成为理解整体的入口。',
        '好的记录能把一次经验变成可复用的知识。',
    );
    $phrases = array(
        '从想法到实践',
        '整理日常灵感',
        '小步前进',
        '观察与记录',
        '让流程更清晰',
        '持续改进',
        '发现新的可能',
        '实践中的经验',
        '把复杂变简单',
        '面向未来',
        '保持专注',
        '重新认识细节',
        '积累与分享',
        '构建可靠习惯',
        '记录每次尝试',
    );
    $names = array(
        '林间风', '南山', '小满', '清和', '木木', '云舟', '青禾', '拾光',
        '长安', '阿远', '星野', '知夏', '一页', '若水', '晚风',
    );

    $categoryIds = array();
    for ($index = 1; $index <= 30; $index++) {
        $number = str_pad((string) $index, 2, '0', STR_PAD_LEFT);
        $categoryIds[] = seed_insert_meta(
            $db,
            '测试分类 ' . $number,
            'seed-cat-' . $number,
            'category',
            seed_random_item($sentences)
        );
    }

    $tagIds = array();
    for ($index = 1; $index <= 25; $index++) {
        $number = str_pad((string) $index, 2, '0', STR_PAD_LEFT);
        $tagIds[] = seed_insert_meta($db, '标签' . $number, 'seed-tag-' . $number, '_tag', '');
    }

    $now = time();
    $oldestCreated = $now - 365 * 86400;
    $latestCreated = $now - 86400;
    $postIds = array();
    $commentCounts = array();

    for ($index = 1; $index <= 60; $index++) {
        $number = str_pad((string) $index, 3, '0', STR_PAD_LEFT);
        $created = random_int($oldestCreated, $latestCreated);
        $paragraphs = array();
        $paragraphCount = random_int(3, 6);
        for ($paragraph = 0; $paragraph < $paragraphCount; $paragraph++) {
            $paragraphs[] = seed_random_item($sentences) . ' ' . seed_random_item($sentences);
        }

        $content = "<!--markdown-->\n";
        $content .= '## ' . seed_random_item($phrases) . "\n\n";
        $content .= implode("\n\n", $paragraphs) . "\n\n";
        $content .= "- " . seed_random_item($sentences) . "\n";
        $content .= "- " . seed_random_item($sentences) . "\n";
        $content .= "- " . seed_random_item($sentences) . "\n\n";
        $content .= "```js\nconst message = 'seed-" . $number . "';\nconsole.log(message);\n```\n\n";
        $content .= '![占位图片](https://picsum.photos/seed/seed-' . $number . "/800/400)\n";

        $slug = 'seed-post-' . $number;
        $contentId = (int) $db->query($db->insert('table.contents')->rows(array(
            'title' => '测试文章 ' . $number . ' - ' . seed_random_item($phrases),
            'slug' => $slug,
            'created' => $created,
            'modified' => $created,
            'text' => $content,
            'order' => 0,
            'authorId' => $ownerId,
            'template' => '',
            'type' => 'post',
            'status' => 'publish',
            'password' => '',
            'commentsNum' => 0,
            'allowComment' => 1,
            'allowPing' => 1,
            'allowFeed' => 1,
            'parent' => 0,
        )));
        if ($contentId <= 0) {
            throw new RuntimeException('Failed to create post ' . $slug . '.');
        }
        $postIds[] = $contentId;

        $categoryId = $categoryIds[($index - 1) % count($categoryIds)];
        $db->query($db->insert('table.relationships')->rows(array(
            'cid' => $contentId,
            'mid' => $categoryId,
        )));

        $selectedTagIds = $tagIds;
        shuffle($selectedTagIds);
        $selectedTagIds = array_slice($selectedTagIds, 0, random_int(1, 8));
        foreach ($selectedTagIds as $tagId) {
            $db->query($db->insert('table.relationships')->rows(array(
                'cid' => $contentId,
                'mid' => $tagId,
            )));
        }

        seed_add_field($db, $contentId, 'views', random_int(0, 50000));
        seed_add_field($db, $contentId, 'likes', random_int(0, 500));
        if ($index % 3 === 0) {
            $db->query($db->insert('table.fields')->rows(array(
                'cid' => $contentId,
                'name' => 'titleImg',
                'type' => 'str',
                'str_value' => 'https://picsum.photos/seed/seed-thumb-' . $number . '/800/400',
                'int_value' => 0,
                'float_value' => 0,
            )));
        }

        $totalComments = $index === 1 ? 1 : ($index === 2 ? 10 : random_int(1, 10));
        $replyCount = ($index % 3 === 0 && $totalComments >= 2) ? 1 : 0;
        $rootCount = $totalComments - $replyCount;
        $rootCommentIds = array();
        $rootCommentCreated = array();

        for ($commentIndex = 0; $commentIndex < $rootCount; $commentIndex++) {
            $commentCreated = random_int($created + 1, $now);
            $commentId = seed_add_comment($db, $contentId, $ownerId, $commentCreated, 0, $names, $sentences);
            if ($commentId <= 0) {
                throw new RuntimeException('Failed to create a comment for ' . $slug . '.');
            }
            $rootCommentIds[] = $commentId;
            $rootCommentCreated[] = $commentCreated;
        }

        for ($replyIndex = 0; $replyIndex < $replyCount; $replyIndex++) {
            $parentIndex = random_int(0, count($rootCommentIds) - 1);
            $replyCreated = random_int($rootCommentCreated[$parentIndex], $now);
            $replyId = seed_add_comment(
                $db,
                $contentId,
                $ownerId,
                $replyCreated,
                $rootCommentIds[$parentIndex],
                $names,
                $sentences
            );
            if ($replyId <= 0) {
                throw new RuntimeException('Failed to create a nested comment for ' . $slug . '.');
            }
        }
        $commentCounts[$contentId] = $totalComments;
    }

    $pages = array(
        array('seed-page-about', '测试独立页：关于', "这里是一篇独立页面样例，用于检查页面模板与正文输出。"),
        array('seed-page-contact', '测试独立页：联系', "这是另一篇独立页面，正文包含多段内容。\n\n" . seed_random_item($sentences)),
        array('seed-page-empty', '测试独立页：边界内容', ''),
    );
    foreach ($pages as $page) {
        $pageId = (int) $db->query($db->insert('table.contents')->rows(array(
            'title' => $page[1],
            'slug' => $page[0],
            'created' => $now,
            'modified' => $now,
            'text' => "<!--markdown-->\n" . $page[2],
            'order' => 0,
            'authorId' => $ownerId,
            'template' => '',
            'type' => 'page',
            'status' => 'publish',
            'password' => '',
            'commentsNum' => 0,
            'allowComment' => 0,
            'allowPing' => 0,
            'allowFeed' => 0,
            'parent' => 0,
        )));
        if ($pageId <= 0) {
            throw new RuntimeException('Failed to create independent page ' . $page[0] . '.');
        }
    }

    foreach ($commentCounts as $contentId => $expectedCount) {
        $actualCount = count($db->fetchAll($db->select('coid')->from('table.comments')
            ->where('cid = ?', $contentId)
            ->where('type = ?', 'comment')
            ->where('status = ?', 'approved')));
        $db->query($db->update('table.contents')
            ->rows(array('commentsNum' => $actualCount))
            ->where('cid = ?', $contentId));
        if ($actualCount !== $expectedCount) {
            throw new RuntimeException('Comment count mismatch for content ID ' . $contentId . '.');
        }
    }

    foreach (array_merge($categoryIds, $tagIds) as $metaId) {
        $relationshipCount = count($db->fetchAll($db->select('cid')->from('table.relationships')
            ->where('mid = ?', $metaId)));
        $db->query($db->update('table.metas')
            ->rows(array('count' => $relationshipCount))
            ->where('mid = ?', $metaId));
    }

    printf(
        "Seed data created: %d posts, %d categories, %d tags, %d comments, %d pages. Previous seed data removed: %d contents, %d categories/tags.\n",
        count($postIds),
        count($categoryIds),
        count($tagIds),
        array_sum($commentCounts),
        count($pages),
        $cleanupStats['contents'],
        $cleanupStats['metas']
    );
} catch (Throwable $error) {
    fwrite(STDERR, 'Seed failed: ' . $error->getMessage() . "\n");
    exit(1);
}
