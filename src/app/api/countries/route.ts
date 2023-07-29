import {NextResponse} from 'next/server'
import { supabase } from '../../../../lib/supabaseClient'
import {v4 as uuidv4} from "uuid";
import { createClient as createAdminClient} from '@supabase/supabase-js'



export async function POST(request: Request) {
  // Delete all users from supabase, make admin client then do it 
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  const supabaseAdminClient = createAdminClient(URL, KEY);
  // Delete all users
  const { data: users, error:error1 } = await supabaseAdminClient
    .from('users')
    .select('id')

    if (error1) {
      console.error("Error fetching users: ", error1);
      return new NextResponse(JSON.stringify({ message: 'Error fetching users', error: error1 }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
      });
  }
    for (const user of users) {
      const { error:terror } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)

    const { data, error } = await supabaseAdminClient.auth.admin.deleteUser(
        user.id
      )
    console.log(error);
  }
  // for (const user of users) {
  //   const { error } = await supabaseAdminClient
  //       .from('users')
  //       .delete()
  //       .match({ id: user.id })

  //   if (error) {
  //       console.error("Error deleting user from own table: ", error);
  //   }

  // If successful, send a status code of 200
  return new NextResponse(JSON.stringify({ message: 'Users deleted successfully' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}









export async function GET(request: Request) {
  const usersData = generateUsersData(20);
  console.log(usersData)
  let response = await createUsers(usersData)
  console.log(response)
  // If successful, send a status code of 200
  return new NextResponse(JSON.stringify({ message: 'Users signed up and inserted successfully' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}



function signUpAndInsert(user : any) {
  const { email, password, firstName, lastName, phoneNumber } = user;

  return new Promise(async (resolve, reject) => {
    const signUpResponse :  any = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName,
          lastName,
          phoneNumber,
          isuser: false,
        }
      }
    })

    if (signUpResponse.error) {
      console.error('Error during sign up:', signUpResponse.error.message)
      reject(signUpResponse.error.message);
    }

    if (!signUpResponse.data || !signUpResponse.data.user) {
      console.error('User object is undefined.')
      reject('User object is undefined.');
    }
    if(!signUpResponse || !signUpResponse.data || !signUpResponse.data.user || !signUpResponse.data.user.id){
      console.error('User id is undefined.')
      reject('User id is undefined.');
    }
    console.log(signUpResponse)
    console.log('User signed up and inserted successfully')
    resolve('User signed up and inserted successfully');
  })
}

async function createUsers(usersData : any) {
  let index = 0;  // Start at the first user

  if (index >= 20) {
    console.log('All users created');
    return;
  }

  signUpAndInsert(usersData[index]).then(() => {
    index += 1;  // Move to the next user
    setTimeout(createUsers, 31000);  // Delay the next request by 31 seconds
  }).catch(error => {
    console.error(`Failed to create user: ${error}`);
  })
}


function generateUsersData(numUsers: number) {
  const usersData = [];

  const firstNames = ["John", "Michael", "Sarah", "Jessica", "Jacob", "Mohammed", "Emily", "Emma", "Amanda", "Andrew"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

  for(let i = 0; i < numUsers; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      const password = `Password${i}!`;
      const phoneNumber = Math.floor(Math.random() * 9000000000) + 1000000000;  // Generate a 10 digit number

      usersData.push({
          firstName,
          lastName,
          email,
          password,
          phoneNumber
      });
  }

  return usersData;
}

