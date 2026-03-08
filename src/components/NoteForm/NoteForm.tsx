// ==========================================================================================
// Компонент NoteForm - форма створення нотатки
// ==========================================================================================

// Імпорт модуля зі стилями компонента
import css from './NoteForm.module.css';

// Імпорт компонентів Formik, Form, Field, ErrorMessage для роботи з формами
// (Перед цим в Терміналі - npm install formik)
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik/dist/types';

// Імпортуємо бібліотеку валідації в компонент форми
// (Перед цим в Терміналі - npm install yup)
import * as Yup from 'yup';

// Імпорт інтерфейса для однієї нотатки
import type { NoteFormValues } from '../../types/note';

// Оголошення інтерфейса NoteFormProps, який описує типи для пропсів компонента.
interface NoteFormProps {
  // onClose - функція закриття модального вікна
  onClose: () => void;
  // onCreate - функція створення нотатки, яка приймає об'єкт з даними нової нотатки
  onCreate: (createNote: NoteFormValues) => void;
}

// Створюємо змінну для початкових значень форми та заповнюємо її відповідно до інтерфейса NoteFormValues
const initialValuesForm: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

// Компонент NoteForm
export default function NoteForm({ onClose, onCreate }: NoteFormProps) {
  // Створюємо схему валідації для форми за допомогою Yup
  const validationSchemaNoteForm = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    tag: Yup.string().required('Tag is required'),
  });

  // Функція обробки відправки форми, яка приймає значення форми та допоміжні функції Formik
  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    // Виклик функції onCreate з поточними значеннями форми - створення нотатки
    onCreate(values);
    // Скидаємо форму до початкових значень
    actions.resetForm();
    // Закриваємо модальне вікно після створення нотатки
    onClose();
  };

  return (
    <Formik
      initialValues={initialValuesForm}
      onSubmit={handleSubmit}
      validationSchema={validationSchemaNoteForm}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
            // autoFocus={true}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>

          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
