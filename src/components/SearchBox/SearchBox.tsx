// ==========================================================================================
// Компонент SearchBox – текстове поле для пошуку по колекції
// ==========================================================================================

import { useState } from 'react';

// Імпорт бібліотеки react-hot-toast (Додатково - npm install react-hot-toast)
// toast - функція виклика повідомлення,
// Toaster - компонент для відображення повідомлень
// import toast from 'react-hot-toast';

// Імпорт модуля зі стилями компонента
import css from './SearchBox.module.css';

// Оголошення інтерфейса SearchBoxProps, який описує типи для пропсів компонента.
interface SearchBoxProps {
  onChangeText: (text: string) => void;
}

export default function SearchBox({ onChangeText }: SearchBoxProps) {
  const [searchText, setSearchText] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    // Перевірка значення поля
    // if (text === '') {
    //   // Якщо поле пусте, то виводиться повідомлення про помилку
    //   toast.error('Please enter your search query');
    //   // Вихід з функції
    //   return;
    // }
    setSearchText(text);
    onChangeText(text);
  };

  return (
    <input
      className={css.input}
      type="text"
      onChange={handleChange}
      value={searchText}
      placeholder="Search notes"
    />
  );
}
