import React from 'react';

const faqs = [
  {
    question: 'What is an NDA?',
    answer:
      'A Non-Disclosure Agreement (NDA) is a contract that protects confidential information shared between parties. It defines what is confidential and how it can be used.',
  },
  {
    question: 'When should I use a freelance agreement?',
    answer:
      'Use a freelance agreement whenever you do project-based work for a client. It should cover scope, deadlines, payment terms, ownership of work, and how disputes will be handled.',
  },
  {
    question: 'Do online templates replace legal advice?',
    answer:
      'No. Templates are helpful starting points but are not a substitute for advice from a licensed attorney, especially for complex or high-risk situations.',
  },
];

function LegalFaqsPage() {
  return (
    <section>
      <h2>Legal FAQs</h2>
      <p>These short answers are for educational purposes only and are not legal advice.</p>
      <ul>
        {faqs.map((faq) => (
          <li key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LegalFaqsPage;
