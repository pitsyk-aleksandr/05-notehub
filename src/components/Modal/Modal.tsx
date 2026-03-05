// ==========================================================================================
// Компонент Modal - універсальний компонент модального вікна,
//                   який може відображати будь-який вміст, переданий через children
// ==========================================================================================

// Компонент MovieModal використовується в компоненті App
// MovieModal отримує два пропси:
//      - movie - посилання на об’єкт обраного фільма;
//      - onClose - функцію закриття модального вікна.
// ------------------------------------------------------------------------------------------

// Функція createPortal дозволяє рендерити компонент в інше місце DOM-дерева,
// зазвичай безпосередньо в <body>.
import { createPortal } from 'react-dom';

import { useEffect } from 'react';

// Імпорт інтерфейса для одного фільму
// import type { Note } from '../../types/note';

// Імпорт модуля зі стилями компонента
import css from './Modal.module.css';

// Оголошення інтерфейса MovieModalProps, який описує типи для пропсів компонента.
interface ModalProps {
  // note - посилання на об’єкт обраного фільма (null - якщо не вибраний спочатку)
  //   note: Note | null;
  // onClose - функція закриття модального вікна
  // Типізація функцій - стандартна (через стрілочну функцію)
  onClose: () => void;
}

// Компонент Modal
export default function Modal({ onClose }: ModalProps) {
  // Функція закриття модального вікна по кліку на Backdrop
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Еффект для перевірки натискання клавіші Esc
  useEffect(() => {
    // Обробник події - натискання клавіатури
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    // Додаємо слухач клавіатури на весь документ
    document.addEventListener('keydown', handleKeyDown);
    // Додаємо у useEffect код блокуання скролу при відкритті модалки
    document.body.style.overflow = 'hidden';

    //  При розмонтуванні компонента додаємо наступне :
    return () => {
      // Видалення слухача клавіатури
      document.removeEventListener('keydown', handleKeyDown);
      // Видаляємо з useEffect код блокування скролу
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Створення розмітки компонента в кінці елемента document.body
  // Умовний рендеринг (note &&), якщо note - НЕ null
  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>{/* */}</div>
    </div>,
    document.body
  );
}
