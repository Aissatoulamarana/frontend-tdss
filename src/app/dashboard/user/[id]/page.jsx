import React from 'react';

const UserDetails = ({ user }) => {
  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>User Details</h1>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>First Name:</strong> {user.phone_number}
      </p>
      <p>
        <strong>Last Name:</strong> {user.role}
      </p>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  const res = await fetch(`http://localhost:8000/api/users/${id}/`);
  if (!res.ok) {
    return { notFound: true };
  }

  const user = await res.json();

  return {
    props: { user },
  };
}

export default UserDetails;
