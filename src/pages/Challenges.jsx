import { useState } from 'react';
import { AppShell } from '../components/shell';
import { BookCover, Flourish } from '../components/ui';
import { useLibrary } from '../context/LibraryContext';
import { flashcards, getBook, quizQuestions } from '../data/catalog';
import { LEVEL_TITLES, levelFor } from '../lib/format';

export default function Challenges() {
  const { shelf, reviewFlashcard, setQuizAnswer, finishQuiz, resetQuiz } = useLibrary();
  const [flipped, setFlipped] = useState({});
  const [checked, setChecked] = useState(false);
  const credits = shelf?.credits || 0;
  const level = levelFor(credits);
  const seen = shelf?.flashcardsSeen || [];
  const quiz = shelf?.quiz || { answers: {}, score: null, completed: false };
  const answered = quizQuestions.filter((question) => quiz.answers[question.id] !== undefined).length;

  return (
    <AppShell>
      <header className="challenge-hero card">
        <div>
          <h1>Reading Challenges</h1>
          <Flourish />
          <p>Read. Learn. Practice. Earn. Grow. Turn your reading into knowledge with flashcards, quizzes, and credits.</p>
        </div>
        <div className="level-badge">
          <strong>Level {level}</strong>
          <span>{LEVEL_TITLES[level]}</span>
        </div>
      </header>
      <div className="stat-row">
        <article>
          <strong>{shelf?.booksBorrowed || 0}</strong>
          <span>Books borrowed</span>
        </article>
        <article>
          <strong>{shelf?.challengesCompleted || 0}</strong>
          <span>Challenges completed</span>
        </article>
        <article>
          <strong>{credits}</strong>
          <span>Credits earned</span>
        </article>
        <article>
          <strong>Level {level}</strong>
          <span>{LEVEL_TITLES[level]}</span>
        </article>
      </div>
      <section className="card">
        <header className="card-head">
          <h2>Flashcards</h2>
          <span>
            {seen.length} of {flashcards.length} reviewed
          </span>
        </header>
        <div className="flash-grid">
          {flashcards.map((card) => {
            const book = getBook(card.bookId);
            const open = flipped[card.id];
            return (
              <button
                key={card.id}
                type="button"
                className="flash"
                onClick={() => {
                  setFlipped((current) => ({ ...current, [card.id]: !current[card.id] }));
                  reviewFlashcard(card.id);
                }}
              >
                {open ? (
                  <span className="flash-face is-back">
                    <strong>Answer</strong>
                    <em>{card.answer}</em>
                    {seen.includes(card.id) && <span>+5 credits</span>}
                  </span>
                ) : (
                  <span className="flash-face">
                    <BookCover book={book} size="sm" />
                    <strong>{card.title}</strong>
                    <em>{card.prompt}</em>
                    <span>Flip</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
      <div className="split-2">
        <section className="card">
          <header className="card-head">
            <h2>Quiz</h2>
            <span>
              {answered} / {quizQuestions.length} answered
            </span>
          </header>
          {quiz.completed ? (
            <div className="quiz-score">
              <strong>
                {quiz.score} / {quizQuestions.length}
              </strong>
              <p>{quiz.rewarded ? 'Credits for this quiz are already on your ledger.' : 'Score saved.'}</p>
              <button type="button" className="btn btn-primary" onClick={() => { setChecked(false); resetQuiz(); }}>
                Try again
              </button>
            </div>
          ) : (
            <div className="quiz-list">
              {quizQuestions.map((question, index) => (
                <fieldset key={question.id} disabled={checked}>
                  <legend>
                    {index + 1}. {question.question}
                  </legend>
                  {question.options.map((option, optionIndex) => {
                    const selected = quiz.answers[question.id] === optionIndex;
                    const correct = checked && optionIndex === question.answer;
                    const wrong = checked && selected && optionIndex !== question.answer;
                    return (
                      <label key={option} className={correct ? 'is-correct' : wrong ? 'is-wrong' : ''}>
                        <input
                          type="radio"
                          name={question.id}
                          checked={selected}
                          onChange={() => setQuizAnswer(question.id, optionIndex)}
                        />
                        {option}
                      </label>
                    );
                  })}
                </fieldset>
              ))}
              <div className="modal-actions">
                {!checked ? (
                  <button type="button" className="btn btn-primary" onClick={() => setChecked(true)} disabled={answered < quizQuestions.length}>
                    Check answers
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={finishQuiz}>
                    Save score
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
        <section className="card">
          <header className="card-head">
            <h2>Credits</h2>
            <strong>{credits}</strong>
          </header>
          <p>Ten credits for each correct quiz answer, five for a flashcard you have not reviewed before.</p>
          <div className="credit-meter" aria-hidden="true">
            <span style={{ width: `${Math.min(100, (credits % 200) / 2)}%` }} />
          </div>
          <p className="muted">{200 - (credits % 200)} credits to the next bonus mark.</p>
          <ul className="credit-log">
            {(shelf?.creditLog || []).slice(0, 6).map((entry) => (
              <li key={entry.id}>
                <span>{entry.label}</span>
                <strong>+{entry.amount}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
