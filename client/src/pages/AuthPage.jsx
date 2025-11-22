import React from 'react';

function AuthPage() {
  return (
    <section>
      <h2>Auth (OTP)</h2>
      <p>Sign in using a one-time email code powered by Supabase Auth.</p>
      <h3>Planned Sections</h3>
      <ul>
        <li>Request code form (email input)</li>
        <li>Verify code form</li>
        <li>Status/messages about the signed-in user</li>
      </ul>
    </section>
  );
}

export default AuthPage;
