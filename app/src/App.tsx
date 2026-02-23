import { useState, useEffect } from 'react';
import initSqlJs, { type Database } from 'sql.js';
import { puzzles } from './puzzles';
import type { GameState } from './types';
import './App.css';

function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [sqlReady, setSqlReady] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentPuzzle: 0,
    solvedPuzzles: new Set(),
    attempts: 0,
    hints: 0,
  });
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentPuzzle = puzzles[gameState.currentPuzzle];

  // Initialize SQL.js
  useEffect(() => {
    initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    }).then(() => {
      setSqlReady(true);
    });
  }, []);

  // Initialize database when puzzle changes
  useEffect(() => {
    if (!sqlReady || !currentPuzzle) return;

    initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    }).then((SQL) => {
      const database = new SQL.Database();

      // Create tables
      currentPuzzle.tableSchema.forEach((table) => {
        const columns = table.columns
          .map((col) => `${col.name} ${col.type}`)
          .join(', ');
        database.run(`CREATE TABLE ${table.name} (${columns})`);
      });

      // Insert initial data
      database.run(currentPuzzle.initialData);

      setDb(database);
      setResult(null);
      setError('');
      setShowHint(false);
      setShowExplanation(false);
      setShowSuccess(false);
    });
  }, [sqlReady, gameState.currentPuzzle]);

  const executeQuery = () => {
    if (!db) return;

    try {
      const stmt = db.prepare(query);
      const results: any[] = [];

      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();

      setResult(results);
      setError('');

      // Check if the result matches expected
      if (checkAnswer(results)) {
        setShowSuccess(true);
        if (!gameState.solvedPuzzles.has(currentPuzzle.id)) {
          setGameState((prev) => ({
            ...prev,
            solvedPuzzles: new Set([...prev.solvedPuzzles, currentPuzzle.id]),
          }));
        }
      } else {
        setGameState((prev) => ({ ...prev, attempts: prev.attempts + 1 }));
      }
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  const checkAnswer = (results: any[]): boolean => {
    const expected = currentPuzzle.expectedResult;

    if (results.length !== expected.length) return false;

    // Check if all expected rows exist in results (order-independent)
    return expected.every((expectedRow) => {
      return results.some((resultRow) => {
        // Check if all expected columns exist with correct values
        return Object.keys(expectedRow).every((key) => {
          // Check if the key exists in result
          if (!(key in resultRow)) return false;

          // Allow slight floating point differences
          if (typeof expectedRow[key] === 'number' && typeof resultRow[key] === 'number') {
            return Math.abs(expectedRow[key] - resultRow[key]) < 0.01;
          }
          return resultRow[key] === expectedRow[key];
        });
      });
    });
  };

  const nextPuzzle = () => {
    if (gameState.currentPuzzle < puzzles.length - 1) {
      setGameState((prev) => ({ ...prev, currentPuzzle: prev.currentPuzzle + 1 }));
      setQuery('');
      setShowSuccess(false);
    }
  };

  const prevPuzzle = () => {
    if (gameState.currentPuzzle > 0) {
      setGameState((prev) => ({ ...prev, currentPuzzle: prev.currentPuzzle - 1 }));
      setQuery('');
      setShowSuccess(false);
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      setGameState((prev) => ({ ...prev, hints: prev.hints + 1 }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4ade80';
      case 'medium':
        return '#fbbf24';
      case 'hard':
        return '#f87171';
      default:
        return '#64748b';
    }
  };

  const progress = (gameState.solvedPuzzles.size / puzzles.length) * 100;

  if (!sqlReady) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>SQLエンジンを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🗝️ SQL Puzzle Quest</h1>
        <p className="subtitle">SQLクエリを解いて宝箱を開けよう</p>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">クリア</span>
            <span className="stat-value">
              {gameState.solvedPuzzles.size} / {puzzles.length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">試行回数</span>
            <span className="stat-value">{gameState.attempts}</span>
          </div>
          <div className="stat">
            <span className="stat-label">ヒント使用</span>
            <span className="stat-value">{gameState.hints}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </header>

      <main className="main">
        <div className="puzzle-card">
          <div className="puzzle-header">
            <div className="puzzle-title-row">
              <h2>
                #{currentPuzzle.id} {currentPuzzle.title}
              </h2>
              <span
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(currentPuzzle.difficulty) }}
              >
                {currentPuzzle.difficulty === 'easy' && '初級'}
                {currentPuzzle.difficulty === 'medium' && '中級'}
                {currentPuzzle.difficulty === 'hard' && '上級'}
              </span>
            </div>
            <p className="puzzle-description">{currentPuzzle.description}</p>
          </div>

          <div className="schema-section">
            <h3>📊 テーブル構造</h3>
            {currentPuzzle.tableSchema.map((table) => (
              <div key={table.name} className="table-schema">
                <h4>{table.name}</h4>
                <table>
                  <thead>
                    <tr>
                      <th>カラム名</th>
                      <th>型</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col) => (
                      <tr key={col.name}>
                        <td>{col.name}</td>
                        <td>{col.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="question-section">
            <h3>🎯 お題</h3>
            <p className="question">{currentPuzzle.question}</p>
          </div>

          <div className="query-section">
            <h3>💻 SQLクエリを入力</h3>
            <textarea
              className="query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SELECT * FROM ..."
              rows={5}
            />
            <div className="button-row">
              <button className="btn btn-primary" onClick={executeQuery}>
                🚀 実行
              </button>
              <button className="btn btn-secondary" onClick={toggleHint}>
                {showHint ? '💡 ヒントを隠す' : '💡 ヒントを見る'}
              </button>
            </div>
          </div>

          {showHint && (
            <div className="hint-box">
              <h4>💡 ヒント</h4>
              <p>{currentPuzzle.hint}</p>
            </div>
          )}

          {error && (
            <div className="error-box">
              <h4>❌ エラー</h4>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="result-section">
              <h3>📋 実行結果</h3>
              {result.length === 0 ? (
                <p className="empty-result">結果が空です</p>
              ) : (
                <div className="table-container">
                  <table className="result-table">
                    <thead>
                      <tr>
                        {Object.keys(result[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((val: any, j) => (
                            <td key={j}>{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {showSuccess && (
            <div className="success-box">
              <div className="success-content">
                <h3>🎉 正解！</h3>
                <p>宝箱を開けることができました！</p>
                {showExplanation ? (
                  <div className="explanation">
                    <h4>📖 解説</h4>
                    <code>{currentPuzzle.explanation}</code>
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowExplanation(true)}
                  >
                    解説を見る
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="navigation">
            <button
              className="btn btn-nav"
              onClick={prevPuzzle}
              disabled={gameState.currentPuzzle === 0}
            >
              ← 前の問題
            </button>
            <span className="puzzle-number">
              {gameState.currentPuzzle + 1} / {puzzles.length}
            </span>
            <button
              className="btn btn-nav"
              onClick={nextPuzzle}
              disabled={gameState.currentPuzzle === puzzles.length - 1}
            >
              次の問題 →
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>SQLクエリを書いてパズルを解き、データベースマスターを目指そう！</p>
      </footer>
    </div>
  );
}

export default App;
