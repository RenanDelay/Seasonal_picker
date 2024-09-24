import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

type listType = {
  name: string;
  date: Date;
};

interface EmailFormProps {
  list: listType[];
}

const EmailForm: React.FC<EmailFormProps> = ({ list }) => {
  const form = useRef<HTMLFormElement>(null);

  const formatListForEmail = (list: listType[]): string => {
    return list
      .map((item) => {
        const formattedDate = new Date(item.date).toLocaleDateString('pt-BR'); 
        return `Evento: ${item.name}\nData: ${formattedDate}\n`;
      })
      .join('\n'); 
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm('contact_service', 'contact_form', form.current, 'g1JrL406VtNUhD9mZ')
        .then(
          () => {
            console.log('SUCCESSO!');
          },
          (error) => {
            console.log('FALHOU...', error.text);
          }
        );
    } else {
      console.log('Form reference is null');
    }
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Nome</label>
      <input type="text" name="user_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <input type="hidden" name="message" value={formatListForEmail(list)} />
      <input type="submit" value="Enviar" />
    </form>
  );
};

export default EmailForm;