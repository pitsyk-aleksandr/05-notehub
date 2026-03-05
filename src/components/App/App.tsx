// ==========================================================================================
// Компонент App - контейнер додатка
// ==========================================================================================

// ------------------------------------------------------------------------------------------

// Імпорт модуля useState - для роботи зі станом з REACT
import { useEffect, useState } from 'react';

// Імпорт бібліотеки react-hot-toast (Додатково - npm install react-hot-toast)
// toast - функція виклика повідомлення,
// Toaster - компонент для відображення повідомлень
import toast, { Toaster } from 'react-hot-toast';

// Імпорт модуля зі стилями компонента
import css from './App.module.css';

// Імпорт компонента SearchBox
import SearchBox from '../SearchBox/SearchBox';

// Імпорт компонента NoteList
import NoteList from '../NoteList/NoteList';

// Імпорт компонента Pagination
import Pagination from '../Pagination/Pagination';

// Імпорт компонента ErrorMessage
import ErrorMessage from '../ErrorMessage/ErrorMessage';

// Імпорт компонента Loader
import Loader from '../Loader/Loader';

// Імпорт компонента Modal
import Modal from '../Modal/Modal';

// Імпорт інтерфейса для однієї нотатки
// import { type Note } from '../../types/note';

// Iмпорт функції для HTTP-запроса
import { fetchNotes } from '../../services/noteService';

// Імпорт хук useQuery, який виконує асинхронні запити та автоматично керує станами завантаження,
// помилок та збереженням даних, значно спрощуючи роботу з API.
import { useQuery } from '@tanstack/react-query';

// Імпорт keepPreviousData - для збереження попереднього запиту, поки не прийдуть нові дані
import { keepPreviousData } from '@tanstack/react-query';

// Імпорт хук useDebouncedCallback(callback, delay) з бібліотеки use-debounce.
// Він дозволяє створити "відкладену" версію функції — тобто таку, яка не викликається
// одразу при кожному вводі символа, а лише через певний час після останньої дії.
import { useDebouncedCallback } from 'use-debounce';

export default function App() {
  // Оголошуємо і типизуємо стан - рядок з пошуком
  const [query, setQuery] = useState<string>('');
  // Оголошуємо і типизуємо стан - загальна кількість сторінок
  const [totalPages, setTotalPages] = useState<number>(1);
  // Оголошуємо і типизуємо стан - номер поточної сторінки
  const [page, setPage] = useState<number>(1);
  // Оголошуємо і типизуємо стан - чи відкрите модальне вікно
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Оголошуємо і типизуємо стан - масив фільмів -
  // const [movies, setMovies] = useState<Movie[]>([]);
  // Оголошуємо і типизуємо стан - один обраний фільм
  // const [noteSelect, setNoteSelect] = useState<Note | null>(null);

  // --------------------------------------------------------------------------------------------
  // хук useQuery повертає об’єкт з корисною інформацією про запит :
  //    data – дані, які були успішно отримані в результаті запиту.
  //    error – якщо запит завершився помилкою, ця властивість містить інформацію про помилку.
  //    isLoading – якщо запит ще виконується, значення буде true.
  //    isError – якщо запит не вдалося виконати (наприклад, через мережеві помилки), значення буде true.
  //    isSuccess – якщо запит успішно виконався і дані отримано, значення буде true.
  const {
    data: dataNotes,
    isLoading,
    isError,
  } = useQuery({
    // ключ запиту - масив, який унікально ідентифікує запит і його параметри, що дозволяє React Query ефективно кешувати та повторно використовувати дані для однакових запитів.
    queryKey: ['notes', query, page],

    // функція запиту - асинхронна функція, яка виконує HTTP-запит і повертає дані.
    queryFn: async () => {
      // Виконуємо запит за допомогою функції fetchMovies, передаючи рядок запиту та номер сторінки,
      // і отримуємо масив фільмів та загальну кількість сторінок
      const { notes, totalPages } = await fetchNotes(query, page);
      // Записуємо стан - загальна кількість сторінок
      setTotalPages(totalPages);
      // Повертаємо в data масив фільмів
      return notes;
    },

    // властивість яка дозволяє виконувати запит лише тоді, коли рядок запиту не порожній,
    // що запобігає виконанню запиту при початковому завантаженні компонента
    // або коли користувач не ввів нічого в рядок пошуку.
    // Відключена, бо хочу рендерити при пустому пошуку
    // enabled: query !== '',

    // властивість яка дозволяє на час завантаження нових даних показувати попередні або тимчасові дані,
    // щоб уникнути порожнього стану або мерехтіння інтерфейсу під час очікування відповіді від сервера.
    placeholderData: keepPreviousData,
  });
  // ---------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------
  // Використовуємо useEffect для відстеження змін в даних
  // та виклику toast-повідомлення, якщо масив фільмів порожній
  useEffect(() => {
    // Якщо в результаті запиту масив фільмів порожній, виводимо повідомлення:
    if (dataNotes && dataNotes.length === 0) {
      toast.error('No notes found for your request');
    }
  }, [dataNotes]);
  // ---------------------------------------------------------------------------------------------

  // Функції зміни стану модального вікна (відкриття/закриття)
  const openModal = () => {
    // Стан - модальне вікно
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Стан - модальне вікно
    setIsModalOpen(false);
  };

  // Функція зміни стану рядка запиту - отримує значення строки запиту і записує його в стан :
  // Виконана з затримкою (1000 мс) за допомогою useDebouncedCallback
  const handleSearch = useDebouncedCallback((text: string) => {
    // Скидаємо номер сторінки на 1 при новому пошуку
    setPage(1);
    // Змінюємо стан - на значення строки запиту
    setQuery(text);
  }, 1000);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        <SearchBox onChangeText={handleSearch} />
        {/* Пагінація */}
        {/* Умовний рендеринг компонента Pagination в залежності від кількості сторінок */}
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} setPage={setPage} page={page} />
        )}
        {/* Кнопка створення нотатки */}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {/* Умовний рендеринг компонента NoteList в залежності від кількості нотаток */}
      {dataNotes && dataNotes.length > 0 && <NoteList notes={dataNotes} />}
      <Toaster />
      {/* Умовний рендеринг компонента ErrorMessage в залежності від стану */}
      {isError && <ErrorMessage />}
      {/* Умовний рендеринг компонента Loader в залежності від стану */}
      {isLoading && <Loader />}
      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
}
