import { useState, type FormEvent } from 'react';
import { sendContactMessage, type ContactPayload } from '../api';
import { useAuth } from '../auth';

type Errors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ContactPayload): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Le nom est obligatoire';
  if (!EMAIL_REGEX.test(values.email)) errors.email = "L'email n'est pas valide";
  if (!values.subject) errors.subject = 'Choisissez un sujet';
  if (values.message.trim().length < 10) errors.message = 'Le message doit faire au moins 10 caractères';
  return errors;
}

export function ContactPage() {
  const { user } = useAuth();
  const emptyForm: ContactPayload = { name: '', email: user?.email ?? '', subject: '', message: '' };
  const [values, setValues] = useState<ContactPayload>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [ticket, setTicket] = useState<string | null>(null);

  function update<K extends keyof ContactPayload>(field: K, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSending(true);
    const result = await sendContactMessage(values);
    setSending(false);
    setTicket(result.ticket);
  }

  function reset() {
    setValues(emptyForm);
    setErrors({});
    setTicket(null);
  }

  if (ticket) {
    return (
      <section className="card narrow">
        <h1>Contact</h1>
        <p role="status" className="success">
          Merci {values.name}, votre message a bien été envoyé. Numéro de ticket : {ticket}
        </p>
        <button type="button" onClick={reset}>
          Envoyer un autre message
        </button>
      </section>
    );
  }

  const field = (name: keyof ContactPayload) => ({
    id: name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const errorText = (name: keyof ContactPayload) =>
    errors[name] && (
      <p id={`${name}-error`} className="error">
        {errors[name]}
      </p>
    );

  return (
    <section className="card narrow">
      <h1>Contact</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Nom</label>
        <input {...field('name')} value={values.name} onChange={(e) => update('name', e.target.value)} />
        {errorText('name')}

        <label htmlFor="email">Email</label>
        <input {...field('email')} type="email" value={values.email} onChange={(e) => update('email', e.target.value)} />
        {errorText('email')}

        <label htmlFor="subject">Sujet</label>
        <select {...field('subject')} value={values.subject} onChange={(e) => update('subject', e.target.value)}>
          <option value="">-- Choisir --</option>
          <option value="commande">Ma commande</option>
          <option value="livraison">Livraison</option>
          <option value="autre">Autre</option>
        </select>
        {errorText('subject')}

        <label htmlFor="message">Message</label>
        <textarea {...field('message')} rows={5} value={values.message} onChange={(e) => update('message', e.target.value)} />
        {errorText('message')}

        <button type="submit" disabled={sending}>
          {sending ? 'Envoi en cours…' : 'Envoyer'}
        </button>
      </form>
    </section>
  );
}
