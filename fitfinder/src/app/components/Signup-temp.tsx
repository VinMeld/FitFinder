"use client"
import React, { useState } from 'react';
import { revalidatePath } from 'next/cache';
import {createClient} from "../utils/supabase-browser"
function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase= createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //setError(null);
    console.log(email,password)
    try {
        
        const user = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { isuser: false },
            emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        console.log(user);
        //revalidatePath('/')  //go back to home page idk how
    } catch (error) {
      console.log("Something went wrong!");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      <input type="submit" value="Sign Up" />
    </form>
  );
}

export default SignUpForm;
