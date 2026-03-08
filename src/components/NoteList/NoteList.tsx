// ==========================================================================================
// Компонент NoteList - колекція нотаток
// ==========================================================================================

// Імпорт модуля зі стилями компонента
import css from './NoteList.module.css';

// Імпорт інтерфейса для однієї нотатки
import { type Note } from '../../types/note';

// Оголошення інтерфейса NoteListProps, який описує типи для пропсів компонента.

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {/* Набір елементів списку нотаток */}
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => {
                onDelete(note.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
