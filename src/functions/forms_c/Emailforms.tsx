// EmailForm.tsx

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './emailforms.css'; // Import the CSS file for styling

type listType = {
  name: string;
  date: Date;
};

interface EmailFormProps {
  list: listType[];
}

const EmailForm: React.FC<EmailFormProps> = ({ list }) => {
  const form = useRef<HTMLFormElement>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isUserEmailSet, setIsUserEmailSet] = useState(false);
  const [contributorEmails, setContributorEmails] = useState<string[]>([]);
  const [newContributorEmail, setNewContributorEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  // Format the event list for the email body
  const formatListForEmail = (list: listType[]): string => {
    return list
      .map((item) => {
        const formattedDate = new Date(item.date).toLocaleDateString('pt-BR');
        return `Evento: ${item.name}\nData: ${formattedDate}\n`;
      })
      .join('\n');
  };

  // Send email using emailjs with success and error alerts
  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const emailsToSend = [userEmail, ...contributorEmails];

    if (!form.current) {
      alert('O formulário está vazio.');
      return;
    }

    emailsToSend.forEach((emailTo) => {
      emailjs
        .send(
          'contact_service', // Your service ID
          'contact_form', // Your template ID
          {
            message: formatListForEmail(list),
            user_name: username,
            user_email: emailTo,
          },
          'g1JrL406VtNUhD9mZ' // Your public key
        )
        .then(
          () => {
            console.log(`Email enviado para ${emailTo}`);
            alert(`✅ Email enviado com sucesso para ${emailTo}!`);
          },
          (error) => {
            console.error(`Erro ao enviar email para ${emailTo}: ${error.text}`);
            alert(`❌ Erro ao enviar email para ${emailTo}: ${error.text}`);
          }
        );
    });
  };

  // Handle adding/removing user email
  const addUserEmail = () => {
    if (userEmail) setIsUserEmailSet(true);
  };

  const removeUserEmail = () => {
    setUserEmail('');
    setIsUserEmailSet(false);
  };

  // Handle adding/removing contributor emails
  const addContributorEmail = () => {
    if (newContributorEmail && !contributorEmails.includes(newContributorEmail)) {
      setContributorEmails([...contributorEmails, newContributorEmail]);
      setNewContributorEmail('');
    }
  };

  const removeContributorEmail = (email: string) => {
    setContributorEmails(contributorEmails.filter((e) => e !== email));
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="box">
      <div className="mailtypes">
        <div className="mailtype">
          {/* User Email */}
          <div className="title">
            <label htmlFor="userEmail">E-mail Usuário</label>
          </div>
          <div className="df">
            {!isUserEmailSet ? (
              <>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Escrever e-mail"
                  className="input-field"
                />
                <button type="button" className="add" onClick={addUserEmail}>
                  Adicionar
                </button>
              </>
            ) : (
              <div className="user-email">
                <span>{userEmail}</span>
                <button type="button" onClick={removeUserEmail}>
                  X
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contributor Emails */}
        <div className="mailtype">
          <div className="title">E-mails Contribuintes</div>
          <div className="df">
            <input
              type="email"
              value={newContributorEmail}
              onChange={(e) => setNewContributorEmail(e.target.value)}
              placeholder="Escrever e-mail"
              className="input-field"
            />
            <button type="button" className="add" onClick={addContributorEmail}>
              Adicionar
            </button>
          </div>
          <div className="list">
            {contributorEmails.map((email, index) => (
              <div key={index} className="mail">
                <span>{email}</span>
                <button type="button" onClick={() => removeContributorEmail(email)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className="send">
        Enviar Datas
      </button>
    </form>
  );
};

export default EmailForm;
