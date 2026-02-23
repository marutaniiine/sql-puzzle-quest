export interface Puzzle {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  tableSchema: TableSchema[];
  initialData: string; // SQL INSERT statements
  question: string;
  expectedResult: any[];
  hint: string;
  explanation: string;
}

export interface TableSchema {
  name: string;
  columns: { name: string; type: string }[];
}

export interface GameState {
  currentPuzzle: number;
  solvedPuzzles: Set<number>;
  attempts: number;
  hints: number;
}
