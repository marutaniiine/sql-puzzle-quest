import type { Puzzle } from './types';

export const puzzles: Puzzle[] = [
  // Easy Puzzles
  {
    id: 1,
    title: '基本のSELECT',
    difficulty: 'easy',
    description: '冒険者ギルドに新しい依頼が届いた！',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
          { name: 'level', type: 'INTEGER' },
          { name: 'class', type: 'TEXT' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name, level, class) VALUES
      (1, 'アリア', 5, '戦士'),
      (2, 'ルーク', 8, '魔法使い'),
      (3, 'エリン', 3, '盗賊'),
      (4, 'マックス', 10, '僧侶');
    `,
    question: 'レベルが5以上の冒険者の名前を取得せよ',
    expectedResult: [
      { name: 'アリア' },
      { name: 'ルーク' },
      { name: 'マックス' },
    ],
    hint: 'WHERE句を使ってレベルを条件にしましょう',
    explanation: 'SELECT name FROM adventurers WHERE level >= 5',
  },
  {
    id: 2,
    title: '魔法使いを探せ',
    difficulty: 'easy',
    description: '魔法使いクラスの冒険者が必要だ！',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
          { name: 'level', type: 'INTEGER' },
          { name: 'class', type: 'TEXT' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name, level, class) VALUES
      (1, 'アリア', 5, '戦士'),
      (2, 'ルーク', 8, '魔法使い'),
      (3, 'エリン', 3, '盗賊'),
      (4, 'マックス', 10, '僧侶'),
      (5, 'セレナ', 7, '魔法使い');
    `,
    question: '魔法使いクラスの冒険者の名前とレベルを取得せよ',
    expectedResult: [
      { name: 'ルーク', level: 8 },
      { name: 'セレナ', level: 7 },
    ],
    hint: 'classカラムで絞り込みましょう',
    explanation: "SELECT name, level FROM adventurers WHERE class = '魔法使い'",
  },
  {
    id: 3,
    title: '最強の戦士',
    difficulty: 'easy',
    description: '最もレベルの高い冒険者は誰だ？',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
          { name: 'level', type: 'INTEGER' },
          { name: 'class', type: 'TEXT' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name, level, class) VALUES
      (1, 'アリア', 5, '戦士'),
      (2, 'ルーク', 8, '魔法使い'),
      (3, 'エリン', 3, '盗賊'),
      (4, 'マックス', 10, '僧侶'),
      (5, 'セレナ', 7, '魔法使い');
    `,
    question: '最もレベルの高い冒険者の名前を取得せよ',
    expectedResult: [{ name: 'マックス' }],
    hint: 'ORDER BY と LIMIT を組み合わせましょう',
    explanation: 'SELECT name FROM adventurers ORDER BY level DESC LIMIT 1',
  },

  // Medium Puzzles
  {
    id: 4,
    title: '集計クエスト',
    difficulty: 'medium',
    description: 'ギルドの統計を取ろう',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
          { name: 'level', type: 'INTEGER' },
          { name: 'class', type: 'TEXT' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name, level, class) VALUES
      (1, 'アリア', 5, '戦士'),
      (2, 'ルーク', 8, '魔法使い'),
      (3, 'エリン', 3, '盗賊'),
      (4, 'マックス', 10, '僧侶'),
      (5, 'セレナ', 7, '魔法使い'),
      (6, 'レオ', 6, '戦士');
    `,
    question: 'クラスごとの平均レベルを取得せよ（クラス名と平均レベル(avg_levelとする)を表示）',
    expectedResult: [
      { class: '僧侶', avg_level: 10 },
      { class: '戦士', avg_level: 5.5 },
      { class: '盗賊', avg_level: 3 },
      { class: '魔法使い', avg_level: 7.5 },
    ],
    hint: 'GROUP BY と AVG を使いましょう',
    explanation: 'SELECT class, AVG(level) as avg_level FROM adventurers GROUP BY class',
  },
  {
    id: 5,
    title: 'アイテム管理',
    difficulty: 'medium',
    description: '冒険者が持っているアイテムを調べよう',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
        ],
      },
      {
        name: 'items',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'adventurer_id', type: 'INTEGER' },
          { name: 'item_name', type: 'TEXT' },
          { name: 'quantity', type: 'INTEGER' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name) VALUES
      (1, 'アリア'),
      (2, 'ルーク'),
      (3, 'エリン');

      INSERT INTO items (id, adventurer_id, item_name, quantity) VALUES
      (1, 1, '剣', 1),
      (2, 1, 'ポーション', 5),
      (3, 2, '魔法の杖', 1),
      (4, 2, 'ポーション', 3),
      (5, 3, 'ダガー', 2);
    `,
    question: 'アリアが持っているアイテムの名前と数量を取得せよ',
    expectedResult: [
      { item_name: '剣', quantity: 1 },
      { item_name: 'ポーション', quantity: 5 },
    ],
    hint: 'JOINを使って2つのテーブルを結合しましょう',
    explanation: "SELECT items.item_name, items.quantity FROM items JOIN adventurers ON items.adventurer_id = adventurers.id WHERE adventurers.name = 'アリア'",
  },
  {
    id: 6,
    title: 'ポーション王',
    difficulty: 'medium',
    description: '最も多くのポーションを持っている冒険者は？',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
        ],
      },
      {
        name: 'items',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'adventurer_id', type: 'INTEGER' },
          { name: 'item_name', type: 'TEXT' },
          { name: 'quantity', type: 'INTEGER' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name) VALUES
      (1, 'アリア'),
      (2, 'ルーク'),
      (3, 'エリン');

      INSERT INTO items (id, adventurer_id, item_name, quantity) VALUES
      (1, 1, '剣', 1),
      (2, 1, 'ポーション', 5),
      (3, 2, '魔法の杖', 1),
      (4, 2, 'ポーション', 8),
      (5, 3, 'ダガー', 2),
      (6, 3, 'ポーション', 3);
    `,
    question: '最も多くポーションを持っている冒険者の名前を取得せよ',
    expectedResult: [{ name: 'ルーク' }],
    hint: 'JOIN、WHERE、ORDER BY、LIMITを組み合わせましょう',
    explanation: "SELECT adventurers.name FROM adventurers JOIN items ON adventurers.id = items.adventurer_id WHERE items.item_name = 'ポーション' ORDER BY items.quantity DESC LIMIT 1",
  },

  // Hard Puzzles
  {
    id: 7,
    title: 'クエストランキング',
    difficulty: 'hard',
    description: '最もクエストをクリアした冒険者を探せ',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
        ],
      },
      {
        name: 'quests',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'adventurer_id', type: 'INTEGER' },
          { name: 'quest_name', type: 'TEXT' },
          { name: 'completed', type: 'INTEGER' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name) VALUES
      (1, 'アリア'),
      (2, 'ルーク'),
      (3, 'エリン');

      INSERT INTO quests (id, adventurer_id, quest_name, completed) VALUES
      (1, 1, 'ゴブリン討伐', 1),
      (2, 1, 'ドラゴン退治', 0),
      (3, 2, 'ゴブリン討伐', 1),
      (4, 2, '魔王討伐', 1),
      (5, 2, '財宝探し', 1),
      (6, 3, 'ゴブリン討伐', 1),
      (7, 3, 'ドラゴン退治', 1);
    `,
    question: 'クエストを最も多くクリア（completed=1）した冒険者の名前とクリア数を取得せよ',
    expectedResult: [{ name: 'ルーク', cleared_count: 3 }],
    hint: 'JOIN、GROUP BY、COUNT、ORDER BY、LIMITを組み合わせましょう',
    explanation: 'SELECT adventurers.name, COUNT(*) as cleared_count FROM adventurers JOIN quests ON adventurers.id = quests.adventurer_id WHERE quests.completed = 1 GROUP BY adventurers.id ORDER BY cleared_count DESC LIMIT 1',
  },
  {
    id: 8,
    title: '未完了クエスト',
    difficulty: 'hard',
    description: '未完了のクエストを持つ冒険者を調べよう',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
        ],
      },
      {
        name: 'quests',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'adventurer_id', type: 'INTEGER' },
          { name: 'quest_name', type: 'TEXT' },
          { name: 'completed', type: 'INTEGER' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name) VALUES
      (1, 'アリア'),
      (2, 'ルーク'),
      (3, 'エリン');

      INSERT INTO quests (id, adventurer_id, quest_name, completed) VALUES
      (1, 1, 'ゴブリン討伐', 1),
      (2, 1, 'ドラゴン退治', 0),
      (3, 2, 'ゴブリン討伐', 1),
      (4, 2, '魔王討伐', 1),
      (5, 3, 'ゴブリン討伐', 1),
      (6, 3, 'ドラゴン退治', 1);
    `,
    question: '未完了（completed=0）のクエストを持つ冒険者の名前と未完了クエスト名を取得せよ',
    expectedResult: [{ name: 'アリア', quest_name: 'ドラゴン退治' }],
    hint: 'JOINとWHEREで未完了クエストを絞り込みましょう',
    explanation: 'SELECT adventurers.name, quests.quest_name FROM adventurers JOIN quests ON adventurers.id = quests.adventurer_id WHERE quests.completed = 0',
  },
  {
    id: 9,
    title: 'アイテム総数ランキング',
    difficulty: 'hard',
    description: '最も多くのアイテムを所持している冒険者は？',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
        ],
      },
      {
        name: 'items',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'adventurer_id', type: 'INTEGER' },
          { name: 'item_name', type: 'TEXT' },
          { name: 'quantity', type: 'INTEGER' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name) VALUES
      (1, 'アリア'),
      (2, 'ルーク'),
      (3, 'エリン');

      INSERT INTO items (id, adventurer_id, item_name, quantity) VALUES
      (1, 1, '剣', 1),
      (2, 1, 'ポーション', 5),
      (3, 2, '魔法の杖', 1),
      (4, 2, 'ポーション', 8),
      (5, 2, '魔法書', 3),
      (6, 3, 'ダガー', 2),
      (7, 3, 'ポーション', 3);
    `,
    question: 'アイテムの総数（quantityの合計）が最も多い冒険者の名前と総数を取得せよ',
    expectedResult: [{ name: 'ルーク', total_items: 12 }],
    hint: 'SUM、GROUP BY、ORDER BY、LIMITを組み合わせましょう',
    explanation: 'SELECT adventurers.name, SUM(items.quantity) as total_items FROM adventurers JOIN items ON adventurers.id = items.adventurer_id GROUP BY adventurers.id ORDER BY total_items DESC LIMIT 1',
  },
  {
    id: 10,
    title: '最終試練',
    difficulty: 'hard',
    description: 'レベル5以上でかつクエストを2つ以上クリアした冒険者を探せ',
    tableSchema: [
      {
        name: 'adventurers',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'name', type: 'TEXT' },
          { name: 'level', type: 'INTEGER' },
        ],
      },
      {
        name: 'quests',
        columns: [
          { name: 'id', type: 'INTEGER' },
          { name: 'adventurer_id', type: 'INTEGER' },
          { name: 'quest_name', type: 'TEXT' },
          { name: 'completed', type: 'INTEGER' },
        ],
      },
    ],
    initialData: `
      INSERT INTO adventurers (id, name, level) VALUES
      (1, 'アリア', 5),
      (2, 'ルーク', 8),
      (3, 'エリン', 3),
      (4, 'マックス', 10);

      INSERT INTO quests (id, adventurer_id, quest_name, completed) VALUES
      (1, 1, 'ゴブリン討伐', 1),
      (2, 1, 'ドラゴン退治', 1),
      (3, 2, 'ゴブリン討伐', 1),
      (4, 2, '魔王討伐', 1),
      (5, 2, '財宝探し', 1),
      (6, 3, 'ゴブリン討伐', 1),
      (7, 4, 'ドラゴン退治', 1);
    `,
    question: 'レベル5以上でかつクエストを2つ以上クリアした冒険者の名前を取得せよ',
    expectedResult: [{ name: 'アリア' }, { name: 'ルーク' }],
    hint: 'JOIN、WHERE、GROUP BY、HAVINGを組み合わせましょう',
    explanation: 'SELECT adventurers.name FROM adventurers JOIN quests ON adventurers.id = quests.adventurer_id WHERE adventurers.level >= 5 AND quests.completed = 1 GROUP BY adventurers.id HAVING COUNT(*) >= 2',
  },
];
