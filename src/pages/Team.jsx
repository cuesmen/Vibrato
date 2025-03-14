import React from 'react';

const Team = () => {
  // Esempio statico di dati; in un'app reale questi verrebbero recuperati da un'API o database
  const teamMembers = [
    { id: 1, name: 'Alice', role: 'Manager' },
    { id: 2, name: 'Bob', role: 'Sviluppatore' },
    { id: 3, name: 'Carla', role: 'Designer' },
  ];

  return (
    <div>
      <h1>Team</h1>
      <p>Visualizza i membri del team e i loro ruoli.</p>
      <ul>
        {teamMembers.map(member => (
          <li key={member.id}>
            <strong>{member.name}</strong> - {member.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Team;
