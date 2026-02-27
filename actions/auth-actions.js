'use server';

import { hashUserPassword } from "@/lib/hash";
import createUser from "@/lib/users";
import { redirect } from "next/navigation";

export async function signup(prevState, formData){
    const email = formData.get('email');
    const password = formData.get('password');

    let errors = {};

    if(!email.includes('@')){
        errors.email = 'Please enter a valid email';
    }

    if(password.trim().length < 8){
        errors.email = 'Password must be at least 8 characters long.';
    }

    if(Object.keys(errors).length > 0){
        return {
            errors
        }
    }

    const hashedPassword = hashUserPassword(password);

    try {
        createUser(email, hashedPassword);
    } catch (error) {
        if(error.code === 'SQLLITE_CONSTRAINT_UNIQUE'){
            return {
                errors: {
                    email: 'It seems like an account for the chosen email already exists!'
                }
            }
        }
    }

    redirect('/training');
}