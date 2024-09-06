'use server'
 
import { redirect } from 'next/navigation'
 
export async function reRoute(routePath: string) {
  redirect(routePath);
}