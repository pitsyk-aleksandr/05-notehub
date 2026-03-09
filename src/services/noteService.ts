// ==========================================================================================
// Функції для виконання HTTP-запитів
// ==========================================================================================
// ------------------------------------------------------------------------------------------
// fetchNotes : має виконувати запит для отримання колекції нотаток із сервера.
// Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук);
// ------------------------------------------------------------------------------------------
// createNote: має виконувати запит для створення нової нотатки на сервері.
// Приймає вміст нової нотатки та повертає створену нотатку у відповіді;
// ------------------------------------------------------------------------------------------
// deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором.
// Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.
// ------------------------------------------------------------------------------------------

// Імпорт бібліотеки axios
import axios from 'axios';

// Імпорт інтерфейсів
import type { Note, NoteFormValues } from '../types/note';

// Отримуємо значення змінної оточення (з файлу .env)
// Не забуваємо додати .env в файл .gitignore !!!
// Додатково треба додати в Versel (Settings → Environment Variables)
const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
const myAuthorization = 'Bearer ' + myKey;

const BASE_URL = 'https://notehub-public.goit.study/api/notes';

// Типізація відповіді Get-запиту від Axios - згідно структури бекенда :
// https://notehub-public.goit.study/api/docs/#/Notes/getNote
interface GetNotesHttpResponse {
  notes: Note[]; // Відповідь містить масив нотаток у властивості results
  totalPages: number; // Загальна кількість сторінок результатів
}

// Типізація відповіді Delete-запиту від Axios :
// interface DeleteNotesHttpResponse {
//   noteDelete: Note; // Відповідь містить нотатку у властивості results
// }
type DeleteNotesHttpResponse = Note; // Відповідь містить нотатку у властивості results

// Типізація відповіді Post-запиту від Axios :
// interface PostNotesHttpResponse {
//   noteNew: Note; // Відповідь містить нотатку у властивості results
// }
type PostNotesHttpResponse = Note; // Відповідь містить нотатку у властивості results

// ==========================================================================================
// fetchNotes : має виконувати запит для отримання колекції нотаток із сервера.
// Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук)
// ==========================================================================================
// Структура запиту :
// ------------------------------------------------------------------------------------------
// https://notehub-public.goit.study/api/notes?search=example_search&tag=Work&page=2&perPage=10&sortBy=updated
// ------------------------------------------------------------------------------------------
// Базовий URL
// https://notehub-public.goit.study/api/notes
// ------------------------------------------------------------------------------------------
// Search notes by title or content - Пошук нотаток по заголовку або контенту
// search=example_search
// ------------------------------------------------------------------------------------------
// Filter notes by tag - Фільтрація по тегу (не обов'язково !)
// tag=Work
// ------------------------------------------------------------------------------------------
// Page number for pagination - Номер сторінки для пагінації
// page=2
// ------------------------------------------------------------------------------------------
// Number of notes per page - Кількість нотаток на сторінці
// perPage=10
// ------------------------------------------------------------------------------------------
// Sort notes by created or updated field - Сортування за часом створення адо оновлення
// (не обов'язково !)
// sortBy=updated
// ------------------------------------------------------------------------------------------

export async function fetchNotes(
  nameSearch: string,
  pageCurrent: number = 1
): Promise<GetNotesHttpResponse> {
  let url = BASE_URL;
  if (nameSearch !== '') {
    url = url + `?search=${nameSearch}&page=${pageCurrent}&perPage=12`;
  } else {
    url = url + `?&page=${pageCurrent}&perPage=12`;
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: myAuthorization,
    },
  };

  // Виконуємо HTTP-запит
  const response = await axios.get<GetNotesHttpResponse>(url, options);
  console.log('Fetch - GET :');
  console.log('response.data.notes', response.data.notes);
  console.log('totalPages', response.data.totalPages);

  // Повертаємо значення notes та totalPages відповіді
  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages,
  };
}
// ==========================================================================================

// ==========================================================================================
// deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором.
// Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.
// ==========================================================================================
// Структура запиту :
// ------------------------------------------------------------------------------------------
// https://notehub-public.goit.study/api/notes/65ca67e7ae7f10c88b598384
// ------------------------------------------------------------------------------------------
// Базовий URL
// https://notehub-public.goit.study/api/notes
// ------------------------------------------------------------------------------------------
// Ідентифікатор запису для видалення
// "id": string    "65ca67e7ae7f10c88b598384"
// ------------------------------------------------------------------------------------------
export async function deleteNote(
  noteId: string
): Promise<DeleteNotesHttpResponse> {
  let url = BASE_URL;
  if (noteId !== '') {
    url = url + `/${noteId}`;

    const options = {
      // method: 'DELETE',
      headers: {
        accept: 'application/json',
        Authorization: myAuthorization,
      },
    };

    // Виконуємо HTTP-запит на видалення запису
    const response = await axios.delete<DeleteNotesHttpResponse>(url, options);
    console.log('Delete :');
    console.log('response.data.note', response.data);

    // Повертаємо інформацію про видалену нотатку у відповіді
    return response.data;
  } else {
    throw new Error('Note ID is required for deletion');
  }
}
// ==========================================================================================

// ==========================================================================================
// createNote: має виконувати запит для створення нової нотатки на сервері.
// Приймає вміст нової нотатки та повертає створену нотатку у відповіді
// ==========================================================================================
// curl -X 'POST' \
//   'https://notehub-public.goit.study/api/notes' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//      "title": "Sample Note",
//      "content": "",
//      "tag": "Todo"
//   }'
// ------------------------------------------------------------------------------------------
// Базовий URL
// https://notehub-public.goit.study/api/notes
// ------------------------------------------------------------------------------------------
export async function createNote(
  noteCreate: NoteFormValues
): Promise<PostNotesHttpResponse> {
  const url = BASE_URL;

  const options = {
    headers: {
      accept: 'application/json',
      Authorization: myAuthorization,
    },
  };

  // Виконуємо HTTP-запит на додавання нового запису
  const response = await axios.post<PostNotesHttpResponse>(
    url,
    noteCreate,
    options
  );
  console.log('Add new - POST :');
  console.log('response.data', response.data);

  // Повертаємо інформацію про видалену нотатку у відповіді
  return response.data;
}
// ==========================================================================================
