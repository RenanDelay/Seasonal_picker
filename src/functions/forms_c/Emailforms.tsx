// Importações padrões
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

// Definição da lista de datas sazonais
type listType = {
  name: string;
  date: Date;
};

interface EmailFormProps {
  list: listType[];
}

// Formulário de envio de e-mail
const EmailForm: React.FC<EmailFormProps> = ({ list }) => {
  const form = useRef<HTMLFormElement>(null);

  // Estados para controle de emails
  const [userEmail, setUserEmail] = useState<string>('');
  const [isUserEmailSet, setIsUserEmailSet] = useState(false);
  const [contributorEmails, setContributorEmails] = useState<string[]>([]);
  const [newContributorEmail, setNewContributorEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  // Formatar a mensagem da lista de datas para o envio do template de e-mail
  const formatListForEmail = (list: listType[]): string => {
    return list
      .map((item) => {
        const formattedDate = new Date(item.date).toLocaleDateString('pt-BR');
        return `Evento: ${item.name}\nData: ${formattedDate}\n`;
      })
      .join('\n');
  };

  // Função para enviar e-mails usando o emailjs
  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    // Loop para enviar o e-mail para o usuário principal e todos os contribuidores
    const emailsToSend = [userEmail, ...contributorEmails];
    
    for (let emailTo of emailsToSend) {
      if (form.current) {
        emailjs
          .send(
            'contact_service', // Seu serviço
            'contact_form', // Seu template
            {
              message: formatListForEmail(list),
              user_name: username,
              user_email: emailTo,
            },
            'g1JrL406VtNUhD9mZ' // Seu public key
          )
          .then(
            () => {
              console.log(`Email enviado para ${emailTo}`);
            },
            (error) => {
              console.log(`Falha ao enviar e-mail para ${emailTo}: ${error.text}`);
            }
          );
      } else {
        console.log('Formulário vazio');
      }
    }
  };

  // Funções para adicionar e remover o e-mail do usuário
  const addUserEmail = () => {
    if (userEmail) setIsUserEmailSet(true);
  };

  const removeUserEmail = () => {
    setUserEmail('');
    setIsUserEmailSet(false);
  };

  // Funções para adicionar e remover e-mails contribuidores
  const addContributorEmail = () => {
    if (newContributorEmail && !contributorEmails.includes(newContributorEmail)) {
      setContributorEmails([...contributorEmails, newContributorEmail]);
      setNewContributorEmail('');
    }
  };

  const removeContributorEmail = (email: string) => {
    setContributorEmails(contributorEmails.filter(e => e !== email));
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      {/* Email Usuário */}
      <label>Email Usuário</label>
      {!isUserEmailSet ? (
        <>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Escrever e-mail"
          />
          <button type="button" onClick={addUserEmail}>Adicionar</button>
        </>
      ) : (
        <div>
          <span>{userEmail}</span>
          <button type="button" onClick={removeUserEmail}>X</button>
        </div>
      )}

      {/* E-mails contribuintes */}
      <label>E-mails contribuintes</label>
      <div>
        <input
          type="email"
          value={newContributorEmail}
          onChange={(e) => setNewContributorEmail(e.target.value)}
          placeholder="Escrever e-mail"
        />
        <button type="button" onClick={addContributorEmail}>Adicionar</button>
      </div>
      <ul>
        {contributorEmails.map((email, index) => (
          <li key={index}>
            {email}
            <button type="button" onClick={() => removeContributorEmail(email)}>X</button>
          </li>
        ))}
      </ul>

      {/* Nome */}
      <label>Nome</label>
      <input
        onChange={(e) => setUsername(e.target.value)}
        id="user_name"
        type="text"
        name="user_name"
        placeholder="Seu nome"
      />

      {/* Submit Button */}
      <button type="submit">Enviar Datas</button>
    </form>
  );
};

export default EmailForm;
